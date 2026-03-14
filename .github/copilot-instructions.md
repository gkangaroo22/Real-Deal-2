# Copilot Coding Agent Instructions

## Repository Overview

**Real-Deal-2** is a repository in its earliest stage. As of the initial onboarding, it contains only a `README.md` file and has no source code, build tooling, tests, or CI/CD pipelines configured. This document provides guidance to help a coding agent work efficiently as the project evolves.

## Current State

- **Language/Framework**: Not yet determined — no source files exist.
- **Build system**: None configured.
- **Test framework**: None configured.
- **CI/CD**: No workflow files in `.github/workflows/`.
- **Dependencies**: None.

## Repository Structure

```
Real-Deal-2/
├── .github/
│   └── copilot-instructions.md   # This file
└── README.md                     # Minimal project description ("Real-Deal-2 / Version 2")
```

## Onboarding a New Agent

Since there is no established stack yet, follow these principles when new work is requested:

1. **Ask before assuming a stack.** If a task requires creating source files but no language or framework has been established, check the issue/PR description for explicit guidance before choosing one.
2. **Prefer the simplest viable solution.** Until architecture decisions are documented, avoid over-engineering.
3. **Initialize incrementally.** When adding a language or framework for the first time, also add the corresponding `.gitignore` entries so build artifacts and dependency directories are never committed.

## Development Workflow (to be updated as the project grows)

Because no tooling exists yet, there are no build, lint, or test commands to run. As soon as any are introduced, document them here with exact commands.

### Placeholder commands (update when tooling is added)

| Task     | Command              |
|----------|----------------------|
| Install  | *(not yet defined)*  |
| Build    | *(not yet defined)*  |
| Lint     | *(not yet defined)*  |
| Test     | *(not yet defined)*  |
| Run      | *(not yet defined)*  |

## Git Conventions

- **Branch names**: Use the `copilot/<short-description>` pattern for agent-created branches (already in use).
- **Commit messages**: Write short, imperative-mood messages (e.g., `Add login endpoint`, `Fix null check in user service`).
- **Pull requests**: Each PR should address a single concern; include a description explaining what changed and why.

## Known Issues / Errors Encountered

| Date       | Error / Issue                                         | Workaround / Resolution                              |
|------------|-------------------------------------------------------|------------------------------------------------------|
| 2026-03-14 | Repository is essentially empty (no code, no tooling) | Created this instructions file as the first artifact |

## Notes for Future Agents

- Always read this file at the start of every session to pick up any new conventions or known issues added since your last run.
- Update the **Known Issues** table whenever you encounter and resolve (or work around) an error.
- Update the **Development Workflow** table as soon as build, lint, or test scripts are introduced.
- Update the **Repository Structure** tree whenever significant new directories or files are added.
