# Commit History to Release Notes Formatter Prompt

## Purpose
Transform raw Git commit messages and diff logs into well-structured, human-friendly release notes organized by category.

## Input Format
The input will be Git commit messages and diff summaries in the following format:
- Commit hash
- Author name and email
- Date and time
- Commit message
- Files changed with additions/deletions

## Output Format
Format the output as a structured Markdown changelog with:
1. A version header with date
2. Changes categorized into:
   - ✨ New Features
   - 🐛 Bug Fixes
   - 🔧 Improvements
   - 📚 Documentation
   - 🧪 Testing
   - 🔒 Security
   - ⚡ Performance
   - 🧹 Refactoring
3. Each change should include:
   - A clear, concise description (rewritten from commit message)
   - The affected component/module in bold
   - Reference to relevant issue/PR numbers
   - Links to commit hashes

## Processing Rules
1. Analyze commit messages to determine appropriate categories
2. Convert technical descriptions to user-friendly language
3. Group related changes under the same component
4. Prioritize user-facing changes over internal ones
5. Remove trivial commits (e.g., "fix typo", "update gitignore")
6. Extract issue/PR references (#XXX) from commit messages
7. Filter out merge commits unless they contain meaningful information
8. For commits lacking clear categorization, examine diff content to determine impact

## Example
Input:
```
commit a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9 
Author: Jane Developer <jane@example.com> 
Date: Tue Apr 20 2023 15:32:47 GMT+0000

    Fix validation error in user registration form #123
    
    - Fixed regex pattern for email validation
    - Added proper error message display
    - Updated related tests    
```

Output:
```markdown
## 🐛 Bug Fixes

- **User Authentication**: Fixed validation error in user registration form with proper error message display ([#123](https://github.com/your-org/your-repo/issues/123)) - [a1b2c3d](https://github.com/your-org/your-repo/commit/a1b2c3d)
````
