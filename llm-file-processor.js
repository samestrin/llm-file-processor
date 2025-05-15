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
  .option('--dry-run', 'Combine prompts and files without sending to LLM', false)
  .option('--batch-size <size>', 'Number of files to process in one batch', 1)
  .option('--delay <ms>', 'Delay between API calls in milliseconds', 500)
  .parse(process.argv);

const options = program.opts();

// Create output directory with timestamp
const getOutputDir = () => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/:/g, '-').replace(/\..+/, '');
  return `./processed-${timestamp}`;
};

// Validate required environment variables
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

// Process a file with the LLM
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

// Validate prompt with LLM (only for bulk processing)
const validatePrompt = async (promptContent) => {
  const validationPrompt = `
Please evaluate the following formatting prompt and decide if it is a valid formatting prompt that can be used to modify the format of an existing text file and transform it into a new text file.

# Prompt to evaluate
${promptContent}

Return only JSON in the following format:
{
  "isValid": true/false,
  "reason": "Brief explanation of your decision"
}`;

  try {
    const spinner = ora('Validating prompt...').start();
    
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are a prompt validation assistant.' },
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
      console.log(chalk.green(`Prompt validation successful: ${jsonResponse.reason}`));
      return true;
    } catch (parseError) {
      console.error(chalk.red(`Error parsing validation response: ${parseError.message}`));
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

// Process files in batches
const processBatch = async (promptContent, files, outputDir, batchSize) => {
  const batches = _.chunk(files, batchSize);
  
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
          return result;
        }
        
        if (!result) {
          spinner.fail(`Failed to process ${path.basename(file)}`);
          return null;
        }
        
        const outputPath = path.join(outputDir, path.basename(file));
        await fs.writeFile(outputPath, result.processedContent);
        spinner.succeed(`Processed ${path.basename(file)}`);
        return result;
      } catch (error) {
        spinner.fail(`Error processing ${path.basename(file)}: ${error.message}`);
        return null;
      }
    });
    
    await Promise.all(batchPromises);
    
    // Add delay between batches if not the last batch
    if (i < batches.length - 1 && !options.dryRun) {
      console.log(chalk.yellow(`Waiting ${options.delay}ms before next batch...`));
      await new Promise(resolve => setTimeout(resolve, options.delay));
    }
  }
};

// Main function
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
    
    // Create output directory if not dry run
    let outputDir = null;
    if (!options.dryRun) {
      outputDir = getOutputDir();
      await mkdirp(outputDir);
      console.log(chalk.green(`Output directory created: ${outputDir}`));
    }
    
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
          const outputPath = path.join(outputDir, path.basename(options.file));
          await fs.writeFile(outputPath, result.processedContent);
          console.log(chalk.green(`File processed and saved to: ${outputPath}`));
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
      
      // Process files in batches
      await processBatch(promptContent, files, outputDir, parseInt(options.batchSize));
      
      if (!options.dryRun) {
        console.log(chalk.green(`All files processed and saved to: ${outputDir}`));
      } else {
        console.log(chalk.yellow('Dry run completed. No files were processed.'));
      }
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
};

main();