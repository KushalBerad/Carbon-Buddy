# Testing Strategy

Carbon Buddy uses automated testing for validating application reliability and state consistency.

## Testing Frameworks

- Vitest
- React Testing Library
- JSDOM

## Automated Tests Implemented

### Application Tests

- App rendering validation
- Component mount stability testing
- React component initialization testing

### State Management Tests

- Zustand user store initialization
- Current view mutation testing
- Sidebar state toggle testing
- State persistence validation

### Security Validation Tests

- Environment variable presence validation
- Configuration safety validation

## Commands

```bash
npm run test
```

## Current Status

10 tests passing successfully.

## Objective

Ensure predictable state behavior, stable UI rendering, and maintainable code reliability before deployment.