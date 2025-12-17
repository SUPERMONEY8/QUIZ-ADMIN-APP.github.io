# Test Suite Documentation

This directory contains comprehensive test cases for the PME Desktop Application.

## Test Structure

```
tests/
├── setup.js                 # Test utilities and mocks
├── unit/                    # Unit tests for algorithms
│   ├── dcc-assignment.test.js
│   ├── sante-assignment.test.js
│   └── cook-drive-assignment.test.js
├── integration/             # Integration tests
│   └── workflow.test.js
├── ui/                      # UI tests
│   ├── form-validation.test.js
│   ├── modal.test.js
│   ├── table-filtering.test.js
│   └── export.test.js
└── edge-cases/              # Edge case tests
    └── empty-groups.test.js
```

## Running Tests

### Run all tests
```bash
bun test
```

### Run specific test suites
```bash
# Unit tests only
bun test:unit

# Integration tests only
bun test:integration

# UI tests only
bun test:ui

# Edge case tests only
bun test:edge
```

### Watch mode (auto-run on file changes)
```bash
bun test:watch
```

## Test Coverage

### Unit Tests
- **DCC Assignment**: All members assigned every month (Fixed)
- **Santé Assignment**: Single member rotation algorithm
- **Cook & Drive**: Alternating counts (1/1 vs 1/2)
- **Officers**: 2 members, no repeats until reset
- **Sub-Officers**: 9 per month (3 per campaign)
- **HDT**: 54 per month (18 per pool)

### Integration Tests
- Add member → Generate → Verify in log
- Multiple months generation without conflicts
- Database backup/restore
- Clear data → Reset rotation indices
- End-to-end workflows

### UI Tests
- Form validation (required fields, email, employee ID)
- Modal open/close (Escape key, overlay click)
- Table filtering (by name, group, month, date range)
- Table sorting (by month, member, group)
- Export functionality (CSV, PDF structure)

### Edge Cases
- Empty groups (all assignment types)
- Single member per group
- All members excluded
- Month/year boundaries (December→January, leap years)
- Insufficient members for requirements

## Writing New Tests

### Example Unit Test
```javascript
import { test, expect, beforeEach } from 'bun:test';
import { createMockMembers } from '../setup.js';

describe('My Feature', () => {
    let testData;
    
    beforeEach(() => {
        testData = createMockMembers(5);
    });
    
    test('should do something', () => {
        expect(testData.length).toBe(5);
    });
});
```

### Example Integration Test
```javascript
import { test, expect } from 'bun:test';

test('should complete workflow', async () => {
    // Step 1
    const result1 = await doSomething();
    expect(result1).toBeDefined();
    
    // Step 2
    const result2 = await doSomethingElse(result1);
    expect(result2.success).toBe(true);
});
```

## Test Utilities

The `setup.js` file provides:
- `createMockMembers(count, group)` - Create mock member arrays
- `createMockAssignments(count, month, group)` - Create mock assignments
- `createMockRotationState(group, index, month)` - Create rotation states
- `wait(ms)` - Async delay utility
- `mockDbHelper` - Mock database functions

## Notes

- Tests use Bun's built-in test runner
- Mock DOM is provided for UI tests
- Electron APIs are mocked for offline testing
- All tests are designed to run without a database connection

