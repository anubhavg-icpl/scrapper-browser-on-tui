# Contributing to HackerNews Scraper

Thank you for your interest in contributing to the HackerNews Scraper project! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/hn-scraper.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit your changes: `git commit -m "Add your feature"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

```bash
# Clone the repository
git clone https://github.com/anubhavg-icpl/scrapper-browser-on-tui.git
cd hn-scraper

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Run the scraper
npm start
```

## Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add JSDoc comments for functions and classes
- Follow existing code patterns

## Testing

Before submitting a PR, please:

1. Test your changes with both local and cloud browsers
2. Run the examples to ensure they still work
3. Check for any console errors or warnings
4. Verify error handling works correctly

```bash
# Test basic functionality
npm start

# Test CLI
node src/cli.js test

# Test examples
npm run example:basic
npm run example:custom
```

## Pull Request Guidelines

- **Title**: Use a clear and descriptive title
- **Description**: Explain what changes you made and why
- **Testing**: Describe how you tested your changes
- **Breaking Changes**: Clearly document any breaking changes

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Changes have been tested locally
- [ ] Documentation has been updated (if needed)
- [ ] Examples work correctly
- [ ] No new warnings or errors
- [ ] Commit messages are clear and descriptive

## Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**:
   - OS and version
   - Node.js version
   - Package versions
   - Local or cloud browser

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature has already been requested
2. Clearly describe the feature and its use case
3. Explain why it would be useful to the project

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Provide constructive feedback
- Focus on what is best for the community

## Questions?

If you have questions, feel free to:

- Open an issue for discussion
- Check existing issues and pull requests
- Review the documentation

Thank you for contributing!
