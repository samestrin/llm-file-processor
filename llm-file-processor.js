#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');
const { program } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const { glob } = require('glob');
const { mkdirp } = require('mkdirp');
const _ = require('lodash');

// Load environment variables
dotenv.config();

// Configure CLI
program
  .name('llm-file-processor')
  .description('Process files using LLM with a custom prompt')
  .version('1.0.0')
  .requiredOption('-p, --prompt-file <filename>', 'Path to the prompt file')
  .option('-f, --file <filename>', 'Path to the file to be processed')
  .option('-d, --directory <directory>', 'Path to the directory containing files to be processed')
  .option('-o, --output <directory>', 'Specify a custom output directory') // New option
  .option('--insert-before-ext <text>', 'Insert text before file extension (e.g., ".test" to create "file.test.js" from "file.js")')
  .option('--output-ext <extension>', 'Change or add file extension (e.g., "json" to save as "file.log.json")')
  .option('-m, --merge <filename>', 'Merge all processed files into a single output file with the specified <filename>')
  .option('--dry-run', 'Combine prompts and files without sending to LLM', false)
  .option('--batch-size <size>', 'Number of files to process in one batch', 1)
  .option('--delay <ms>', 'Delay between API calls in milliseconds', 500)
  .parse(process.argv);

const options = program.opts();

/**
 * Creates an output directory name with a timestamp.
 * 
 * @returns {string} The path to a timestamped output directory.
 * 
 * @example
 * // Get a timestamped output directory path
 * const outputDir = getTimestampedOutputDir(); // './processed-2023-01-01T12-00-00'
 */
const getTimestampedOutputDir = () => { // Renamed for clarity
  const now = new Date();
  const timestamp = now.toISOString().replace(/:/g, '-').replace(/\..+/, '');
  return `./processed-${timestamp}`;
};

/**
 * Validates required environment variables.
 * Checks if OPENAI_API_KEY and OPENAI_MODEL are set in the .env file.
 * Exits the process with code 1 if any required variable is missing.
 *
 * @throws {Error} Exits process if required environment variables are not set
 */
const validateEnv = () => {
  if (!process.env.OPENAI_API_KEY) {
    console.error(chalk.red('Error: OPENAI_API_KEY is not set in .env file'));
    process.exit(1);
  }
  
  if (!process.env.OPENAI_MODEL) {
    console.error(chalk.red('Error: OPENAI_MODEL is not set in .env file'));
    process.exit(1);
  }
};

/**
 * Processes a file with an LLM using the provided prompt.
 * 
 * @param {string} promptContent - The content of the prompt to send to the LLM.
 * @param {string} fileContent - The content of the file to be processed.
 * @param {string} fileName - The name of the file being processed.
 * @returns {Object|null} An object containing the processed content and file name, or null if processing failed.
 *                        For dry runs, returns an object with the prompt and fileName.
 * 
 * @example
 * // Process a file with the LLM
 * const result = await processFileWithLLM(promptText, fileText, 'example.js');
 */
const processFileWithLLM = async (promptContent, fileContent, fileName) => {
  // Combine prompt and file content
  const systemPrompt = `You are a file processing assistant. Follow the rules below to process the provided file content.`;
  
  const userPrompt = `
# Rules
${promptContent}

# File
\`\`\`
${fileContent}
\`\`\`

Process the provided File contents using the Rules, then return the results in the following JSON format only:
{
  "filename": "${path.basename(fileName)}",
  "processedContents": "processed file content here"
}

Only return valid JSON that matches this schema exactly. Do not include any explanations, markdown formatting, or other text outside the JSON.`;

  if (options.dryRun) {
    return { 
      prompt: userPrompt,
      fileName: fileName 
    };
  }


  try {
    // Get API URL from environment variable or use default Open AI endpoint
    const apiUrl = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';

    const response = await axios.post(
      apiUrl,
      {
        model: process.env.OPENAI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    try {
      const jsonResponse = JSON.parse(response.data.choices[0].message.content);
      return {
        fileName: fileName,
        processedContent: jsonResponse.processedContents
      };
    } catch (parseError) {
      console.error(chalk.red(`Error parsing JSON response for ${fileName}: ${parseError.message}`));
      console.log(chalk.yellow('Raw response:'), response.data.choices[0].message.content);
      return null;
    }
  } catch (error) {
    console.error(chalk.red(`Error calling Groq API for ${fileName}: ${error.message}`));
    if (error.response) {
      console.error(chalk.red('API response:'), error.response.data);
    }
    return null;
  }
};

/**
 * Validates a prompt with the LLM to ensure it's suitable for file processing.
 * 
 * @param {string} promptContent - The content of the prompt to validate.
 * @returns {boolean} True if the prompt is valid, false otherwise.
 * 
 * @example
 * // Validate a prompt before batch processing
 * const isValid = await validatePrompt(promptText);
 * if (isValid) {
 *   // Proceed with batch processing
 * }
 */
const validatePrompt = async (promptContent) => {
  const validationPrompt = `
Please evaluate the following prompt and decide if it is a valid prompt that can be used to process a text file and return a structured JSON output.

Consider the type of task the prompt is designed for (e.g., formatting, code review, data extraction).
The prompt should clearly define the rules for processing the file and the expected JSON output format.

# Prompt to evaluate
${promptContent}

Return only JSON in the following format:
{
  "isValid": true/false,
  "reason": "Brief explanation of your decision, including the type of prompt you believe it is (e.g., formatting, code_review, data_extraction, summarization).",
  "promptType": "formatting|code_review|data_extraction|summarization|other"
}`;

  try {
    // Get API URL from environment variable or use default Open AI endpoint
    const apiUrl = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
    const spinner = ora('Validating prompt...').start();

    const response = await axios.post(
       apiUrl,
      {
        model: process.env.OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are a prompt validation assistant. Your task is to determine if a given prompt is suitable for file processing tasks and to identify its type.' },
          { role: 'user', content: validationPrompt }
        ],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    spinner.stop();

    try {
      const jsonResponse = JSON.parse(response.data.choices[0].message.content);
      if (!jsonResponse.isValid) {
        console.error(chalk.red(`Prompt validation failed: ${jsonResponse.reason}`));
        return false;
      }
      // You can add more specific validation logic here based on jsonResponse.promptType if needed
      console.log(chalk.green(`Prompt validation successful. Type: ${jsonResponse.promptType}. Reason: ${jsonResponse.reason}`));
      return true;
    } catch (parseError) {
      console.error(chalk.red(`Error parsing validation response: ${parseError.message}`));
      console.error(chalk.yellow('Raw validation response:'), response.data.choices[0].message.content);
      return false;
    }
  } catch (error) {
    console.error(chalk.red(`Error validating prompt: ${error.message}`));
    if (error.response) {
      console.error(chalk.red('API response:'), error.response.data);
    }
    return false;
  }
};

/**
 * Processes files in batches and collects the results.
 * 
 * @param {string} promptContent - The content of the prompt to use for processing.
 * @param {Array<string>} files - Array of file paths to process.
 * @param {string} outputDir - The directory to save processed files to.
 * @param {number} batchSize - The number of files to process in one batch.
 * @returns {Array<Object>} Array of objects containing the processed files' information.
 * 
 * @example
 * // Process a batch of files
 * const results = await processBatchAndCollect(promptText, fileList, './output', 5);
 */
const processBatchAndCollect = async (promptContent, files, outputDir, batchSize) => {
  const batches = _.chunk(files, batchSize);
  const allResults = [];
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(chalk.blue(`Processing batch ${i+1}/${batches.length} (${batch.length} files)`));
    
    const batchPromises = batch.map(async (file) => {
      const spinner = ora(`Processing ${path.basename(file)}...`).start();
      
      try {
        const fileContent = await fs.readFile(file, 'utf8');
        const result = await processFileWithLLM(promptContent, fileContent, file);
        
        if (options.dryRun) {
          spinner.succeed(`Dry run for ${path.basename(file)} complete`);
          return null;
        }
        
        if (!result || typeof result.processedContent === 'undefined') {
          spinner.fail(`Failed to process ${path.basename(file)} or received no content`);
          return null;
        }
        
        // Transform the filename based on CLI options
        const transformedFilename = transformFilename(path.basename(file));
        const outputPath = path.join(outputDir, transformedFilename);
        
        // Ensure content is a string before writing
        const contentToWrite = typeof result.processedContent === 'string' 
          ? result.processedContent 
          : JSON.stringify(result.processedContent, null, 2);
        
        await fs.writeFile(outputPath, contentToWrite);
        spinner.succeed(`Processed ${path.basename(file)} → ${transformedFilename}`);
        
        // Return the result for potential merging
        return {
          filename: transformedFilename,
          content: contentToWrite
        };
      } catch (error) {
        spinner.fail(`Error processing ${path.basename(file)}: ${error.message}`);
        return null;
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    // Filter out null results and add to allResults
    allResults.push(...batchResults.filter(r => r !== null));
    
    // Add delay between batches if not the last batch
    if (i < batches.length - 1 && !options.dryRun) {
      console.log(chalk.yellow(`Waiting ${options.delay}ms before next batch...`));
      await new Promise(resolve => setTimeout(resolve, options.delay));
    }
  }
  
  return allResults;
};

/**
 * Transforms a filename based on CLI options.
 * 
 * Applies insertBeforeExt and outputExt options to modify the filename.
 * 
 * @param {string} filename - The original filename.
 * @returns {string} The transformed filename with modifications applied.
 * 
 * @example
 * // Transform a filename using CLI options
 * const newFilename = transformFilename('example.js');
 */
const transformFilename = (filename) => {
  let basename = path.basename(filename);
  const extname = path.extname(basename);
  const nameWithoutExt = basename.slice(0, basename.length - extname.length);
  
  // Apply insert-before-ext option if provided
  if (options.insertBeforeExt) {
    basename = nameWithoutExt + options.insertBeforeExt + extname;
  }
  
  // Apply output-ext option if provided
  if (options.outputExt) {
    // Check if the file already has the specified extension
    const requestedExt = options.outputExt.startsWith('.') ? options.outputExt : `.${options.outputExt}`;
    if (!basename.endsWith(requestedExt)) {
      basename = basename + requestedExt;
    }
  }
  
  return basename;
};

/**
 * Merges all processed files into a single output file.
 * 
 * @param {Array<Object>} results - Array of objects containing processed file information.
 * @param {string} outputDir - The directory where the merged file will be saved.
 * @param {string} mergeOutputFilename - The filename for the merged output file.
 * @returns {Promise<void>}
 * 
 * @example
 * // Merge processed files into a single output
 * await mergeProcessedFiles(results, './output', 'merged-output.txt');
 */
const mergeProcessedFiles = async (results, outputDir, mergeOutputFilename) => {
  if (results.length === 0) {
    console.log(chalk.yellow('No files to merge.'));
    return;
  }
  
  // Use the provided filename directly for the merged file
  const mergePath = path.join(outputDir, mergeOutputFilename);
  
  // Create the merged content
  let mergedContent = '';
  
  for (const result of results) {
    mergedContent += `\n\n# File: ${result.filename}\n\n${result.content}`;
  }
  
  // Write the merged file
  await fs.writeFile(mergePath, mergedContent.trim());
  console.log(chalk.green(`Merged ${results.length} files into: ${mergePath}`));
};

/**
 * Main function that orchestrates the file processing workflow.
 * 
 * Validates environment variables and options, reads files, processes them with the LLM,
 * and handles output including potential file merging.
 * 
 * @async
 * @returns {Promise<void>}
 * 
 * @example
 * // Execute the main function
 * main();
 */
const main = async () => {
  try {
    validateEnv();
    
    // Validate inputs
    if (!options.file && !options.directory) {
      console.error(chalk.red('Error: Either --file or --directory option is required'));
      process.exit(1);
    }
    
    if (options.file && options.directory) {
      console.error(chalk.red('Error: Cannot use both --file and --directory options at the same time'));
      process.exit(1);
    }
    
    // Read prompt file
    const promptContent = await fs.readFile(options.promptFile, 'utf8');
    console.log(chalk.green('Prompt file loaded successfully'));
    
    // Determine and create output directory if not dry run
    let outputDir = null;
    if (!options.dryRun) {
      if (options.output) { // Check if custom output directory is provided
        outputDir = options.output;
      } else {
        outputDir = getTimestampedOutputDir(); // Use timestamped if not
      }
      await mkdirp(outputDir); // Create the determined output directory
      console.log(chalk.green(`Output directory set to: ${outputDir}`));
    }
    
    // Track processed results for potential merging
    const processedResults = [];
    
    // Single file processing
    if (options.file) {
      console.log(chalk.blue(`Processing single file: ${options.file}`));
      
      try {
        const fileContent = await fs.readFile(options.file, 'utf8');
        const result = await processFileWithLLM(promptContent, fileContent, options.file);
        
        if (options.dryRun) {
          console.log(chalk.yellow('Dry run - combined prompt:'));
          console.log(result.prompt);
        } else if (result) {
          // Transform the filename based on CLI options
          const transformedFilename = transformFilename(path.basename(options.file));
          const outputPath = path.join(outputDir, transformedFilename);
          
          // Ensure content is a string before writing
          const contentToWrite = typeof result.processedContent === 'string' 
            ? result.processedContent 
            : JSON.stringify(result.processedContent, null, 2);
          
          await fs.writeFile(outputPath, contentToWrite);
          console.log(chalk.green(`File processed and saved to: ${outputPath}`));
          
          // Store for potential merging
          processedResults.push({
            filename: transformedFilename,
            content: contentToWrite
          });
        }
      } catch (error) {
        console.error(chalk.red(`Error reading or processing file: ${error.message}`));
        process.exit(1);
      }
    } else {
      // Directory processing
      console.log(chalk.blue(`Processing directory: ${options.directory}`));
      
      // Get all files in directory
      const files = await glob(`${options.directory}/**/*`, { nodir: true });
      
      if (files.length === 0) {
        console.error(chalk.red(`No files found in directory: ${options.directory}`));
        process.exit(1);
      }
      
      console.log(chalk.blue(`Found ${files.length} files to process`));
      
      // Validate prompt for batch processing (only if more than one file and not dry run)
      if (files.length > 1 && !options.dryRun) {
        const isValid = await validatePrompt(promptContent);
        if (!isValid) {
          console.error(chalk.red('Prompt validation failed. Use --dry-run to test your prompt.'));
          process.exit(1);
        }
      }
      
      // Process files in batches and collect results
      const batchResults = await processBatchAndCollect(promptContent, files, outputDir, parseInt(options.batchSize));
      processedResults.push(...batchResults);
      
      if (!options.dryRun) {
        console.log(chalk.green(`All files processed and saved to: ${outputDir}`));
      } else {
        console.log(chalk.yellow('Dry run completed. No files were processed.'));
      }
    }
    
    // Merge files if requested and not in dry run mode
    if (options.merge && !options.dryRun && processedResults.length > 0) {
      await mergeProcessedFiles(processedResults, outputDir, options.merge); 
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
};

main();