# Supply Chain Management System - Project Structure

## Overview
A modern C# WPF application using Fluent WPF for a comprehensive Supply Chain Management System with dark theme and blue accents.

## Project Structure

```
SupplyChainManagement/
├── App.xaml                    # Main application file with dark theme
├── App.xaml.cs                 # Application code-behind
├── MainWindow.xaml             # Main shell with sidebar navigation
├── MainWindow.xaml.cs          # Main window code-behind
├── SupplyChainManagement.csproj # Project file with NuGet packages
│
├── Models/                     # Data Models
│   ├── Product.cs              # Product entity
│   ├── Supplier.cs             # Supplier entity
│   ├── Customer.cs             # Customer entity
│   ├── Sale.cs                 # Sale entity
│   ├── SaleItem.cs             # Sale line items
│   ├── Purchase.cs             # Purchase entity
│   ├── PurchaseItem.cs         # Purchase line items
│   ├── Payment.cs              # Payment entity
│   └── User.cs                 # User entity
│
├── Views/                      # XAML Views (User Controls)
│   ├── DashboardView.xaml      # Dashboard page
│   ├── InventoryView.xaml      # Inventory management
│   ├── SalesView.xaml          # Sales management
│   ├── PurchasesView.xaml      # Purchase management
│   ├── CustomersView.xaml      # Customer management
│   ├── SuppliersView.xaml      # Supplier management
│   ├── ReportsView.xaml        # Reports page
│   └── SettingsView.xaml        # Settings page
│
├── ViewModels/                 # MVVM ViewModels
│   ├── BaseViewModel.cs        # Base view model
│   ├── DashboardViewModel.cs   # Dashboard view model
│   ├── InventoryViewModel.cs   # Inventory view model
│   ├── SalesViewModel.cs       # Sales view model
│   ├── PurchasesViewModel.cs   # Purchases view model
│   ├── CustomersViewModel.cs   # Customers view model
│   ├── SuppliersViewModel.cs   # Suppliers view model
│   ├── ReportsViewModel.cs     # Reports view model
│   └── SettingsViewModel.cs    # Settings view model
│
├── Services/                   # Business Logic Services
│   ├── InventoryService.cs     # Inventory operations
│   ├── SalesService.cs         # Sales operations
│   ├── PurchaseService.cs     # Purchase operations
│   ├── CustomerService.cs      # Customer operations
│   ├── SupplierService.cs      # Supplier operations
│   └── ReportService.cs        # Reporting operations
│
├── Data/                       # Data Access Layer
│   └── ApplicationDbContext.cs # Entity Framework Core DbContext
│
└── Resources/                  # Resources and Styles
    └── Styles.xaml             # Fluent WPF styles and color scheme
```

## Features

- **Modern UI**: Fluent WPF with dark theme and blue accents
- **MVVM Pattern**: Clean separation of concerns
- **Entity Framework Core**: SQLite database for local storage
- **Responsive Design**: Works on 1920x1080 and higher resolutions
- **Sidebar Navigation**: Easy navigation between modules
- **CRUD Operations**: Full Create, Read, Update, Delete for all entities

## NuGet Packages

- SourceChord.FluentWPF (0.7.1) - Modern Fluent Design UI
- Microsoft.EntityFrameworkCore.Sqlite (8.0.0) - SQLite database provider
- Microsoft.EntityFrameworkCore.Tools (8.0.0) - EF Core tools
- CommunityToolkit.Mvvm (8.2.2) - MVVM helpers

## Database

The application uses SQLite with Entity Framework Core. The database file (`SupplyChain.db`) will be created automatically on first run.

## Getting Started

1. Restore NuGet packages
2. Build the solution
3. Run the application
4. The database will be created automatically on first launch

## Modules

- **Dashboard**: Overview statistics and key metrics
- **Inventory**: Product management with stock tracking
- **Sales**: Sales order management
- **Purchases**: Purchase order management
- **Customers**: Customer relationship management
- **Suppliers**: Supplier management
- **Reports**: Reporting and analytics
- **Settings**: Application configuration

