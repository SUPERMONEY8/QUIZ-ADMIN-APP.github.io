# Complete Database Schema Documentation

## Overview

This document describes the complete database schema for the Supply Chain Management System using Entity Framework Core with SQLite.

## Database Models

### 1. Product
**Purpose:** Stores product/inventory information

**Fields:**
- `Id` (int, PK)
- `Name` (string, required, max 100)
- `Brand` (string, nullable, max 100)
- `Description` (string, nullable, max 500)
- `SKU` (string, required, max 50, unique index)
- `Category` (string, nullable, max 50, indexed)
- `BuyingPrice` (decimal 18,2)
- `SellingPrice` (decimal 18,2)
- `Quantity` (int)
- `SupplierId` (int, nullable, FK to Supplier, indexed)
- `ExpirationDate` (DateTime, nullable, indexed)
- `ImagePath` (string, nullable, max 500)
- `Unit` (string, nullable, max 50)
- `CreatedDate` (DateTime, default: now)
- `LastModified` (DateTime, nullable)

**Relationships:**
- Many-to-One with Supplier
- One-to-Many with SaleItem
- One-to-Many with PurchaseItem

**Indexes:**
- SKU (unique)
- Name
- Category
- SupplierId
- ExpirationDate

---

### 2. Supplier
**Purpose:** Stores supplier/vendor information

**Fields:**
- `Id` (int, PK)
- `CompanyName` (string, required, max 100, indexed)
- `ContactPerson` (string, nullable, max 100)
- `Phone` (string, nullable, max 20, indexed)
- `Email` (string, nullable, max 100, indexed)
- `Address` (string, nullable, max 200)
- `City` (string, nullable, max 100)
- `CreditLimit` (decimal 18,2, default: 0)
- `TotalDebt` (decimal 18,2, default: 0)
- `CreatedDate` (DateTime, default: now)

**Relationships:**
- One-to-Many with Product
- One-to-Many with Purchase

**Indexes:**
- CompanyName
- Email
- Phone

---

### 3. Customer
**Purpose:** Stores customer information

**Fields:**
- `Id` (int, PK)
- `Name` (string, required, max 100, indexed)
- `Phone` (string, nullable, max 20, indexed)
- `Email` (string, nullable, max 100, indexed)
- `Address` (string, nullable, max 200)
- `City` (string, nullable, max 100)
- `TotalDebt` (decimal 18,2, default: 0)
- `CreditLimit` (decimal 18,2, default: 0)
- `CreatedDate` (DateTime, default: now)

**Relationships:**
- One-to-Many with Sale

**Indexes:**
- Name
- Email
- Phone

---

### 4. Purchase
**Purpose:** Stores purchase orders from suppliers

**Fields:**
- `Id` (int, PK)
- `SupplierId` (int, required, FK to Supplier, indexed)
- `InvoiceNumber` (string, required, max 50, unique index)
- `TotalAmount` (decimal 18,2)
- `PaidAmount` (decimal 18,2, default: 0)
- `IsPaid` (bool, default: false, indexed)
- `PurchaseDate` (DateTime, default: now, indexed)
- `DueDate` (DateTime, nullable)
- `Notes` (string, nullable, max 500)

**Relationships:**
- Many-to-One with Supplier
- One-to-Many with PurchaseItem
- One-to-Many with Payment

**Indexes:**
- InvoiceNumber (unique)
- SupplierId
- PurchaseDate
- IsPaid

---

### 5. PurchaseItem
**Purpose:** Stores line items for purchases

**Fields:**
- `Id` (int, PK)
- `PurchaseId` (int, required, FK to Purchase)
- `ProductId` (int, required, FK to Product)
- `Quantity` (int)
- `UnitPrice` (decimal 18,2)
- `TotalPrice` (decimal 18,2)

**Relationships:**
- Many-to-One with Purchase (Cascade delete)
- Many-to-One with Product (Restrict delete)

---

### 6. Sale
**Purpose:** Stores sales transactions

**Fields:**
- `Id` (int, PK)
- `InvoiceNumber` (string, required, max 50, unique index)
- `CustomerId` (int, required, FK to Customer, indexed)
- `TotalAmount` (decimal 18,2)
- `DiscountAmount` (decimal 18,2, default: 0)
- `TaxAmount` (decimal 18,2, default: 0)
- `FinalAmount` (decimal 18,2)
- `IsCredit` (bool, default: false, indexed)
- `PaymentMethod` (string, nullable, max 50)
- `SaleDate` (DateTime, default: now, indexed)
- `CreatedByUserId` (int, nullable, FK to User, indexed)

**Relationships:**
- Many-to-One with Customer (Restrict delete)
- Many-to-One with User (SetNull on delete)
- One-to-Many with SaleItem
- One-to-Many with Payment

**Indexes:**
- InvoiceNumber (unique)
- CustomerId
- SaleDate
- CreatedByUserId
- IsCredit

---

### 7. SaleItem
**Purpose:** Stores line items for sales

**Fields:**
- `Id` (int, PK)
- `SaleId` (int, required, FK to Sale)
- `ProductId` (int, required, FK to Product)
- `Quantity` (int)
- `UnitPrice` (decimal 18,2)
- `TotalPrice` (decimal 18,2)

**Relationships:**
- Many-to-One with Sale (Cascade delete)
- Many-to-One with Product (Restrict delete)

---

### 8. Payment
**Purpose:** Stores payment transactions for sales and purchases

**Fields:**
- `Id` (int, PK)
- `Type` (string, required, max 50, indexed) - "CustomerPayment" or "SupplierPayment"
- `RelatedId` (int, nullable, indexed) - SaleId or PurchaseId
- `Amount` (decimal 18,2)
- `PaymentMethod` (string, nullable, max 50)
- `PaymentDate` (DateTime, default: now, indexed)
- `Notes` (string, nullable, max 500)
- `SaleId` (int, nullable, FK to Sale, indexed)
- `PurchaseId` (int, nullable, FK to Purchase, indexed)

**Relationships:**
- Many-to-One with Sale (SetNull on delete)
- Many-to-One with Purchase (SetNull on delete)

**Indexes:**
- Type
- RelatedId
- PaymentDate
- SaleId
- PurchaseId

---

### 9. Expense
**Purpose:** Stores business expenses

**Fields:**
- `Id` (int, PK)
- `Category` (string, required, max 100, indexed)
- `Amount` (decimal 18,2)
- `Description` (string, nullable, max 500)
- `Date` (DateTime, default: now, indexed)
- `CreatedByUserId` (int, nullable, FK to User, indexed)

**Relationships:**
- Many-to-One with User (SetNull on delete)

**Indexes:**
- Category
- Date
- CreatedByUserId

---

### 10. User
**Purpose:** Stores user accounts and authentication

**Fields:**
- `Id` (int, PK)
- `Username` (string, required, max 50, unique index)
- `PasswordHash` (string, required, max 256)
- `Role` (string, required, max 20, default: "Cashier", indexed) - "Admin", "Cashier", "Manager"
- `FullName` (string, nullable, max 100)
- `IsActive` (bool, default: true, indexed)
- `CreatedDate` (DateTime, default: now)
- `LastLogin` (DateTime, nullable)

**Relationships:**
- One-to-Many with Sale (as CreatedByUser)
- One-to-Many with Expense (as CreatedByUser)
- One-to-Many with ActivityLog

**Indexes:**
- Username (unique)
- Role
- IsActive

---

### 11. ActivityLog
**Purpose:** Audit trail for all database operations

**Fields:**
- `Id` (int, PK)
- `UserId` (int, nullable, FK to User, indexed)
- `Action` (string, required, max 50) - "Create", "Update", "Delete"
- `TableName` (string, required, max 50, indexed)
- `RecordId` (int, nullable, indexed)
- `OldValue` (text, nullable) - JSON string of old values
- `NewValue` (text, nullable) - JSON string of new values
- `Timestamp` (DateTime, default: now, indexed)

**Relationships:**
- Many-to-One with User (SetNull on delete)

**Indexes:**
- UserId
- TableName
- RecordId
- Timestamp
- Composite: (TableName, RecordId)

---

## Database Configuration

### Connection String
- **Provider:** SQLite
- **Database File:** `SupplyChain.db`
- **Location:** Same directory as executable

### Fluent API Features
- All relationships configured with appropriate delete behaviors
- Indexes on frequently queried columns
- Default values for audit fields (CreatedDate, etc.)
- Decimal precision set to (18,2) for all monetary values
- Unique constraints on SKU, InvoiceNumber, Username

### Delete Behaviors
- **Cascade:** PurchaseItem, SaleItem (when parent is deleted)
- **Restrict:** Product, Supplier, Customer (prevent deletion if referenced)
- **SetNull:** Optional foreign keys (User, Supplier on Product, etc.)

## Migration Commands

See `MIGRATION_INSTRUCTIONS.md` for detailed migration setup and usage.

## Next Steps

1. Run initial migration: `dotnet ef migrations add InitialCreate`
2. Apply migration: `dotnet ef database update`
3. Database will be created automatically on first run

