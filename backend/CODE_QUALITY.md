# Code Quality Configuration

This document outlines the comprehensive code quality setup for the AI X Social backend.

## Overview

The backend has been configured with production-ready code quality tools:

- **ESLint v9**: Comprehensive TypeScript and JavaScript linting
- **Prettier**: Code formatting and style consistency
- **TypeScript**: Strict type checking with enhanced compiler options
- **Git Pre-commit Hooks**: Automated quality checks before commits

## ESLint Configuration

### File: `eslint.config.js`

The ESLint configuration enforces strict TypeScript and code quality rules:

#### TypeScript Rules
- Explicit function return types required
- No `any` types allowed
- Strict boolean expressions
- Type-only imports enforced
- Null/undefined safety with nullish coalescing
- Promise handling requirements

#### Code Quality Rules
- Complexity limits (max 10)
- Function length limits (max 50 lines)
- Parameter limits (max 4)
- Nested callback limits (max 3)
- Magic number detection

#### Security Rules
- No eval() usage
- No script URLs
- No implied eval

### Different Rules for Different File Types

1. **Source Files** (`src/**/*.ts`): Full strict rules
2. **Test Files** (`tests/**/*`): Relaxed rules for testing needs
3. **Generated Files** (`src/generated/**/*`): Ignored completely
4. **Scripts** (`scripts/**/*`): Console output allowed

## Prettier Configuration

### File: `.prettierrc`

Enforces consistent code formatting:
- 2-space indentation
- Single quotes
- Semicolons required
- Line width: 80 characters
- LF line endings

## TypeScript Configuration

### Enhanced Compiler Options

- Strict mode enabled
- Exact optional property types
- No unchecked indexed access
- No implicit returns
- No fallthrough cases
- Verbatim module syntax

## Available Scripts

```bash
# Linting
npm run lint                 # Check for linting issues
npm run lint:fix            # Auto-fix linting issues

# Formatting
npm run format              # Format all files with Prettier
npm run format:check        # Check formatting without changes

# Type Checking
npm run typecheck           # TypeScript compilation check
```

## Pre-commit Hooks

### Location: `.git/hooks/pre-commit`

Automatically runs before each commit:
1. Detects staged TypeScript files
2. Runs ESLint on staged files
3. Checks Prettier formatting
4. Blocks commit if issues found

### Manual Trigger

To test the pre-commit hook manually:
```bash
.git/hooks/pre-commit
```

## Current Quality Status

As of setup completion, the codebase has:
- **ESLint**: 102 issues (61 errors, 41 warnings)
- **Prettier**: 34 files need formatting
- **TypeScript**: Multiple type errors to resolve

These issues are intentional and demonstrate the strict quality standards enforced.

## Recommended Workflow

1. **Before Development**: Run `npm run typecheck` to ensure clean baseline
2. **During Development**: Use `npm run lint:fix` to auto-fix issues
3. **Before Commit**: Run `npm run format` to fix formatting
4. **Commit**: Pre-commit hook will validate automatically

## Integration with IDE

### VSCode Settings

Add to `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["typescript"],
  "typescript.preferences.includePackageJsonAutoImports": "off"
}
```

### Extensions Recommended
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- TypeScript Importer (pmneo.tsimporter)

## Customization

### Adjusting Rules

To modify ESLint rules, edit `eslint.config.js`:
- Change rule severity: `'error'` → `'warn'` → `'off'`
- Add rule exceptions in `overrides` sections
- Modify ignore patterns in `ignores` section

### Prettier Options

To change formatting, edit `.prettierrc`:
- Adjust `printWidth` for line length
- Change `tabWidth` for indentation
- Toggle `singleQuote` for quote style

## Troubleshooting

### Common Issues

1. **ESLint Plugin Compatibility**: Some plugins may not support ESLint v9
2. **Type Import Errors**: Use `import type` for type-only imports
3. **Magic Numbers**: Define constants for repeated numeric values
4. **Complexity Warnings**: Break down large functions

### Performance Notes

- ESLint v9 flat config provides better performance
- TypeScript strict mode catches more errors at compile time
- Pre-commit hooks add ~5-10 seconds to commit time

## Maintenance

### Regular Updates

1. Update ESLint rules quarterly
2. Review and adjust complexity limits
3. Monitor new TypeScript compiler options
4. Update Prettier configuration for new features

### Metrics Tracking

Consider tracking:
- ESLint error/warning counts over time
- Code complexity metrics
- TypeScript error reduction
- Formatting consistency scores