# Example Prompts and Test Files

The following ten directories contain example prompts and test files for the ten use cases identified on the main [README.md](/README.md).
This document provides an overview of each example, including the purpose of its prompt, the files provided for testing, and any specific notes or findings from a review of their contents.

## File Structure

The `examples/` directory is structured as follows:

```text
.
├── README.md
├── automated_code_review_and_linting
│   ├── files
│   │   ├── calculateTotal.js
│   │   ├── isAdmin.js
│   │   └── processUserData.js
│   ├── notes.md
│   └── prompt.md
├── changelog_and_release_notes_generation
│   ├── files
│   │   ├── git_log_1.txt
│   │   ├── git_log_2.txt
│   │   └── git_log_3.txt
│   ├── notes.md
│   └── prompt.md
├── ci_cd_integration
│   ├── files
│   │   ├── README.md
│   │   ├── changes.diff
│   │   └── index.js
│   ├── notes.md
│   └── prompt.md
├── data_extraction_and_metadata_tagging
│   ├── files
│   │   ├── customer_activity.log
│   │   ├── product_purchases.json
│   │   └── sales_records.csv
│   ├── notes.md
│   └── prompt.md
├── localization_and_internationalization
│   ├── files
│   │   ├── Getting_Started.md
│   │   ├── MyApp.json
│   │   └── Profile.html
│   └── prompt.md
├── migration_of_legacy_formats
│   ├── files
│   │   ├── API_Documentation.md
│   │   ├── Meeting_Notes_Product_Roadmap_Discussion.md
│   │   └── Project_Installation_Guide.md
│   └── prompt.md
├── test_case_generation
│   ├── files
│   │   ├── calculatorUtils.js
│   │   ├── inventoryService.js
│   │   └── userAuthentication.js
│   ├── notes.md
│   └── prompt.md
├── training_data_preparation
│   ├── files
│   │   ├── test1.txt
│   │   ├── test2.md
│   │   └── test3.json
│   ├── notes.md
│   └── prompt.md
├── uniform_documentation
│   ├── files
│   │   ├── Authentication_Module.md
│   │   ├── DataProcessor_Library.md
│   │   └── Query_Builder_Component.md
│   └── prompt.md
└── web_content_summarization
    ├── files
    │   ├── AI_Ethics_Report.html
    │   ├── New_Quantum_Computing_Breakthrough.md
    │   └── Understanding_Transformer_Architecture.html
    ├── notes.md
    └── prompt.md
```

## Example Use Case Details

### 1. Uniform Documentation
*   **Directory:** [`uniform_documentation/`](uniform_documentation/)
*   **Prompt (`prompt.md`):** Aims to standardize Markdown files by adding a Table of Contents, enforcing heading hierarchy, checking for required sections (Overview, Getting Started, Usage, API Reference, Examples, Troubleshooting) and adding placeholders if missing, generating a summary section, and standardizing formatting. Includes a detailed example transformation.
*   **Example Files (`files/`):**
    *   `Authentication_Module.md`
    *   `DataProcessor_Library.md`
    *   `Query_Builder_Component.md`

### 2. Web Content Summarization
*   **Directory:** [`web_content_summarization/`](web_content_summarization/)
*   **Prompt (`prompt.md`):** (Details not fully reviewed) Designed to process web content (HTML, Markdown) and generate summaries.
*   **Example Files (`files/`):**
    *   `AI_Ethics_Report.html`
    *   `New_Quantum_Computing_Breakthrough.html`
    *   `Understanding_Transformer_Architecture.html`
*   **Notes (`notes.md`):** Recommends saving output as JSON files and provides the test command:
    ```bash
    llm-file-processor -p examples/web_content_summarization/prompt.md -d examples/web_content_summarization/files --output-ext json
    ```

### 3. Automated Code Review & Linting
*   **Directory:** [`automated_code_review_and_linting/`](automated_code_review_and_linting/)
*   **Prompt (`prompt.md`):** (Details not fully reviewed) Intended to review code, identify potential issues (e.g., style violations, anti-patterns), and suggest improvements.
*   **Example Files (`files/`):**
    *   `calculateTotal.js`
    *   `isAdmin.js` (Contains a function, test calls, and a hardcoded API key commented as needing to be in env vars)
    *   `processUserData.js`
*   **Notes (`notes.md`):** Recommends saving output as JSON files and provides the test command:
    ```bash
    llm-file-processor -p examples/automated_code_review_and_linting/prompt.md -d examples/automated_code_review_and_linting/files --output-ext json
    ```

### 4. Test Case Generation
*   **Directory:** [`test_case_generation/`](test_case_generation)
*   **Prompt (`prompt.md`):** Objective is to generate comprehensive unit tests for JavaScript source code. It specifies analyzing input to identify functions, classes, parameters, return values, error states, and dependencies.
*   **Example Files (`files/`):**
    *   `calculatorUtils.js` (A utility module with various math functions and error handling)
    *   `inventoryService.js`
    *   `userAuthentication.js`
*   **Notes (`notes.md`):** Recommends saving output as ".test.js" files and provides the test command:
    ```bash
    llm-file-processor -p examples/test_case_generation/prompt.md -d examples/test_case_generation/files --insert-before-ext '.test'
    ```

### 5. Changelog & Release Notes Generation
*   **Directory:** [`changelog_and_release_notes_generation/`](changelog_and_release_notes_generation/)
*   **Prompt (`prompt.md`):** Transforms raw Git commit messages and diff logs into structured, human-friendly release notes. Specifies output format (Markdown changelog with categories) and processing rules (analyzing commits, user-friendly language, grouping, filtering trivial commits, etc.).
*   **Example Files (`files/`):**
    *   `git_log_1.txt`
    *   `git_log_2.txt`
    *   `git_log_3.txt`
*   **Notes (`notes.md`):** Recommends saving output as Markdown files and provides the test command:
    ```bash
    llm-file-processor -p examples/changelog_and_release_notes_generation/prompt.md -d examples/changelog_and_release_notes_generation/files --output-ext md
    ```

### 6. Data Extraction & Metadata Tagging
*   **Directory:** [`data_extraction_and_metadata_tagging/`](data_extraction_and_metadata_tagging/)
*   **Prompt (`prompt.md`):** (Details not fully reviewed) Designed for transforming various data files by extracting key fields, tagging records, or reformatting data.
*   **Example Files (`files/`):**
    *   `customer_activity.log`
    *   `product_purchases.json`
    *   `sales_records.csv`
*   **Notes (`notes.md`):** Recommends saving output as JSON files and provides the test command:
    ```bash
    llm-file-processor -p examples/data_extraction_and_metadata_tagging/prompt.md -d examples/data_extraction_and_metadata_tagging/files --output-ext json
    ```
### 7. Migration of Legacy Formats
*   **Directory:** [`migration_of_legacy_formats/`](migration_of_legacy_formats/)
*   **Prompt (`prompt.md`):** (Details not fully reviewed) Intended for batch-converting legacy documentation, configuration files, or proprietary formats into modern standards.
*   **Example Files (`files/`):**
    *   `API_Documentation.md`
    *   `Meeting_Notes_Product_Roadmap_Discussion.md`
    *   `Project_Installation_Guide.md`

### 8. Localization & Internationalization
*   **Directory:** [`localization_and_internationalization/`](localization_and_internationalization/)
*   **Prompt (`prompt.md`):** Aims to translate English source content (Markdown, JSON, HTML) into Spanish (es), preserving structure, formatting, and placeholders. It specifies rules for translation, handling missing strings with `[MISSING TRANSLATION]`, and wrapping translated blocks with language-indicating HTML comments.
*   **Example Files (`files/`):**
    *   `Getting_Started.md`
    *   `MyApp.json`
    *   `Profile.html`

### 9. CI/CD Integration
*   **Directory:** [`ci_cd_integration/`](ci_cd_integration/)
*   **Prompt (`prompt.md`):** Designed to enforce CI/CD health checks. For JS/TS files, it detects `console.log`, missing semicolons, and improper indentation. For Markdown, it checks for specific heading presence and hierarchy. For `.diff` files, it applies these checks to added lines. Issues are reported as GitHub Actions annotations.
*   **Example Files (`files/`):**
    *   `README.md`
    *   `changes.diff`
    *   `index.js`
*   **Notes (`notes.md`):** Recommends saving output as a merged text file. Provides the test command:
    ```bash
    llm-file-processor -p examples/ci_cd_integration/prompt.md -d examples/ci_cd_integration/files -m txt
    ```

### 10. Training Data Preparation
*   **Directory:** [`training_data_preparation/`](training_data_preparation/)
*   **Prompt (`prompt.md`):** Converts raw content (text, Markdown, JSON logs) into structured JSON training examples. For text/Markdown, it creates input/output pairs (question/answer). For JSON logs, it extracts records into input (key fields) and output (target field). Specifies an exact JSON output schema.
*   **Example Files (`files/`):**
    *   `test1.txt`
    *   `test2.md`
    *   `test3.json`
*   **Notes (`notes.md`):** Recommends saving output as JSON files. Provides the test command:
    ```bash
    llm-file-processor -p examples/training_data_preparation/prompt.md -d examples/training_data_preparation/files --output-ext json
    ```