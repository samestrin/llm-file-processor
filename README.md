# LLM File Processor

[![Star on GitHub](https://img.shields.io/github/stars/samestrin/llm-file-processor?style=social)](https://github.com/samestrin/llm-file-processor/stargazers) [![Fork on GitHub](https://img.shields.io/github/forks/samestrin/llm-file-processor?style=social)](https://github.com/samestrin/llm-file-processor/network/members) [![Watch on GitHub](https://img.shields.io/github/watchers/samestrin/llm-file-processor?style=social)](https://github.com/samestrin/llm-file-processor/watchers)

![Version 1.0.0](https://img.shields.io/badge/Version-1.0.0-blue) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Built with Node.js](https://img.shields.io/badge/Built%20with-Node.js-green)](https://nodejs.org/)

> **Automate, standardize, and enrich your files at scale with LLM-powered transformations**

A flexible Node.js CLI that applies custom LLM prompts to files or entire directories—turn unstructured documentation, code, or data into consistent, structured, and actionable outputs with minimal effort.

## Key Features

* **Rule-Driven Workflows**: Define a single prompt file containing transformation rules, and let the CLI enforce them across every input file.
* **LLM-Agnostic**: Swap models or providers via environment variables; works with any OpenAI-compatible API endpoint.
* **Batch & Parallel Processing**: Process individual files or entire directories in configurable batch sizes, with optional delays for rate-limiting.
* **Dry-Run Mode**: Preview combined prompts without making API calls, perfect for testing and validation.
* **JSON-First Output**: Receive clean, machine-readable JSON responses for seamless integration into pipelines.
* **Prompt Validation**: Built-in LLM-based prompt sanity checks to ensure your rules translate into valid transformations.

## Use Cases

1. **Uniform Documentation**
   Standardize a scattered collection of markdown files—add TOCs, enforce heading hierarchies, flag missing sections, and generate summary sections automatically.

2. **Web Content Summarization**
   Crawl or aggregate dozens (or hundreds) of web pages, then compress and transform them into structured in-context learning data for your next prompt-engineering or fine-tuning project.

3. **Automated Code Review & Linting**
   Feed diffs or code snippets through custom prompts to enforce style guides, detect anti-patterns, and suggest refactors at scale.

4. **Test Case Generation**
   Generate unit or integration tests by providing source files and rules for expected behaviors—ideal for accelerating test coverage in legacy codebases.

5. **Changelog & Release Notes**
   Scan commit messages or diff logs, then automatically produce human-friendly change summaries and release notes in your preferred format.

6. **Data Extraction & Metadata Tagging**
   Transform CSVs, logs, or JSON files by extracting key fields, tagging records, or reformatting data for downstream analytics.

7. **Migration of Legacy Formats**
   Batch-convert legacy documentation, configuration files, or proprietary formats into modern standards (e.g., Markdown → Markdown with frontmatter, YAML → JSON).

8. **Localization & Internationalization**
   Automate translation or adaptation of text files by applying LLM-based translation prompts, with markers for review or missing strings.

9. **CI/CD Integration**
   Incorporate the CLI into Git hooks or CI pipelines to enforce content and code health checks on every commit or pull request.

10. **Training Data Preparation**
    Generate clean, structured training examples by defining in-context learning rules—ideal for building your own LLM benchmarks or fine-tuning datasets.

## Installation

You can install the LLM File Processor globally via npm:

```bash
npm install -g llm-file-processor
```

Alternatively, you can use `npx` to run it without installing globally:

```bash
npx llm-file-processor [options]
```

If you prefer to clone the repository and run it locally:

```bash
# Clone repository
git clone https://github.com/samestrin/llm-file-processor.git
cd llm-file-processor

# Install dependencies
npm install

# Make CLI executable (if running directly)
chmod +x llm-file-processor.js

# (Optional) Link globally for local development
npm link
```

## Configuration

Create a `.env` file in the project root:

```dotenv
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=your-model-identifier # e.g. gpt-4.1
```

> **Tip:** Use any OpenAI-compatible endpoint by setting the `OPENAI_API_URL` environment variable.

## Usage

```bash
# Process a single file
llm-file-processor --prompt-file path/to/prompt.txt --file path/to/doc.md

# Process an entire directory
llm-file-processor --prompt-file path/to/prompt.txt --directory path/to/project/docs

# Preview prompts without API calls
llm-file-processor -p prompt.txt -f file.md --dry-run

# Generate test files with modified filenames
llm-file-processor -p test-generation.txt -f userAuthentication.js --insert-before-ext ".test"

# Process log files and output as JSON
llm-file-processor -p extract-data.txt -d logs/ --output-ext json

# Process multiple files and merge results into a single output
llm-file-processor -p extract-data.txt -d logs/ -m json

# Process files and merge with custom extension
llm-file-processor -p summarize.txt -d articles/ -m md --output-ext summary.md

# Batch process with custom settings
llm-file-processor -p rules.txt -d src -b 5 --delay 1000
```

### CLI Options

| Option                        | Description                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| `-p, --prompt-file <file>`    | Path to the prompt file (required)                                                    |
| `-f, --file <file>`           | Path to a single file to process                                                      |
| `-d, --directory <dir>`       | Path to a directory of files to process                                               |
| `-o, --output <dir>`          | Specify a custom output directory (default: `./processed-<timestamp>`)                |
| `--insert-before-ext <text>`  | Insert text before file extension (e.g., ".test" for "file.test.js" from "file.js")   |
| `--output-ext <extension>`    | Change or add file extension (e.g., "json" to save as "file.log.json")                |
| `-m, --merge <filename>`      | Merge all processed files into a single output file "<filename>"                      |
| `--dry-run`                   | Combine prompts and files without sending to LLM                                      |
| `-b, --batch-size <number>`   | Number of files per batch (default: 1)                                                |
| `--delay <ms>`                | Milliseconds to wait between API batches (default: 500)                               |
| `-h, --help`                  | Display help information                                                              |
| `-v, --version`               | Display version information                                                           |

## Writing Effective Prompts

Craft transformation rules in your prompt file to guide the LLM. Example:

```
1. Generate a table of contents.
2. Normalize all headings to Markdown `##`, `###`, etc.
3. Flag sections missing a required `Summary` header.
4. Append a `## Key Takeaways` section at the end.
```

## Contribute

Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes or improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Share

[![Twitter](https://img.shields.io/badge/X-Tweet-blue)](https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20project!&url=https://github.com/samestrin/llm-file-processor) [![Facebook](https://img.shields.io/badge/Facebook-Share-blue)](https://www.facebook.com/sharer/sharer.php?u=https://github.com/samestrin/llm-file-processor) [![LinkedIn](https://img.shields.io/badge/LinkedIn-Share-blue)](https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/samestrin/llm-file-processor)
