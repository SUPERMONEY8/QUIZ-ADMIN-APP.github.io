# Comprehensive Error Handling Guide

This document outlines the complete error handling system implemented in the application.

## ✅ Implemented Features

### 1. Try-Catch Blocks Around Database Operations
- **Status**: ✅ Implemented
- **Location**: `src/database/db-optimized.js`, `src/database/db-safe.js`
- **Coverage**: All database operations (find, findOne, insert, update, remove, insertBatch)

### 2. Form Validation
- **Status**: ✅ Implemented
- **Location**: `src/utils/validation.js`
- **Features**:
  - Required fields
  - Format validation (email, phone, numbers)
  - Min/max values
  - Min/max length
  - Pattern matching
  - Custom validators
  - Unique constraints (via custom validator)

### 3. User-Friendly Error Messages
- **Status**: ✅ Implemented
- **Location**: `src/components/ErrorDisplay.js`
- **Features**:
  - Toast-style error notifications
  - Field-specific error messages
  - Inline form errors
  - Dismissible errors
  - Auto-dismiss after duration

### 4. Error Logging to File
- **Status**: ✅ Implemented
- **Location**: `src/utils/error-handler.js` - `ErrorLogger` class
- **Features**:
  - Automatic log rotation
  - Date-based log files
  - JSON format for easy parsing
  - Max file size limit (5MB)
  - Max log files (10)
  - Log location: `%APPDATA%\Depo\logs\error-YYYY-MM-DD.log`

### 5. Edge Case Handling
- **Status**: ✅ Implemented
- **Location**: `src/utils/error-handler.js` - `ErrorHandler` class
- **Features**:
  - Divide by zero prevention (`safeDivide()`)
  - Null/undefined handling (`getOrDefault()`, `safeNumber()`, `safeString()`)
  - Empty dataset handling (`handleEmptyDataset()`)
  - Network error handling (`NetworkError` class)

### 6. Graceful Degradation
- **Status**: ✅ Implemented
- **Features**:
  - Fallback values for all operations
  - Error boundaries prevent app crashes
  - User-friendly error messages instead of technical errors
  - Continued operation when non-critical errors occur

### 7. SQL Injection Prevention
- **Status**: ✅ Implemented
- **Location**: `src/utils/error-handler.js` - `InputSanitizer.sanitizeSQL()`
- **Features**:
  - Removes dangerous SQL patterns
  - Sanitizes all user inputs before database operations
  - Parameterized queries (via db-safe.js)

### 8. Input Sanitization
- **Status**: ✅ Implemented
- **Location**: `src/utils/error-handler.js` - `InputSanitizer` class
- **Features**:
  - String sanitization
  - Number sanitization
  - Email sanitization
  - Phone sanitization
  - HTML sanitization (XSS prevention)
  - SQL sanitization
  - Recursive object sanitization

## 📚 Usage Examples

### Database Operations with Error Handling

```javascript
import { errorHandler, DatabaseError } from './src/utils/error-handler.js';
import safeDb from './src/database/db-safe.js';

// Safe database operation
try {
  const products = await safeDb.find('products', p => p.category === 'Electronics');
  if (products.isEmpty) {
    console.log('No products found');
  } else {
    console.log(`Found ${products.data.length} products`);
  }
} catch (error) {
  if (error instanceof DatabaseError) {
    errorDisplay.showError(errorHandler.getUserMessage(error));
  } else {
    errorDisplay.showError('An unexpected error occurred');
  }
}
```

### Form Validation

```javascript
import { FormValidator, ValidationSchemas, createValidatorFromSchema } from './src/utils/validation.js';
import errorDisplay from './src/components/ErrorDisplay.js';

// Create validator from schema
const validator = createValidatorFromSchema(ValidationSchemas.product);

// Or create custom validator
const customValidator = new FormValidator();
customValidator
  .addRule('name', 'required')
  .addRule('name', 'minLength:2')
  .addRule('name', 'maxLength:200')
  .addRule('price', 'required')
  .addRule('price', 'number')
  .addRule('price', 'min:0')
  .addRule('email', 'email');

// Validate form
const formData = {
  name: document.getElementById('productName').value,
  price: document.getElementById('productPrice').value,
  email: document.getElementById('productEmail').value
};

const result = validator.validateForm(formData);

if (!result.valid) {
  errorDisplay.showValidationErrors(result.errors, formElement);
  return;
}

// Form is valid, proceed with submission
```

### Input Sanitization

```javascript
import { InputSanitizer } from './src/utils/error-handler.js';

// Sanitize user input
const userInput = document.getElementById('userInput').value;
const sanitized = InputSanitizer.sanitizeString(userInput, {
  maxLength: 100,
  allowControlChars: false
});

// Sanitize number
const price = InputSanitizer.sanitizeNumber(inputPrice, {
  min: 0,
  max: 1000000,
  defaultValue: 0
});

// Sanitize email
const email = InputSanitizer.sanitizeEmail(inputEmail);

// Sanitize phone
const phone = InputSanitizer.sanitizePhone(inputPhone);

// Sanitize entire object
const formData = InputSanitizer.sanitizeObject(rawFormData);
```

### Error Display

```javascript
import errorDisplay from './src/components/ErrorDisplay.js';

// Show general error
errorDisplay.showError('Something went wrong', null, {
  type: 'error',
  duration: 5000,
  dismissible: true
});

// Show field-specific error
errorDisplay.showFieldError('productName', 'Name is required', formElement);

// Show validation errors
errorDisplay.showValidationErrors({
  name: ['Name is required'],
  price: ['Price must be greater than 0']
}, formElement);

// Clear all errors
errorDisplay.clearErrors();
```

### Edge Case Handling

```javascript
import { errorHandler } from './src/utils/error-handler.js';

// Safe division (prevents divide by zero)
const average = errorHandler.safeDivide(total, count, 0);

// Safe number conversion
const quantity = errorHandler.safeNumber(inputValue, 0);

// Safe string conversion
const name = errorHandler.safeString(inputValue, '');

// Get value or default
const price = errorHandler.getOrDefault(product.price, 0);

// Handle empty dataset
const result = errorHandler.handleEmptyDataset(products, 'No products available');
if (result.isEmpty) {
  console.log(result.message);
} else {
  console.log(`Found ${result.data.length} products`);
}
```

### Error Logging

```javascript
import { errorLogger } from './src/utils/error-handler.js';

// Errors are automatically logged when using errorHandler.handleError()
// Or manually log:
try {
  // Some operation
} catch (error) {
  errorLogger.logError(error, {
    operation: 'createProduct',
    userId: 123,
    productData: formData
  });
}

// Get recent errors
const recentErrors = errorLogger.getRecentErrors(50);
console.log(recentErrors);
```

## 🔧 Integration Guide

### 1. Update Database Operations

Replace direct database calls with safe wrapper:

```javascript
// Before
const products = db.find('products');

// After
import safeDb from './src/database/db-safe.js';
try {
  const result = await safeDb.find('products');
  const products = result.isEmpty ? [] : result.data;
} catch (error) {
  errorDisplay.showError(errorHandler.getUserMessage(error));
}
```

### 2. Add Form Validation

```javascript
import { createValidatorFromSchema, ValidationSchemas } from './src/utils/validation.js';
import errorDisplay from './src/components/ErrorDisplay.js';

const validator = createValidatorFromSchema(ValidationSchemas.product);

async function handleSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  
  // Validate
  const result = validator.validateForm(data);
  if (!result.valid) {
    errorDisplay.showValidationErrors(result.errors, event.target);
    return;
  }
  
  // Sanitize
  const sanitized = InputSanitizer.sanitizeObject(data);
  
  // Submit
  try {
    await safeDb.insert('products', sanitized);
    errorDisplay.showError('Product created successfully', null, { type: 'success' });
  } catch (error) {
    errorDisplay.showError(errorHandler.getUserMessage(error));
  }
}
```

### 3. Wrap All Async Operations

```javascript
import { errorHandler } from './src/utils/error-handler.js';

// Wrap async function
const result = await errorHandler.wrapAsync(async () => {
  return await someAsyncOperation();
}, { context: 'operation name' });

if (result.error) {
  errorDisplay.showError(result.message);
}
```

## 📋 Validation Rules Reference

### Available Validators

- `required` - Field must have a value
- `email` - Valid email format
- `phone` - Valid phone number format
- `number` - Valid number
- `integer` - Whole number
- `positive` - Positive number
- `min(value)` - Minimum value
- `max(value)` - Maximum value
- `minLength(length)` - Minimum string length
- `maxLength(length)` - Maximum string length
- `pattern(regex, message)` - Regex pattern match
- `date` - Valid date
- `url` - Valid URL
- `custom(validator, message)` - Custom validator function

### Predefined Schemas

- `ValidationSchemas.product` - Product validation
- `ValidationSchemas.customer` - Customer validation
- `ValidationSchemas.supplier` - Supplier validation
- `ValidationSchemas.sale` - Sale validation
- `ValidationSchemas.purchase` - Purchase validation

## 🛡️ Security Features

### SQL Injection Prevention
- All inputs sanitized before database operations
- Parameterized queries (via db-safe.js)
- Dangerous SQL patterns removed

### XSS Prevention
- HTML sanitization for all user inputs
- HTML entities escaped
- Safe string rendering

### Input Validation
- Type checking
- Range validation
- Format validation
- Length limits

## 📊 Error Logging

### Log File Location
- **Windows**: `%APPDATA%\Depo\logs\error-YYYY-MM-DD.log`
- **macOS**: `~/Library/Logs/Depo/error-YYYY-MM-DD.log`
- **Linux**: `~/.local/share/Depo/logs/error-YYYY-MM-DD.log`

### Log Format
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "Error message",
  "stack": "Error stack trace",
  "name": "ErrorType",
  "context": {
    "operation": "createProduct",
    "userId": 123
  }
}
```

### Log Rotation
- Max file size: 5MB
- Max log files: 10
- Automatic rotation
- Oldest files deleted first

## 🚨 Error Types

### AppError
Base error class for all application errors.

### ValidationError
Thrown when validation fails.
```javascript
throw new ValidationError('Name is required', 'name', value);
```

### DatabaseError
Thrown when database operations fail.
```javascript
throw new DatabaseError('Failed to insert record', 'insert', 'products');
```

### NetworkError
Thrown when network operations fail.
```javascript
throw new NetworkError('Connection timeout', 'https://api.example.com');
```

## ✅ Best Practices

1. **Always use try-catch** for database operations
2. **Validate before sanitize** - Check format, then clean
3. **Sanitize all user inputs** - Never trust user input
4. **Use safe wrappers** - Use `safeDb` instead of direct `db` calls
5. **Show user-friendly messages** - Use `errorDisplay` component
6. **Log all errors** - Errors are automatically logged
7. **Handle edge cases** - Use `errorHandler` utility methods
8. **Test error scenarios** - Test with invalid inputs

## 🔍 Debugging

### Enable Debug Mode
```javascript
localStorage.setItem('debug', 'true');
```

### View Error Logs
```javascript
import { errorLogger } from './src/utils/error-handler.js';
const errors = errorLogger.getRecentErrors(50);
console.table(errors);
```

### Performance Monitoring
Errors are automatically tracked in performance monitor.

## 📝 Migration Checklist

- [ ] Replace direct `db` calls with `safeDb`
- [ ] Add validation to all forms
- [ ] Sanitize all user inputs
- [ ] Wrap async operations with try-catch
- [ ] Use `errorDisplay` for user messages
- [ ] Handle edge cases (null, undefined, empty)
- [ ] Test error scenarios
- [ ] Review error logs regularly

