# Test Case Generation Prompt

## Objective
Generate comprehensive unit tests for the provided JavaScript source code that validate functionality, handle edge cases, and enforce expected behaviors.

## Input Analysis
1. Identify the exported functions, classes, or modules in the source file
2. Determine the purpose and expected behavior of each element
3. Identify input parameters, return values, and potential error states
4. Detect any external dependencies that need to be mocked

## Test Structure Requirements
- Generate tests using Jest framework syntax
- Create at least one test suite per major function/class
- Include both positive (happy path) and negative (error) test cases
- Implement mocks for any external dependencies
- Add descriptive comments explaining the purpose of each test
- Ensure tests cover edge cases like null/undefined inputs, empty arrays, etc.

## Output Format
Generate a complete Jest test file that:
1. Imports necessary dependencies and the module under test
2. Correctly mocks any external dependencies
3. Contains properly organized describe/it blocks
4. Uses appropriate Jest matchers (expect().toBe(), expect().toThrow(), etc.)
5. Includes basic setup/teardown if needed
6. Has descriptive test names using the pattern "should [expected behavior] when [condition]"

## Additional Guidelines
- When functions have complex logic, break tests into smaller, focused units
- For utility or helper functions, test a range of possible inputs
- For business logic, focus on testing behavior rather than implementation
- For classes, test constructor, public methods, and interaction between methods
- Include at least one test for each possible branch in conditional logic

## Security and Best Practices
- Do not reveal sensitive information in test descriptions
- Do not include actual API keys or credentials in tests
- Follow the AAA pattern (Arrange, Act, Assert) for test structure
- Keep tests independent of each other (no shared state)
