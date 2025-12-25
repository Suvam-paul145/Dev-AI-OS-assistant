# Contributing to Dev AI OS

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Dev AI OS. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by a Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

- **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/Suvam-paul145/Dev-AI-OS-assistant/issues).
- If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

- Open a new issue with the **enhancement** label.
- Describe the step-by-step behavior of the enhancement.
- Explain why this enhancement would be useful to most users.

### Pull Requests

1.  Fork the repo and create your branch from `main`.
2.  If you've added code that should be tested, add tests.
3.  Ensure your code follows the existing style patterns.
4.  Make sure your code pushes without errors (check for secrets!).
5.  Issue that pull request!

## Environment Setup

Please review [SETUP.md](./SETUP.md) for detailed instructions on how to run the project locally.

## Project Structure

- `apps/dev-frontend-ui`: Next.js Frontend
- `apps/dev-auth-backend`: Node.js/Express Backend (Auth, API)
- `apps/dev-voice-system`: Python Voice Service (Whisper, TTS)
- `apps/dev-os-automation`: Python OS Automation Service

## Style Guide

- **TypeScript**: We use strict typing where possible.
- **Commits**: Use conventional commits (e.g., `feat: add new voice command`, `fix: resolve auth error`).

Thank you for your contributions!
