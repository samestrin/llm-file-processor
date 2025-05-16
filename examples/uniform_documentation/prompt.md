# Documentation Standardization Prompt

## Task

Convert the provided markdown file into a standardized documentation format following these requirements:

## Requirements

1. **Add a Table of Contents** at the beginning of each document (after any title)
   - Include all headings level 1-3
   - Format as a bulleted list with proper indentation
   - Add page jump links to each heading

2. **Enforce Heading Hierarchy**
   - Ensure document starts with a single H1 (#) title
   - Properly nest headings (H2 sections should only appear under H1, H3 under H2, etc.)
   - Flag any hierarchy violations with [HIERARCHY ISSUE] comments

3. **Check for Required Sections**
   - Every document must include these sections (as H2):
     - Overview
     - Getting Started
     - Usage
     - API Reference (if applicable)
     - Examples
     - Troubleshooting
   - Add placeholder content for any missing required section with [MISSING SECTION] tag

4. **Generate Summary Section**
   - Add a "Summary" section at the beginning (after TOC)
   - 2-3 concise paragraphs highlighting key points
   - Include mention of primary features and use cases

5. **Standardize Formatting**
   - Use consistent bullet point symbols (-)
   - Format code blocks with proper language identifiers
   - Ensure examples have descriptions
   - Convert HTML tags to markdown equivalents when possible

## Output Format

Return the entire document in properly formatted markdown, preserving all original content while adding required elements and formatting.

## Example Transformation

Input:
```markdown

# My Component

Some description goes here.

## Usage

Example usage code here.

## API

API details here.
```

Output:
```markdown
# My Component

## Table of Contents
- [My Component](#my-component)
  - [Summary](#summary)
  - [Overview](#overview)
  - [Getting Started](#getting-started)
  - [Usage](#usage)
  - [API Reference](#api-reference)
  - [Examples](#examples)
  - [Troubleshooting](#troubleshooting)

## Summary
My Component is a utility that provides [key functionality]. It's designed for [primary use case] and supports [main features]. This documentation covers everything from basic setup to advanced configurations.

## Overview
Some description goes here.

## Getting Started
[MISSING SECTION] This section should explain how to install and set up the component.

## Usage
Example usage code here.

## API Reference
API details here.

## Examples
[MISSING SECTION] This section should provide practical examples of the component in action.

## Troubleshooting
[MISSING SECTION] This section should cover common issues and their solutions.
```