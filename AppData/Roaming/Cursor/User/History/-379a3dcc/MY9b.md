# Inventory/Products Module Documentation

## Overview

Complete Inventory Management module with advanced features including barcode generation, Excel import/export, and real-time stock monitoring.

## Components Created

### 1. ProductDto (`Models/ProductDto.cs`)
Data Transfer Object with calculated properties:
- **Basic Properties**: Id, Name, SKU, Brand, Category, Description
- **Pricing**: BuyingPrice, SellingPrice
- **Stock**: Quantity, MinimumStockLevel
- **Calculated Properties**:
  - `Margin` - Profit margin (SellingPrice - BuyingPrice)
  - `MarginPercent` - Profit percentage
  - `StockStatus` - Text status (نفد, منخفض, متوسط, جيد)
  - `StockStatusColor` - Color code for stock level
  - `IsExpiringSoon` - True if expires within 30 days

### 2. InventoryViewModel (`ViewModels/InventoryViewModel.cs`)
Complete ViewModel with:

**Properties:**
- `Products` - All products collection
- `FilteredProducts` - Filtered/search results
- `SelectedProduct` - Currently selected product
- `EditingProduct` - Product being edited
- `SearchText` - Search query
- `FilterCategory` - Selected category filter
- `Categories` - Available categories
- `Suppliers` - All suppliers
- `TotalInventoryValue` - Total value of inventory
- `LowStockItems` - Count of low stock items
- `IsLoading` - Loading state
- `SelectedImagePath` - Selected image for product

**Commands:**
- `AddProductCommand` - Opens add product form
- `EditProductCommand` - Opens edit form
- `DeleteProductCommand` - Deletes product (with confirmation)
- `SearchProductCommand` - Searches products
- `FilterByCategoryCommand` - Filters by category
- `ImportProductsCommand` - Imports from Excel/CSV
- `ExportProductsCommand` - Exports to Excel/CSV
- `GenerateBarcodeCommand` - Generates barcode for product
- `ScanBarcodeCommand` - Scans barcode from image
- `RefreshCommand` - Refreshes product list
- `SaveProductCommand` - Saves product (create/update)
- `CancelEditCommand` - Cancels editing
- `SelectImageCommand` - Opens image selection dialog

**Methods:**
- `LoadProductsAsync()` - Loads all products
- `LoadSuppliersAsync()` - Loads suppliers
- `SearchProducts(string)` - Searches products
- `FilterByCategory(string)` - Filters by category
- `CalculateInventoryValue()` - Calculates total inventory value
- `CheckStockLevels()` - Counts low stock items
- `ValidateProduct(ProductDto)` - Validates product data

### 3. InventoryView (`Views/InventoryView.xaml`)
Modern UI with:

**Layout:**
- **Top Section**: Header with total inventory value
- **Search Bar**: Text search + category filter + action buttons
- **Main Area**: DataGrid with virtual scrolling
- **Side Panel**: Add/Edit form (slides in when editing)
- **Bottom Toolbar**: Low stock count + Add Product button

**DataGrid Columns:**
- Image (with placeholder)
- Name
- Brand
- Category
- Quantity (color-coded)
- Buy Price
- Sell Price
- Margin
- Margin %
- Expiry Date (highlighted if expiring soon)
- Supplier
- Actions (Edit, Delete, Generate Barcode)

**Features:**
- Virtual scrolling for performance
- Color-coded stock levels
- Image preview with placeholder
- Real-time search and filtering
- Form validation

### 4. Services

#### BarcodeService (`Services/Implementations/BarcodeService.cs`)
- `GenerateBarcodeAsync()` - Creates barcode image (CODE_128 format)
- `GenerateBarcodeBytesAsync()` - Returns barcode as byte array
- `ScanBarcodeAsync()` - Reads barcode from image file

#### ExcelExportService (`Services/Implementations/ExcelExportService.cs`)
- `ExportProductsToExcelAsync()` - Exports to Excel (.xlsx)
- `ImportProductsFromExcelAsync()` - Imports from Excel
- `ExportProductsToCsvAsync()` - Exports to CSV
- `ImportProductsFromCsvAsync()` - Imports from CSV

### 5. Converters

#### MarginConverter (`Converters/MarginConverter.cs`)
Calculates and formats margin from selling price and buying price

#### StockStatusColorConverter (`Converters/StockStatusColorConverter.cs`)
Converts stock quantity and minimum level to color:
- **Red** (#E81123): Out of stock (quantity = 0)
- **Yellow** (#FFB900): Low stock (quantity ≤ minimum)
- **Orange** (#FFC107): Medium stock (quantity ≤ minimum * 1.5)
- **Green** (#107C10): Good stock

## Features

### Search & Filter
- Real-time text search (Name, SKU, Brand, Category)
- Category filter dropdown
- Combined search + filter

### Stock Management
- Color-coded stock levels
- Low stock alerts
- Minimum stock level tracking
- Total inventory value calculation

### Barcode Support
- Generate barcode images (CODE_128)
- Scan barcodes from images
- Barcode saved to `Barcodes/` folder

### Import/Export
- **Excel Export**: Full product data with formatting
- **Excel Import**: Bulk import products
- **CSV Export**: Simple CSV format
- **CSV Import**: Import from CSV files

### Image Management
- Image upload for products
- Image preview in grid and form
- Placeholder for products without images

### Form Validation
- Required field validation
- Price validation
- SKU uniqueness check
- Business rule validation (selling price vs buying price)

## Usage

### Adding a Product
1. Click "+ إضافة منتج جديد" button
2. Fill in product details in side panel
3. Select image (optional)
4. Set pricing and stock levels
5. Click "حفظ"

### Editing a Product
1. Click "تعديل" button in product row
2. Modify details in side panel
3. Click "حفظ"

### Generating Barcode
1. Click barcode icon (📷) in product row
2. Barcode image is generated and saved
3. File path is shown in success message

### Importing Products
1. Click "📥 استيراد" button
2. Select Excel or CSV file
3. Products are imported (duplicates skipped)

### Exporting Products
1. Click "📤 تصدير" button
2. Choose file location and format
3. Products are exported with all data

## Color Coding

Stock levels are automatically color-coded:
- 🔴 **Red**: Out of stock
- 🟡 **Yellow**: Low stock (at or below minimum)
- 🟠 **Orange**: Medium stock (below 1.5x minimum)
- 🟢 **Green**: Good stock (above 1.5x minimum)

## Dependencies

- **ZXing.Net** (v0.16.9) - Barcode generation/scanning
- **EPPlus** (v7.0.0) - Excel file handling

## File Locations

- Barcodes: `[AppDirectory]/Barcodes/`
- Exports: `[AppDirectory]/Products_Export_YYYYMMDD_HHMMSS.xlsx`

## Next Steps

1. Add barcode printing functionality
2. Add bulk edit capabilities
3. Add product categories management
4. Add product variants (sizes, colors, etc.)
5. Add stock movement history

