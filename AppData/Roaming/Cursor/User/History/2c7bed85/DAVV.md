# Service Layer Documentation

## Overview

This document describes the complete service layer with dependency injection for the Supply Chain Management System.

## Architecture

The service layer follows these principles:
- **Dependency Injection**: All services are registered and resolved through DI container
- **Interface-Based Design**: All services implement interfaces for testability and flexibility
- **Error Handling**: All operations return `ServiceResponse<T>` with success/failure status
- **Async/Await**: All database operations are asynchronous
- **Logging**: All services use `ILogger` for error tracking

## Service Response Pattern

All services return `ServiceResponse<T>` or `ServiceResponse`:

```csharp
// Success response
var response = ServiceResponse<Product>.Success(product, "تم إنشاء المنتج بنجاح");
if (response.IsSuccess)
{
    var product = response.Data;
}

// Failure response
var response = ServiceResponse<Product>.Failure("خطأ في إنشاء المنتج");
if (!response.IsSuccess)
{
    var error = response.ErrorMessage;
}
```

## Available Services

### 1. IProductService
**Location**: `Services/Interfaces/IProductService.cs`  
**Implementation**: `Services/Implementations/ProductService.cs`

**Methods**:
- `GetAllProductsAsync()` - Get all products
- `GetProductByIdAsync(int id)` - Get product by ID
- `GetProductBySkuAsync(string sku)` - Get product by SKU
- `CreateProductAsync(Product product)` - Create new product
- `UpdateProductAsync(Product product)` - Update product
- `DeleteProductAsync(int id)` - Delete product
- `GetLowStockProductsAsync()` - Get products with low stock
- `UpdateStockAsync(int productId, int quantityChange)` - Update stock quantity
- `SearchProductsAsync(string searchTerm)` - Search products
- `GetProductsByCategoryAsync(string category)` - Get products by category

### 2. ISupplierService
**Location**: `Services/Interfaces/ISupplierService.cs`  
**Implementation**: `Services/Implementations/SupplierService.cs`

**Methods**:
- `GetAllSuppliersAsync()` - Get all active suppliers
- `GetSupplierByIdAsync(int id)` - Get supplier by ID
- `CreateSupplierAsync(Supplier supplier)` - Create new supplier
- `UpdateSupplierAsync(Supplier supplier)` - Update supplier
- `DeleteSupplierAsync(int id)` - Deactivate supplier
- `UpdateSupplierDebtAsync(int supplierId, decimal amount)` - Update supplier debt
- `GetSuppliersWithDebtAsync()` - Get suppliers with outstanding debt
- `SearchSuppliersAsync(string searchTerm)` - Search suppliers

### 3. ICustomerService
**Location**: `Services/Interfaces/ICustomerService.cs`  
**Implementation**: `Services/Implementations/CustomerService.cs`

**Methods**:
- `GetAllCustomersAsync()` - Get all active customers
- `GetCustomerByIdAsync(int id)` - Get customer by ID
- `CreateCustomerAsync(Customer customer)` - Create new customer
- `UpdateCustomerAsync(Customer customer)` - Update customer
- `DeleteCustomerAsync(int id)` - Deactivate customer
- `UpdateCustomerDebtAsync(int customerId, decimal amount)` - Update customer debt
- `GetCustomersWithDebtAsync()` - Get customers with outstanding debt
- `SearchCustomersAsync(string searchTerm)` - Search customers

### 4. IPurchaseService
**Location**: `Services/Interfaces/IPurchaseService.cs`  
**Implementation**: `Services/Implementations/PurchaseService.cs`

**Methods**:
- `GetAllPurchasesAsync()` - Get all purchases
- `GetPurchaseByIdAsync(int id)` - Get purchase by ID
- `CreatePurchaseAsync(Purchase purchase, List<PurchaseItem> items)` - Create purchase with items
- `UpdatePurchaseStatusAsync(int purchaseId, string status)` - Update purchase status
- `ReceivePurchaseAsync(int purchaseId)` - Mark purchase as received and update inventory
- `RecordPurchasePaymentAsync(int purchaseId, decimal amount, string method)` - Record payment
- `GetTotalPurchasesAsync(DateTime? startDate, DateTime? endDate)` - Get total purchases
- `GetPendingPurchasesAsync()` - Get pending purchases

### 5. ISaleService
**Location**: `Services/Interfaces/ISaleService.cs`  
**Implementation**: `Services/Implementations/SaleService.cs`

**Methods**:
- `GetAllSalesAsync()` - Get all sales
- `GetSaleByIdAsync(int id)` - Get sale by ID
- `CreateSaleAsync(Sale sale, List<SaleItem> items)` - Create sale with items (deducts stock)
- `UpdateSaleStatusAsync(int saleId, string status)` - Update sale status
- `RecordSalePaymentAsync(int saleId, decimal amount, string method)` - Record payment
- `GetTotalSalesAsync(DateTime? startDate, DateTime? endDate)` - Get total sales
- `GetPendingSalesAsync()` - Get pending sales
- `GetSalesByCustomerAsync(int customerId)` - Get sales by customer

### 6. IPaymentService
**Location**: `Services/Interfaces/IPaymentService.cs`  
**Implementation**: `Services/Implementations/PaymentService.cs`

**Methods**:
- `RecordCustomerPaymentAsync(int saleId, decimal amount, string method, string? notes)` - Record customer payment
- `RecordSupplierPaymentAsync(int purchaseId, decimal amount, string method, string? notes)` - Record supplier payment
- `GetAllPaymentsAsync()` - Get all payments
- `GetPaymentsByDateRangeAsync(DateTime startDate, DateTime endDate)` - Get payments by date range
- `GetPaymentsBySaleAsync(int saleId)` - Get payments for a sale
- `GetPaymentsByPurchaseAsync(int purchaseId)` - Get payments for a purchase
- `DeletePaymentAsync(int paymentId)` - Delete payment

### 7. IExpenseService
**Location**: `Services/Interfaces/IExpenseService.cs`  
**Implementation**: `Services/Implementations/ExpenseService.cs`

**Methods**:
- `CreateExpenseAsync(Expense expense)` - Create new expense
- `UpdateExpenseAsync(Expense expense)` - Update expense
- `DeleteExpenseAsync(int id)` - Delete expense
- `GetAllExpensesAsync()` - Get all expenses
- `GetExpensesByDateRangeAsync(DateTime startDate, DateTime endDate)` - Get expenses by date range
- `GetExpensesByCategoryAsync(string category)` - Get expenses by category
- `GetTotalExpensesAsync(DateTime? startDate, DateTime? endDate)` - Get total expenses

### 8. IReportService
**Location**: `Services/Interfaces/IReportService.cs`  
**Implementation**: `Services/Implementations/ReportService.cs`

**Methods**:
- `GetDashboardStatsAsync()` - Get dashboard statistics
- `GetTopSellingProductsAsync(int count, DateTime? startDate, DateTime? endDate)` - Get top selling products
- `GetRecentSalesAsync(int count)` - Get recent sales
- `GetSalesReportAsync(DateTime startDate, DateTime endDate)` - Get sales report
- `GetProfitReportAsync(DateTime startDate, DateTime endDate)` - Get profit report
- `GetInventoryReportAsync()` - Get inventory report

### 9. IUserService
**Location**: `Services/Interfaces/IUserService.cs`  
**Implementation**: `Services/Implementations/UserService.cs`

**Methods**:
- `AuthenticateAsync(string username, string password)` - Authenticate user
- `CreateUserAsync(User user, string password)` - Create new user (hashes password)
- `UpdateUserAsync(User user)` - Update user
- `ChangePasswordAsync(int userId, string oldPassword, string newPassword)` - Change password
- `DeactivateUserAsync(int userId)` - Deactivate user
- `GetAllUsersAsync()` - Get all users
- `GetUserByIdAsync(int id)` - Get user by ID
- `GetUsersByRoleAsync(string role)` - Get users by role
- `UpdateLastLoginAsync(int userId)` - Update last login time

### 10. IActivityLogService
**Location**: `Services/Interfaces/IActivityLogService.cs`  
**Implementation**: `Services/Implementations/ActivityLogService.cs`

**Methods**:
- `LogActivityAsync(int? userId, string action, string tableName, int? recordId, string? oldValue, string? newValue)` - Log activity
- `GetAllLogsAsync()` - Get all logs
- `GetLogsByUserAsync(int userId)` - Get logs by user
- `GetLogsByTableAsync(string tableName)` - Get logs by table
- `GetLogsByDateRangeAsync(DateTime startDate, DateTime endDate)` - Get logs by date range
- `GetLogsByRecordAsync(string tableName, int recordId)` - Get logs for specific record

### 11. IBackupService
**Location**: `Services/Interfaces/IBackupService.cs`  
**Implementation**: `Services/Implementations/BackupService.cs`

**Methods**:
- `CreateBackupAsync(string? backupPath)` - Create database backup
- `RestoreBackupAsync(string backupFilePath)` - Restore from backup
- `GetAvailableBackupsAsync()` - Get list of available backups
- `DeleteBackupAsync(string backupFilePath)` - Delete backup file

### 12. IInvoiceService
**Location**: `Services/Interfaces/IInvoiceService.cs`  
**Implementation**: `Services/Implementations/InvoiceService.cs`

**Methods**:
- `GenerateSaleInvoiceHtmlAsync(int saleId)` - Generate sale invoice HTML
- `GeneratePurchaseInvoiceHtmlAsync(int purchaseId)` - Generate purchase invoice HTML
- `PrintSaleInvoiceAsync(int saleId)` - Print sale invoice
- `ExportInvoiceToPdfAsync(int saleId, string? outputPath)` - Export invoice to PDF/HTML

## Using Services in ViewModels

### Example: Using IProductService

```csharp
using SupplyChainManagement.Services.Interfaces;
using SupplyChainManagement.Common;

public class InventoryViewModel : BaseViewModel
{
    private readonly IProductService _productService;

    public InventoryViewModel()
    {
        // Get service from DI container
        _productService = App.ServiceProvider.GetRequiredService<IProductService>();
    }

    private async Task LoadProductsAsync()
    {
        var response = await _productService.GetAllProductsAsync();
        if (response.IsSuccess)
        {
            Products = response.Data!;
        }
        else
        {
            MessageBox.Show(response.ErrorMessage, "خطأ", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private async Task CreateProductAsync(Product product)
    {
        var response = await _productService.CreateProductAsync(product);
        if (response.IsSuccess)
        {
            MessageBox.Show("تم إنشاء المنتج بنجاح", "نجح", MessageBoxButton.OK, MessageBoxImage.Information);
            await LoadProductsAsync();
        }
        else
        {
            MessageBox.Show(response.ErrorMessage, "خطأ", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }
}
```

## Dependency Injection Setup

All services are registered in `Services/ServiceRegistration.cs` and configured in `App.xaml.cs`:

```csharp
// In App.xaml.cs
public static IServiceProvider ServiceProvider { get; private set; } = null!;

private void ConfigureServices()
{
    var services = new ServiceCollection();
    services.AddApplicationServices(); // Registers all services
    ServiceProvider = services.BuildServiceProvider();
}
```

## Base Service Class

All services inherit from `BaseService` which provides:
- `_context` - Database context
- `_logger` - Logger instance
- `SaveChangesAsync()` - Helper method for saving changes with error handling

## Error Handling

All services:
- Catch exceptions and log them
- Return `ServiceResponse` with error messages in Arabic
- Never throw exceptions to callers
- Validate input parameters

## Logging

All services use `ILogger<T>` for logging:
- Information: Normal operations
- Warning: Potential issues
- Error: Exceptions and failures

## Notes

1. **Service Lifetime**: All services are registered as `Scoped` - one instance per request/scope
2. **DbContext**: Also registered as `Scoped` to ensure proper disposal
3. **Circular Dependencies**: Resolved through interface-based design
4. **Thread Safety**: Services are not thread-safe; use one instance per thread/scope

## Next Steps

1. Update existing ViewModels to use the new service layer
2. Remove old service classes that don't use DI
3. Add unit tests for services
4. Implement caching if needed
5. Add transaction support for complex operations

