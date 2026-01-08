# Contributing to OpenDotDB

Thank you for your interest in contributing to OpenDotDB! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/opendotdb/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. Check if the feature has been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/opendotdb.git
   cd opendotdb
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the coding standards
   - Write tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm run lint
   npm run build
   npm run dev
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `perf:` - Performance improvements
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Describe your changes
   - Link related issues

## Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup database**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   npm run db:push
   npm run db:generate
   npm run db:seed
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` type when possible

### React/Next.js

- Use functional components with hooks
- Keep components small and focused
- Use proper naming conventions

### File Structure

```
src/
├── app/              # Next.js app directory
│   ├── api/          # API routes
│   └── [page]/       # Page routes
├── components/       # Reusable components
├── lib/              # Utility functions
└── types/            # TypeScript types
```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Follow ESLint rules

```javascript
// Good
const greeting = 'Hello, World!'
const numbers = [1, 2, 3]

// Bad
const greeting = "Hello, World!"
const numbers=[1,2,3]
```

### API Design

- Use RESTful conventions
- Return consistent response format
- Include proper error handling
- Add input validation

```typescript
// Standard response format
{
  success: true,
  data: {...},
  message?: string
}

// Error response
{
  success: false,
  error: string
}
```

## Testing

While tests are not yet required, we encourage adding them:

```bash
# Future: Run tests
npm test

# Future: Run tests with coverage
npm run test:coverage
```

## Documentation

- Update README.md if adding features
- Add JSDoc comments for functions
- Update API.md for API changes
- Include inline comments for complex logic

## Areas Needing Contribution

### High Priority

- [ ] Add authentication system
- [ ] Implement rate limiting
- [ ] Add data import/export features
- [ ] Improve search performance
- [ ] Add more comprehensive tests

### Features

- [ ] Advanced domain filtering
- [ ] WHOIS integration
- [ ] Domain availability checker
- [ ] Bulk domain analysis
- [ ] API key management
- [ ] Email notifications for monitors

### UI/UX

- [ ] Dark mode
- [ ] Mobile responsiveness improvements
- [ ] Accessibility improvements
- [ ] Charts and visualizations
- [ ] Export to CSV/JSON

### Performance

- [ ] Implement caching layer
- [ ] Optimize database queries
- [ ] Add pagination improvements
- [ ] Lazy loading for large datasets

### Documentation

- [ ] Video tutorials
- [ ] More code examples
- [ ] Troubleshooting guide
- [ ] Architecture documentation

## Getting Help

- **Discord**: [Join our community](https://discord.gg/opendotdb) (coming soon)
- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the README

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making OpenDotDB better! 🚀
