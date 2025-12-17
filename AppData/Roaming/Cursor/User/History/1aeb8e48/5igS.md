# Entity Framework Core Migration Instructions

## Initial Setup

### 1. Install EF Core Tools (if not already installed)

```powershell
dotnet tool install --global dotnet-ef
```

Or update if already installed:
```powershell
dotnet tool update --global dotnet-ef
```

### 2. Create Initial Migration

Navigate to your project directory and run:

```powershell
dotnet ef migrations add InitialCreate
```

This will create a `Migrations` folder with the initial migration files.

### 3. Apply Migration to Database

```powershell
dotnet ef database update
```

This will create the `SupplyChain.db` SQLite database file with all tables, indexes, and relationships.

## Creating New Migrations

When you make changes to your models:

1. **Create a new migration:**
   ```powershell
   dotnet ef migrations add MigrationName
   ```
   Example: `dotnet ef migrations add AddExpenseTable`

2. **Apply the migration:**
   ```powershell
   dotnet ef database update
   ```

## Rolling Back Migrations

To rollback to a previous migration:

```powershell
dotnet ef database update PreviousMigrationName
```

To remove the last migration (before applying):

```powershell
dotnet ef migrations remove
```

## Viewing Migration SQL

To see the SQL that will be generated:

```powershell
dotnet ef migrations script
```

To see SQL for a specific migration:

```powershell
dotnet ef migrations script FromMigration ToMigration
```

## Database Connection String

The connection string is currently set in `ApplicationDbContext.OnConfiguring()`:

```csharp
optionsBuilder.UseSqlite("Data Source=SupplyChain.db");
```

To change the database location, modify this connection string.

## Important Notes

- The database file `SupplyChain.db` will be created in the same directory as your executable
- All migrations are stored in the `Migrations` folder
- Always create migrations before making model changes in production
- Test migrations on a development database first

## Troubleshooting

### Error: "No DbContext was found"

Make sure your `ApplicationDbContext` has a parameterless constructor or implements `IDesignTimeDbContextFactory`.

### Error: "Migration already exists"

Remove the existing migration first:
```powershell
dotnet ef migrations remove
```

Then create a new one.

### Error: "Database is locked"

Close any connections to the database file and try again.

