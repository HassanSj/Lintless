# Contributing to AI Coding Mentor

Thank you for your interest in contributing to AI Coding Mentor! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/ai-coding-mentor/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach (if you have ideas)

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code refactoring
   - `test:` for tests
   - `chore:` for maintenance

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description
   - Reference related issues
   - Wait for review and address feedback

## Development Setup

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

### Backend Development

```bash
cd backend
npm install
npm run start:dev
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## Code Style

### Backend (NestJS)

- Follow NestJS conventions
- Use TypeScript strict mode
- Run `npm run lint` before committing
- Use Prettier for formatting

### Frontend (Next.js)

- Follow React best practices
- Use TypeScript
- Run `npm run lint` before committing
- Follow the existing component structure

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Backend: `npm run test` in backend directory
- Frontend: `npm run test` in frontend directory

## Documentation

- Update README.md if adding new features
- Add JSDoc comments for new functions
- Update API documentation if changing endpoints

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

Thank you for contributing! 🚀

