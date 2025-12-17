# Business Management System Database

Complete database schema and models for a business management system with products, suppliers, purchases, sales, customers, payments, expenses, users, and activity logging.

## Database Schema

The database includes 12 tables:

1. **products** - Product inventory with pricing, stock, and supplier info
2. **suppliers** - Supplier information
3. **purchases** - Purchase orders from suppliers
4. **purchase_items** - Individual items in each purchase
5. **customers** - Customer information and debt tracking
6. **sales** - Sales transactions
7. **sale_items** - Individual items in each sale
8. **payments** - Payment records for purchases, sales, expenses, and debt
9. **expenses** - Business expenses
10. **users** - System users with roles
11. **activity_logs** - Audit trail of all database actions
12. **settings** - Application settings (key-value pairs)

## Initialization

### First Time Setup

```bash
bun run db:init
```

This will:
- Create all tables
- Insert default settings
- Create default admin user (username: `admin`, password: `admin123`)

### Reset Database

```bash
bun run db:reset
```

⚠️ **Warning**: This will delete all data and recreate the schema!

## Usage Examples

### Using Models (Recommended)

```javascript
const {
  createProduct,
  getAllProducts,
  createSale,
  getTotalSales
} = require('./src/database/models');

// Create a product
const product = createProduct({
  name: 'Laptop',
  brand: 'Dell',
  category: 'Electronics',
  buying_price: 800,
  selling_price: 1200,
  quantity: 10,
  unit: 'piece'
});

// Get all products
const products = getAllProducts();

// Create a sale
const sale = createSale({
  customer_id: 1,
  total_amount: 1200,
  discount: 50,
  tax: 0,
  paid_amount: 1150,
  payment_status: 'paid'
});

// Get total sales for a period
const totalSales = getTotalSales('2024-01-01', '2024-12-31');
```

### Direct Database Access

```javascript
const { initDatabase, insert, find, query } = require('./src/database/db');

// Initialize database
initDatabase('business.db.json');

// Insert a record
insert('products', {
  name: 'Mouse',
  buying_price: 10,
  selling_price: 20,
  quantity: 50
});

// Find records
const products = find('products');
const lowStock = find('products', p => p.quantity < 10);

// SQL-like queries
const results = query('SELECT * FROM products WHERE quantity < ?', [10]);
```

## Available Models

### Products
- `createProduct(data)` - Create a new product
- `getProduct(id)` - Get product by ID
- `getAllProducts()` - Get all products
- `getProductsByCategory(category)` - Filter by category
- `getLowStockProducts(threshold)` - Get products below threshold
- `updateProduct(id, updates)` - Update product
- `deleteProduct(id)` - Delete product

### Suppliers
- `createSupplier(data)` - Create supplier
- `getSupplier(id)` - Get supplier by ID
- `getAllSuppliers()` - Get all suppliers
- `updateSupplier(id, updates)` - Update supplier
- `deleteSupplier(id)` - Delete supplier

### Purchases
- `createPurchase(data)` - Create purchase order
- `getPurchase(id)` - Get purchase by ID
- `getAllPurchases()` - Get all purchases
- `getPurchasesBySupplier(supplierId)` - Filter by supplier
- `createPurchaseItem(data)` - Add item to purchase
- `getPurchaseItems(purchaseId)` - Get items in purchase

### Customers
- `createCustomer(data)` - Create customer
- `getCustomer(id)` - Get customer by ID
- `getAllCustomers()` - Get all customers
- `getCustomersWithDebt()` - Get customers with outstanding debt
- `updateCustomer(id, updates)` - Update customer
- `deleteCustomer(id)` - Delete customer

### Sales
- `createSale(data)` - Create sale
- `getSale(id)` - Get sale by ID
- `getAllSales()` - Get all sales
- `getSalesByCustomer(customerId)` - Filter by customer
- `createSaleItem(data)` - Add item to sale
- `getSaleItems(saleId)` - Get items in sale

### Payments
- `createPayment(data)` - Record payment
- `getPaymentsByType(type, referenceId)` - Get payments for transaction
- `getAllPayments()` - Get all payments

### Expenses
- `createExpense(data)` - Create expense
- `getExpense(id)` - Get expense by ID
- `getAllExpenses()` - Get all expenses
- `getExpensesByCategory(category)` - Filter by category
- `updateExpense(id, updates)` - Update expense
- `deleteExpense(id)` - Delete expense

### Users
- `createUser(data)` - Create user
- `getUser(id)` - Get user by ID
- `getUserByUsername(username)` - Get user by username
- `getAllUsers()` - Get all users
- `updateUser(id, updates)` - Update user
- `deleteUser(id)` - Delete user

### Activity Logs
- `logActivity(userId, action, tableName, recordId)` - Log an action
- `getActivityLogs(limit)` - Get recent activity logs
- `getActivityLogsByUser(userId)` - Get logs for a user
- `getActivityLogsByTable(tableName)` - Get logs for a table

### Settings
- `getSetting(key)` - Get setting value
- `setSetting(key, value)` - Set setting value
- `getAllSettings()` - Get all settings

### Reports
- `getTotalSales(startDate, endDate)` - Calculate total sales
- `getTotalProfit(startDate, endDate)` - Calculate total profit
- `getTotalExpenses(startDate, endDate)` - Calculate total expenses

## Database Location

The database file is stored in:
- **Electron**: `app.getPath('userData')/business.db.json`
- **Standalone**: `process.cwd()/business.db.json`

## Schema File

See `schema.sql` for the complete SQL schema definition (for reference if migrating to real SQLite).

## Notes

- All timestamps are stored as ISO 8601 strings
- Foreign key relationships are maintained in application logic
- The JSON database doesn't support traditional SQL indexes, but queries are optimized
- For production use, consider migrating to a real SQLite database for better performance

