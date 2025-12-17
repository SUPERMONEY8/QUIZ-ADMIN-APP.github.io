# Database Module Usage Guide

## ✅ Features Implemented

### 1. **Database Initialization**
- ✅ Automatically initializes connection
- ✅ Creates all 12 tables if they don't exist
- ✅ Stores database in Windows AppData folder (`%APPDATA%\Depo\`)

### 2. **Helper Functions**
- ✅ `query(sql, params)` - Execute SELECT queries
- ✅ `run(sql, params)` - Execute INSERT/UPDATE/DELETE
- ✅ `get(sql, params)` - Get single record
- ✅ `all(sql, params)` - Get all records

### 3. **Transaction Support**
- ✅ `beginTransaction()` - Start transaction
- ✅ `commit()` - Commit all operations
- ✅ `rollback()` - Rollback on error
- ✅ Atomic operations (all succeed or all fail)

### 4. **Connection Pooling**
- ✅ Manages up to 5 concurrent connections
- ✅ Queues requests when pool is full
- ✅ Automatic connection release

### 5. **Error Handling & Logging**
- ✅ Comprehensive error handling
- ✅ Built-in logger with levels (INFO, ERROR, WARN, DEBUG)
- ✅ Detailed error messages

### 6. **Database Instance Export**
- ✅ Singleton instance exported
- ✅ Can be used across entire app
- ✅ Already integrated in `main.js`

### 7. **Windows AppData Path**
- ✅ Automatically uses `%APPDATA%\Depo\` on Windows
- ✅ Falls back to Electron's `userData` if available
- ✅ Cross-platform support (Windows, macOS, Linux)

## Quick Examples

### Basic Usage

```javascript
const db = require('./src/database/database');

// Initialize (only needed once)
await db.init('business.db.json');

// Insert
await db.run('INSERT INTO products (name, price) VALUES (?, ?)', ['Product', 99.99]);

// Query
const products = await db.all('SELECT * FROM products');

// Get single
const product = await db.get('SELECT * FROM products WHERE id = ?', [1]);

// Update
await db.run('UPDATE products SET price = ? WHERE id = ?', [149.99, 1]);

// Delete
await db.run('DELETE FROM products WHERE id = ?', [1]);
```

### Transaction Example

```javascript
const transaction = db.beginTransaction();

try {
  await db.run('INSERT INTO suppliers (company_name) VALUES (?)', ['Supplier 1']);
  await db.run('INSERT INTO products (name, supplier_id) VALUES (?, ?)', ['Product', 1]);
  await transaction.commit();
} catch (error) {
  await transaction.rollback();
}
```

## Database Location

**Windows**: `C:\Users\YourUsername\AppData\Roaming\Depo\business.db.json`

The database is automatically stored in the user's AppData folder, making it:
- ✅ Persistent across app restarts
- ✅ User-specific (each user has their own database)
- ✅ Automatically backed up before saves

## Integration

The module is already integrated in:
- ✅ `main.js` - Initialized on app startup
- ✅ IPC handlers - Used for database viewer
- ✅ Ready for use in any part of your app

## Next Steps

You can now use this module anywhere in your app:

```javascript
// In any file
const db = require('./src/database/database');

// Use it directly (it's already initialized in main.js)
const products = await db.all('SELECT * FROM products');
```

No need to call `init()` again - it's already initialized when the app starts!

