# CI/CD Integration Prompt

1. Analyze the provided file content and enforce CI/CD health checks.
2. For JavaScript/TypeScript files:
   - Detect `console.log` statements.
   - Flag missing semicolons and improper indentation.
3. For Markdown files:
   - Ensure presence of these headings in order: Introduction, Installation, Usage, Changelog.
   - Enforce proper heading hierarchy (one H1, H2 under H1, etc.).
   - Flag any missing or out-of-order sections.
4. For `.diff` files:  
   - Parse each hunk and examine only added lines (starting with `+`).  
   - On added lines, apply the same JS/TS and Markdown checks as above.  
   - Use the file path and line numbers from the diff metadata for annotations.     
5. For each issue, output **only** one GitHub Actions annotation line per issue, using `{{filename}}` as the file name placeholder:  
   ```text
   ::error file={{filename}} line={line}::{message}
   ```  
   ```text
   ::warning file={{filename}} line={line}::{message}
   ```
   _This means there should be no other output in the processed files other than the annotations._  