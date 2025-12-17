# Database Module (`database.js`)

Comprehensive database module with connection pooling, transactions, and helper functions.

## Features

✅ **Automatic Initialization** - Creates all tables on first run  
✅ **Connection Pooling** - Manages concurrent database access  
✅ **Transaction Support** - Batch operations with rollback  
✅ **Error Handling & Logging** - Comprehensive error tracking  
✅ **Windows AppData Path** - Stores database in user's AppData folder  
✅ **SQL-like API** - Familiar `query()`, `run()`, `get()`, `all()` methods  
✅ **Backup Support** - Automatic backups before saves  

## Quick Start

```javascript
const db = require('./src/database/database');

// Initialize (creates tables automatically)
await db.init('business.db.json');

// Query data
const products = await db.all('SELECT * FROM products');
const product = await db.get('SELECT * FROM products WHERE id = ?', [1]);

// Insert data
const result = await db.run(
  'INSERT INTO products (name, price) VALUES (?, ?)',
  ['Product Name', 99.99]
);

// Update data
await db.run('UPDATE products SET price = ? WHERE id = ?', [149.99, 1]);

// Delete data
await db.run('DELETE FROM products WHERE id = ?', [1]);
```

## Database Location

The database is automatically stored in:

- **Windows**: `%APPDATA%\Depo\business.db.json`
- **macOS**: `~/Library/Application Support/Depo/business.db.json`
- **Linux**: `~/.config/Depo/business.db.json`

Or uses Electron's `app.getPath('userData')` if available.

## API Reference

### `init(dbFileName)`

Initialize database connection and create all tables.

```javascript
await db.init('business.db.json');
```

### `query(sql, params)`

Execute SELECT queries. Returns array of results.

```javascript
const results = await db.query('SELECT * FROM products WHERE category = ?', ['Electronics']);
```

### `all(sql, params)`

Alias for `query()`. Returns all matching records.

```javascript
const allProducts = await db.all('SELECT * FROM products');
```

### `get(sql, params)`

Get single record (first match). Returns object or null.

```javascript
const product = await db.get('SELECT * FROM products WHERE id = ?', [1]);
```

### `run(sql, params)`

Execute INSERT, UPDATE, DELETE statements. Returns result object.

```javascript
// INSERT
const result = await db.run(
  'INSERT INTO products (name, price) VALUES (?, ?)',
  ['Product', 99.99]
);
// Returns: { changes: 1, lastInsertRowid: 123 }

// UPDATE
const result = await db.run(
  'UPDATE products SET price = ? WHERE id = ?',
  [149.99, 1]
);
// Returns: { changes: 1 }

// DELETE
const result = await db.run('DELETE FROM products WHERE id = ?', [1]);
// Returns: { changes: 1 }
```

## Transactions

### Begin Transaction

```javascript
const transaction = db.beginTransaction();

try {
  await db.run('INSERT INTO products (name) VALUES (?)', ['Product 1']);
  await db.run('INSERT INTO products (name) VALUES (?)', ['Product 2']);
  
  // Commit all operations
  await transaction.commit();
} catch (error) {
  // Rollback on error
  await transaction.rollback();
}
```

### Transaction Benefits

- **Atomicity**: All operations succeed or all fail
- **Consistency**: Database stays in valid state
- **Isolation**: Operations are grouped together

## Connection Pooling

The module automatically manages connection pooling:

- Maximum 5 concurrent connections (configurable)
- Queues requests when pool is full
- Releases connections after operations complete

## Error Handling

All methods include comprehensive error handling:

```javascript
try {
  await db.run('INSERT INTO products (name) VALUES (?)', ['Product']);
} catch (error) {
  console.error('Database error:', error.message);
}
```

## Logging

The module includes built-in logging:

```javascript
// Enable debug logging
process.env.DB_DEBUG = 'true';

// Logs include:
// [DB INFO] - Information messages
// [DB ERROR] - Error messages
// [DB WARN] - Warning messages
// [DB DEBUG] - Debug messages (if enabled)
```

## Database Statistics

Get database statistics:

```javascript
const stats = db.getStats();
// Returns:
// {
//   path: '/path/to/database.json',
//   tables: { products: 10, suppliers: 5, ... },
//   totalRecords: 50
// }
```

## Backup

Create database backup:

```javascript
const backupPath = await db.backup();
// Creates backup at: database.json.backup

// Or specify custom path
const backupPath = await db.backup('/path/to/backup.json');
```

## Close Connection

Close database connection:

```javascript
await db.close();
```

## Example: Complete Workflow

```javascript
const db = require('./src/database/database');

async function main() {
  // Initialize
  await db.init('business.db.json');
  
  // Insert with transaction
  const transaction = db.beginTransaction();
  try {
    const supplier = await db.run(
      'INSERT INTO suppliers (company_name, phone) VALUES (?, ?)',
      ['Supplier Inc', '123-456-7890']
    );
    
    await db.run(
      'INSERT INTO products (name, supplier_id) VALUES (?, ?)',
      ['Product', supplier.lastInsertRowid]
    );
    
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
  
  // Query
  const products = await db.all('SELECT * FROM products');
  
  // Get stats
  const stats = db.getStats();
  console.log(`Total records: ${stats.totalRecords}`);
  
  // Close
  await db.close();
}
```

## Migration from `db.js`

The new `database.js` module is compatible with the existing `db.js` but provides additional features:

- ✅ Better error handling
- ✅ Connection pooling
- ✅ Transaction support
- ✅ Automatic table creation
- ✅ Windows AppData path support
- ✅ Backup functionality

You can use both modules together, or gradually migrate to `database.js`.

