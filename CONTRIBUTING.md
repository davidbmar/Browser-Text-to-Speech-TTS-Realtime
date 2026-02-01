# Contributing to Browser TTS

Thank you for your interest in contributing to Browser TTS!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/browser-tts-realtime.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes: `npm run check`
6. Commit your changes: `git commit -m "Add: your feature description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Run type checking before committing: `npm run check`
- (Future) Run ESLint: `npm run lint`
- (Future) Format code: `npm run format`

### Commit Messages

Use clear, descriptive commit messages:

- `Add: new feature description`
- `Fix: bug description`
- `Update: improvement description`
- `Refactor: code change description`
- `Docs: documentation update`

### Testing

- Test your changes in multiple browsers (Chrome, Firefox, Safari)
- Ensure TTS functionality works correctly
- Check mobile responsiveness
- Verify WebAssembly loading and audio playback

### Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Include screenshots/GIFs for UI changes
- Ensure all checks pass
- Keep PRs focused on a single feature/fix

## Areas for Contribution

### High Priority

- Add unit tests (Vitest)
- Add e2e tests (Playwright)
- Implement error boundaries
- Add accessibility improvements
- Optimize performance

### Medium Priority

- Improve documentation
- Add more voices
- Implement keyboard shortcuts
- Add audio download functionality
- Create Progressive Web App (PWA)

### Low Priority

- Add analytics
- Implement SSML support
- Add voice effects
- Create API documentation

## Questions?

Open an issue for questions or discussions about:
- Feature requests
- Bug reports
- Implementation questions
- Architecture decisions

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on the code, not the person

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
