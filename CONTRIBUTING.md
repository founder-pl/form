# Contributing to Tax Comparison Tool

Thank you for considering contributing to the Tax Comparison Tool! We welcome contributions from the community to help improve this project.

## 🛠 Development Setup

1. **Fork the repository** and clone it to your local machine
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following the coding standards
5. **Run tests** to ensure everything works:
   ```bash
   npm test
   ```
6. **Commit your changes** with a descriptive commit message
7. **Push to your fork** and open a pull request

## 📝 Code Style

- Use **ES6+** JavaScript features
- Follow **Airbnb JavaScript Style Guide**
- Use **2 spaces** for indentation
- Write **descriptive variable and function names**
- Add **JSDoc comments** for public functions and components
- Keep functions small and focused on a single responsibility

## 🧪 Testing

- Write tests for all new features and bug fixes
- Run tests before submitting a PR:
  ```bash
  npm test
  ```
- Ensure test coverage doesn't decrease

## 📦 Project Structure

```
src/
├── components/     # Reusable React components
├── contexts/      # React context providers
├── pages/         # Page components
├── services/      # Business logic and API clients
└── __tests__/     # Test files
```

## 📝 Pull Request Guidelines

- Keep PRs focused on a single feature or bugfix
- Write clear, descriptive commit messages
- Reference any related issues
- Ensure all tests pass
- Update documentation if necessary

## 🐛 Reporting Issues

When reporting issues, please include:

1. A clear, descriptive title
2. Steps to reproduce the issue
3. Expected vs. actual behavior
4. Browser/OS version if relevant
5. Any error messages

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
