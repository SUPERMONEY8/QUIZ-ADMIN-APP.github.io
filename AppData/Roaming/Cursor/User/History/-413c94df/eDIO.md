# Database Migration and Seeding Guide

## Overview

This guide explains how to create and apply database migrations, and how the automatic seeding works.

## Automatic Migration on Startup

The application automatically applies migrations and seeds initial data when it starts:

1. **Migrations**: Applied using `context.Database.Migrate()`
2. **Seeding**: Initial data is populated using `DatabaseSeeder`

## Manual Migration Commands

### Create Initial Migration

```powershell
# Navigate to project directory
cd "C:\Users\LENOVO\Desktop\Dépo"

# Create migration
dotnet ef migrations add InitialCreate

# Apply migration
dotnet ef database update
```

### Create Additional Migrations

```powershell
# After making model changes
dotnet ef migrations add MigrationName

# Apply migration
dotnet ef database update
```

## Seeded Data

The `DatabaseSeeder` class automatically populates:

### Users (2)
- **Admin User**
  - Username: `admin`
  - Password: `admin123`
  - Role: Admin
  
- **Cashier User**
  - Username: `cashier`
  - Password: `cashier123`
  - Role: Cashier

### Suppliers (5 Algerian Companies)
1. شركة كوكا كولا الجزائر
2. مؤسسة زيوت الجزائر
3. شركة مياه حياة
4. مؤسسة الشوفان والمواد الغذائية
5. شركة المشروبات الغازية الوطنية

### Products (20 Items)
- **Oils**: زيت عباد الشمس، زيت الزيتون، زيت الذرة
- **Water**: مياه حياة (1.5L, 500ML, 2L)
- **Soda**: كوكا كولا، بيبسي، سفن أب
- **Cereals**: شوفان، قمح، أرز
- **Other**: سكر، ملح، معكرونة، شاي، قهوة، حليب

All products have:
- Realistic DZD prices (BuyingPrice and SellingPrice)
- Initial stock quantities
- Minimum stock levels
- Assigned suppliers

### Customers (10)
10 sample customers with Algerian names and addresses

### Purchases (10)
10 sample purchase transactions from suppliers with:
- Random dates (last 60 days)
- Multiple items per purchase
- Mix of "Received" and "Pending" status
- Payment status tracking

### Sales (10)
10 sample sales transactions with:
- Random dates (last 30 days)
- Multiple items per sale
- Mix of cash and credit sales
- Completed status

## Database Configuration

Database settings are centralized in `Data/Configuration/DatabaseConfig.cs`:

- **Database Path**: `SupplyChain.db` in application directory
- **Backup Directory**: `Backups` folder in application directory
- **Connection String**: Automatically generated

## Password Hashing

Passwords are hashed using SHA256 algorithm (same as in `UserService`):

```csharp
private string HashPassword(string password)
{
    using var sha256 = SHA256.Create();
    var bytes = Encoding.UTF8.GetBytes(password);
    var hash = sha256.ComputeHash(bytes);
    return Convert.ToBase64String(hash);
}
```

## Seeding Behavior

The seeder is **idempotent** - it checks if data exists before seeding:
- If users exist → Skip user seeding
- If suppliers exist → Skip supplier seeding
- If products exist → Skip product seeding
- etc.

This means:
- ✅ Safe to run multiple times
- ✅ Won't create duplicates
- ✅ Can be called on every app startup

## Manual Seeding

To manually seed the database:

```csharp
using var scope = App.ServiceProvider.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
var logger = scope.ServiceProvider.GetService<ILogger<DatabaseSeeder>>();

var seeder = new DatabaseSeeder(context, logger);
await seeder.SeedAsync();
```

## Troubleshooting

### Migration Fails
- Ensure `dotnet ef` tools are installed: `dotnet tool install --global dotnet-ef`
- Check database file permissions
- Delete `SupplyChain.db` and let it recreate

### Seeding Fails
- Check database connection
- Verify all required tables exist
- Check logs for specific errors

### Duplicate Data
- The seeder checks for existing data
- If duplicates appear, manually delete and re-seed
- Or delete the database file and restart the app

## Backup Location

Backups are stored in: `[AppDirectory]/Backups/`

Backup files are named: `SupplyChain_Backup_YYYYMMDD_HHMMSS.db`

## Next Steps

1. Run the application - migrations and seeding happen automatically
2. Login with: `admin` / `admin123`
3. Explore the seeded data in the application
4. Create additional migrations as needed when models change

