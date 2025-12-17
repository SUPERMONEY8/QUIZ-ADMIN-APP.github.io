# Depo - Business Management System

<div align="center">

![Depo](build/icon.ico)

**A comprehensive desktop business management application for inventory, sales, purchases, and customer management**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Building](#-building) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

**Depo** is a modern, feature-rich desktop application built with Electron and Bun for managing your business operations. It provides a complete solution for inventory management, sales tracking, purchase orders, customer management, and comprehensive reporting.

### Key Highlights

- ✅ **Zero External Database Dependencies** - Pure JavaScript file-based database
- ✅ **High Performance** - Optimized with lazy loading, virtual scrolling, and caching
- ✅ **Comprehensive Error Handling** - User-friendly errors with automatic logging
- ✅ **Production Ready** - Complete build configuration for Windows
- ✅ **Modern UI** - Beautiful, responsive interface with dark/light themes
- ✅ **Secure** - Input sanitization, SQL injection prevention, XSS protection

---

## ✨ Features

### Core Modules

- **📦 Products Management**
  - Product catalog with categories, brands, and barcodes
  - Stock tracking with low stock alerts
  - Buying and selling price management
  - Product images and detailed information

- **🏪 Suppliers Management**
  - Supplier database with contact information
  - Purchase history tracking
  - Payment tracking

- **🛒 Sales Management**
  - Point of Sale (POS) system
  - Multiple payment methods (Full, Partial, Credit)
  - Invoice generation
  - Sales history and analytics

- **📥 Purchases Management**
  - Purchase order creation
  - Multi-item purchase tracking
  - Supplier integration
  - Purchase history

- **👥 Customers Management**
  - Customer database
  - Debt tracking
  - Purchase history
  - Contact management

- **💰 Payments & Expenses**
  - Payment tracking for sales and purchases
  - Expense management
  - Financial reporting

- **📊 Reports & Analytics**
  - Sales reports
  - Inventory reports
  - Financial reports
  - Top selling products
  - Sales trends
  - Custom date range reports

- **⚙️ Settings**
  - Application configuration
  - User management
  - System preferences

### Technical Features

- **🚀 Performance Optimizations**
  - Lazy loading pages
  - Debounced search (300ms)
  - Virtual scrolling for long lists
  - Image lazy loading
  - Response caching
  - Batch DOM updates
  - Code splitting

- **🛡️ Error Handling**
  - Comprehensive try-catch blocks
  - Form validation with user-friendly messages
  - Automatic error logging to file
  - Edge case handling (null, undefined, divide by zero)
  - Graceful degradation

- **🔒 Security**
  - Input sanitization
  - SQL injection prevention
  - XSS protection
  - Secure data handling

- **📱 Responsive Design**
  - Mobile-first approach
  - Breakpoints: 640px, 768px, 1024px, 1280px
  - Touch-friendly buttons
  - Responsive tables and modals

---

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Windows 10/11 (for building Windows installers)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/depo/depo-app.git
   cd depo-app
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Initialize the database**:
   ```bash
   bun run db:init
   ```

4. **Run in development mode**:
   ```bash
   bun run dev
   ```

### Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password after first login!

---

## 📚 Documentation

### Main Guides

- **[BUILD.md](BUILD.md)** - Complete production build guide
- **[QUICK-START-BUILD.md](QUICK-START-BUILD.md)** - Quick build reference
- **[PERFORMANCE.md](PERFORMANCE.md)** - Performance optimization guide
- **[ERROR-HANDLING.md](ERROR-HANDLING.md)** - Error handling system
- **[MIGRATION-PERFORMANCE.md](MIGRATION-PERFORMANCE.md)** - Performance migration guide

### Technical Documentation

- **[BUILD-CONFIGURATION-SUMMARY.md](BUILD-CONFIGURATION-SUMMARY.md)** - Build configuration details
- **[build/code-signing.md](build/code-signing.md)** - Code signing guide
- **[src/database/README.md](src/database/README.md)** - Database documentation
- **[src/utils/router-README.md](src/utils/router-README.md)** - Router documentation

---

## 🏗️ Building

### Development Build

```bash
# Run in development mode
bun run dev
```

### Production Build

```bash
# Full production build (clean + optimize + build)
bun run build

# Or use dist command
bun run dist

# Windows-specific build
bun run build:win
```

The installer will be created in the `dist` directory as `Depo-1.0.0-Setup.exe`.

For detailed build instructions, see [BUILD.md](BUILD.md).

---

## 📁 Project Structure

```
Depo/
├── main.js                 # Electron main process
├── preload.js              # Electron preload script
├── renderer.js             # Electron renderer process
├── index.html              # Main HTML entry point
├── package.json            # Project configuration
│
├── build/                  # Build resources
│   ├── icon.ico           # Application icon
│   ├── installer.nsh      # NSIS installer script
│   └── code-signing.md    # Code signing guide
│
├── scripts/                # Build scripts
│   ├── optimize.js        # Build optimization
│   └── clean-build.js     # Clean build artifacts
│
├── src/
│   ├── components/        # UI Components
│   │   ├── ProductForm.js
│   │   ├── CustomerForm.js
│   │   ├── PurchaseForm.js
│   │   ├── SupplierForm.js
│   │   ├── ExpenseForm.js
│   │   ├── Invoice.js
│   │   ├── ErrorDisplay.js
│   │   └── PerformanceDashboard.js
│   │
│   ├── pages/             # Application pages
│   │   ├── dashboard.js
│   │   ├── products.js
│   │   ├── sales.js
│   │   ├── purchases.js
│   │   ├── customers.js
│   │   ├── suppliers.js
│   │   ├── payments.js
│   │   ├── reports.js
│   │   └── settings.js
│   │
│   ├── database/           # Database layer
│   │   ├── database.js    # Main database module
│   │   ├── db.js          # Simple database API
│   │   ├── db-optimized.js # Optimized database
│   │   ├── db-safe.js     # Safe database wrapper
│   │   ├── models.js      # Data models
│   │   ├── models-optimized.js
│   │   ├── init.js        # Database initialization
│   │   ├── seed.js        # Seed data
│   │   └── schema.sql     # Database schema
│   │
│   ├── utils/              # Utilities
│   │   ├── router.js      # Client-side router
│   │   ├── performance.js # Performance utilities
│   │   ├── error-handler.js # Error handling
│   │   ├── validation.js  # Form validation
│   │   ├── notifications.js
│   │   ├── search.js
│   │   ├── theme.js
│   │   └── ...
│   │
│   ├── assets/             # Assets
│   │   ├── css/           # Stylesheets
│   │   └── images/       # Images
│   │
│   └── examples/           # Example code
│       └── form-validation-example.js
│
└── dist/                   # Build output (generated)
    └── Depo-1.0.0-Setup.exe
```

---

## 🗄️ Database

Depo uses a **pure JavaScript file-based database** with zero external dependencies:

- ✅ **No SQLite** - Pure JavaScript implementation
- ✅ **No Native Compilation** - Works everywhere
- ✅ **JSON Storage** - Easy to backup and debug
- ✅ **SQL-like API** - Familiar query interface
- ✅ **12 Tables** - Products, Suppliers, Purchases, Sales, Customers, Payments, Expenses, Users, Activity Logs, Settings

### Database Location

- **Windows**: `%APPDATA%\Depo\business.db.json`
- **macOS**: `~/Library/Application Support/Depo/business.db.json`
- **Linux**: `~/.config/Depo/business.db.json`

### Database Commands

```bash
# Initialize database
bun run db:init

# Reset database (⚠️ deletes all data)
bun run db:reset

# Seed with sample data
bun run db:seed

# Clear all data
bun run db:clear
```

For detailed database documentation, see [src/database/README.md](src/database/README.md).

---

## 🛠️ Available Scripts

### Development

```bash
bun run dev              # Start development server
```

### Building

```bash
bun run build            # Full production build
bun run dist             # Alias for build
bun run build:win        # Windows-specific build
bun run build:win:dir    # Build directory only (no installer)
bun run build:optimize   # Build with optimization
```

### Optimization

```bash
bun run optimize         # Optimize CSS/JS
bun run clean            # Clean build artifacts
```

### Database

```bash
bun run db:init          # Initialize database
bun run db:reset         # Reset database
bun run db:seed          # Seed sample data
bun run db:clear         # Clear all data
```

### Maintenance

```bash
bun run rebuild          # Rebuild native dependencies
```

---

## 🎨 Features in Detail

### Performance Optimizations

- **Lazy Loading**: Pages load only when navigated to
- **Debounced Search**: 300ms delay for efficient searching
- **Virtual Scrolling**: Handles thousands of items smoothly
- **Image Optimization**: Lazy loading and compression
- **Response Caching**: LRU cache for API responses
- **Batch DOM Updates**: Reduces reflows and repaints
- **Code Splitting**: Smaller initial bundle size

See [PERFORMANCE.md](PERFORMANCE.md) for details.

### Error Handling

- **Try-Catch Blocks**: All database operations protected
- **Form Validation**: Required fields, format validation, min/max values
- **User-Friendly Messages**: Clear, actionable error messages
- **Error Logging**: Automatic file logging with rotation
- **Edge Cases**: Handles null, undefined, divide by zero, empty datasets
- **Input Sanitization**: SQL injection and XSS prevention

See [ERROR-HANDLING.md](ERROR-HANDLING.md) for details.

### Responsive Design

- **Mobile-First**: Optimized for all screen sizes
- **Breakpoints**: 640px, 768px, 1024px, 1280px
- **Touch-Friendly**: Minimum 44px button height
- **Responsive Tables**: Horizontal scroll or card view on mobile
- **Responsive Modals**: Full screen on mobile

---

## 🔐 Security

- **Input Sanitization**: All user inputs sanitized
- **SQL Injection Prevention**: Parameterized queries and input validation
- **XSS Protection**: HTML entity encoding
- **Secure Storage**: Database stored in user's AppData folder
- **Error Logging**: Secure error logging without exposing sensitive data

---

## 📊 System Requirements

### Development

- **OS**: Windows 10/11, macOS, or Linux
- **Runtime**: Bun 1.0+
- **Node.js**: v18+ (for Electron Builder)

### Production

- **OS**: Windows 10/11 (x64)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 200MB for application + database
- **Display**: 1280x720 minimum resolution

---

## 🧪 Testing

### Development Testing

1. Run in development mode: `bun run dev`
2. Test all features
3. Check console for errors
4. Verify database operations

### Production Testing

1. Build installer: `bun run build`
2. Install on development machine
3. Test all features
4. Test on clean Windows machine
5. Verify shortcuts and uninstaller

---

## 🐛 Troubleshooting

### Common Issues

**Build fails**
- Check Node.js version: `node --version` (should be v18+)
- Clear cache: `bun run clean && rm -rf node_modules && bun install`

**Icon not found**
- Ensure `build/icon.ico` exists
- Copy icon: `copy Gemini_Generated_Image_ue4gmpue4gmpue4g.ico build\icon.ico`

**Database errors**
- Check database file permissions
- Verify database is initialized: `bun run db:init`
- Check error logs: `%APPDATA%\Depo\logs\`

**Performance issues**
- Enable performance monitoring: `localStorage.setItem('enablePerfMonitor', 'true')`
- Open performance dashboard: Press `Ctrl+Shift+P`
- Check [PERFORMANCE.md](PERFORMANCE.md) for optimization tips

For more troubleshooting, see individual documentation files.

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

- **Email**: support@depo.app
- **Issues**: [GitHub Issues](https://github.com/depo/depo-app/issues)
- **Documentation**: See [Documentation](#-documentation) section

---

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Cloud sync (optional)
- [ ] Mobile app companion
- [ ] Advanced reporting
- [ ] Barcode scanner integration
- [ ] Receipt printer support
- [ ] Multi-currency support
- [ ] Tax calculation
- [ ] Inventory alerts
- [ ] Backup/restore functionality

---

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- Runtime: [Bun](https://bun.sh/)
- Icons: [Lucide](https://lucide.dev/)
- Build tool: [Electron Builder](https://www.electron.build/)

---

<div align="center">

**Made with ❤️ by the Depo Team**

[⬆ Back to Top](#depo---business-management-system)

</div>
