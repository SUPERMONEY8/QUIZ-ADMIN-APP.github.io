# École de Formation - School Management System

## Data Model Overview

This repository contains the comprehensive data model for the "École de Formation" school management system. The system is designed to manage schools, users, students, classes, courses, grades, attendance, and features.

## Files

- **`schema.sql`** - Complete SQL schema with CREATE TABLE statements, foreign keys, indexes, and constraints
- **`schema_diagram.md`** - Detailed documentation of all entities, relationships, and data model structure

## Quick Start

To create the database schema, run:

```sql
source schema.sql
```

Or execute the SQL file in your database management tool.

## Entity Overview

### Core Entities

1. **School** - Represents educational institutions
2. **User** - Base user accounts (admin, teacher, student, staff)
3. **Student** - Student-specific information linked to User
4. **Class** - Classroom groups with teachers and students
5. **Course** - Individual subjects/courses taught in classes
6. **Grade** - Academic performance records
7. **Attendance** - Daily attendance tracking
8. **Feature** - Feature flags and system capabilities per school

## Key Features

- ✅ Complete referential integrity with foreign keys
- ✅ Proper indexing for query performance
- ✅ Unique constraints to prevent duplicates
- ✅ Support for soft deletes (status fields)
- ✅ Flexible role-based access (admin, teacher, student, staff)
- ✅ Multi-school support
- ✅ Feature flag system for school-specific capabilities

## Database Requirements

- MySQL 5.7+ or MariaDB 10.2+
- Supports ENUM types
- Supports AUTO_INCREMENT
- Supports DEFAULT CURRENT_TIMESTAMP

## Relationship Diagram

```
School (1) ──────< (N) User ────> (1:1) Student
  │                  │                    │
  │                  │                    │
  │ (1) ──────< (N)  │                    │
  │                  │                    │
  └───> Class <──────┘                    │
          │                                │
          │ (1) ──────< (N)                │
          │                                │
          └───> Course ────> Grade <───────┘
                            │
                            │
                    Attendance ──────< (N) Student
                            │
                            │
                    Attendance ──────< (N) Class

School (1) ──────< (N) Feature
```

## Usage Examples

### Create a School
```sql
INSERT INTO School (name, location, created_date) 
VALUES ('École de Formation Paris', 'Paris, France', NOW());
```

### Create an Admin User
```sql
INSERT INTO User (email, password_hash, first_name, last_name, role, school_id, created_date)
VALUES ('admin@ecole.fr', 'hashed_password', 'Jean', 'Dupont', 'admin', 1, NOW());
```

### Create a Student
```sql
INSERT INTO User (email, password_hash, first_name, last_name, role, school_id, created_date)
VALUES ('student@ecole.fr', 'hashed_password', 'Marie', 'Martin', 'student', 1, NOW());

INSERT INTO Student (user_id, student_number, enrollment_date, class_id, status)
VALUES (LAST_INSERT_ID(), 'STU-2024-001', '2024-09-01', 1, 'active');
```

## License

This data model is provided for educational purposes.

