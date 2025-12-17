# Database Schema Documentation

## Overview
SQLite database schema for the Military Assignment Management System using better-sqlite3 with Bun.

## Database File
- **Location**: `src/database/app.db`
- **Schema File**: `src/database/schema.sql`
- **Engine**: SQLite 3 (via better-sqlite3)

## Tables

### 1. members (الأعضاء)
Stores all military members information.

**Columns:**
- `id` - Primary key (auto-increment)
- `name` - Member name (Arabic)
- `rank` - Military rank (الرتبة)
- `group_type` - Group type: DCC, SANTE, COOK, DRIVE, OFFICIER, SOUS_OFFICIER, HDT
- `campaign` - Campaign: C1, C2, C3 (for Sous-Officiers and HDT)
- `pool` - Pool: Pool1, Pool2, Pool3 (for HDT)
- `is_active` - Active status (1 = active, 0 = inactive)
- `created_at` - Creation timestamp

**Indexes:**
- `idx_members_group_type` - On group_type
- `idx_members_is_active` - On is_active
- `idx_members_campaign_pool` - On campaign, pool
- `idx_members_group_active` - On group_type, is_active

### 2. assignments (التعيينات)
Stores monthly assignments for members.

**Columns:**
- `id` - Primary key (auto-increment)
- `member_id` - Foreign key to members(id)
- `year` - Year (2000-2100)
- `month` - Month (1-12)
- `assignment_type` - Assignment type (X marker or other)
- `assigned_by_system` - System that assigned: DCC, SANTE, COOK, DRIVE, OFFICIER, SOUS_OFFICIER, HDT
- `created_at` - Creation timestamp

**Constraints:**
- UNIQUE(member_id, year, month) - One assignment per member per month
- Foreign key to members with CASCADE delete

**Indexes:**
- `idx_assignments_member_id` - On member_id
- `idx_assignments_year_month` - On year, month
- `idx_assignments_system` - On assigned_by_system
- `idx_assignments_year_month_system` - On year, month, assigned_by_system
- `idx_assignments_type` - On assignment_type

### 3. rotation_tracking (تتبع الدوران)
Tracks rotation indices for each group type.

**Columns:**
- `id` - Primary key (auto-increment)
- `group_type` - Group type
- `campaign` - Campaign (C1, C2, C3)
- `pool` - Pool (Pool1, Pool2, Pool3)
- `last_index` - Last used rotation index
- `year` - Year
- `updated_at` - Last update timestamp

**Constraints:**
- UNIQUE(group_type, campaign, pool, year)

**Indexes:**
- `idx_rotation_unique` - Unique on group_type, campaign, pool, year
- `idx_rotation_group_type` - On group_type
- `idx_rotation_year` - On year

### 4. settings (الإعدادات)
Application settings and configuration.

**Columns:**
- `id` - Primary key (auto-increment)
- `key` - Setting key (unique)
- `value` - Setting value
- `description_ar` - Arabic description

**Default Settings:**
- `current_year` - Current year
- `current_month` - Current month
- `app_name` - Application name
- `app_version` - Application version
- `auto_assign_enabled` - Auto-assignment enabled
- `rotation_enabled` - Rotation system enabled
- `backup_enabled` - Auto-backup enabled
- `backup_interval_days` - Backup interval in days

### 5. yearly_exclusions (الاستثناءات السنوية)
Stores members excluded from assignments for specific years.

**Columns:**
- `id` - Primary key (auto-increment)
- `member_id` - Foreign key to members(id)
- `year` - Year (2000-2100)
- `reason` - Reason for exclusion
- `created_at` - Creation timestamp

**Constraints:**
- UNIQUE(member_id, year) - One exclusion per member per year
- Foreign key to members with CASCADE delete

**Indexes:**
- `idx_exclusions_member_id` - On member_id
- `idx_exclusions_year` - On year
- `idx_exclusions_member_year` - On member_id, year

## Group Types

- **DCC** - Default group
- **SANTE** - Health/Medical group
- **COOK** - Cooking/Catering group
- **DRIVE** - Driving/Transport group
- **OFFICIER** - Officers group
- **SOUS_OFFICIER** - Non-commissioned officers (with campaigns C1, C2, C3)
- **HDT** - HDT group (with campaigns and pools)

## Usage

### Initialize Database
The database is automatically initialized when the app starts. The `initializeDatabase()` function in `main.js` reads and executes `schema.sql`.

### Manual Schema Execution
To manually execute the schema:
```bash
sqlite3 src/database/app.db < src/database/schema.sql
```

### Using with better-sqlite3
```javascript
const Database = require('better-sqlite3');
const db = new Database('src/database/app.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Query example
const members = db.prepare('SELECT * FROM members WHERE group_type = ? AND is_active = 1').all('DCC');
```

## Performance Notes

- All frequently queried columns have indexes
- Foreign keys are enabled for data integrity
- UNIQUE constraints prevent duplicate data
- CHECK constraints ensure data validity

## Backup

The database file (`app.db`) should be backed up regularly. The app includes auto-backup functionality (configurable in settings table).

