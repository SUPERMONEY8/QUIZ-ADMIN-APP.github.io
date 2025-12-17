# École de Formation - Data Model Schema

## Entity Relationship Diagram (Text Format)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           RELATIONSHIP DIAGRAM                           │
└─────────────────────────────────────────────────────────────────────────┘

School (1) ──────< (N) User
  │                   │
  │                   │ (1:1)
  │                   └───> Student
  │                           │
  │ (1) ──────< (N)          │
  │                           │
  └───> Class <───────────────┘
          │                    │
          │                    │
          │ (1) ──────< (N)    │
          │                    │
          └───> Course <───────┘
                  │
                  │ (1) ──────< (N)
                  │
                  └───> Grade
                          │
                          │
                  Attendance ──────< (N) Student
                          │
                          │
                  Attendance ──────< (N) Class

School (1) ──────< (N) Feature
```

## Entity Details

### 1. School
- **Primary Key:** `id`
- **Foreign Keys:** 
  - `admin_id` → User(id) [One-to-One/One-to-Many]
- **Properties:**
  - id (INT, PK, AUTO_INCREMENT)
  - name (VARCHAR(255), NOT NULL)
  - location (VARCHAR(255), NOT NULL)
  - admin_id (INT, FK → User.id, NULLABLE)
  - created_date (DATETIME, NOT NULL, DEFAULT CURRENT_TIMESTAMP)

### 2. User
- **Primary Key:** `id`
- **Foreign Keys:**
  - `school_id` → School(id) [Many-to-One]
- **Properties:**
  - id (INT, PK, AUTO_INCREMENT)
  - email (VARCHAR(255), NOT NULL, UNIQUE)
  - password_hash (VARCHAR(255), NOT NULL)
  - first_name (VARCHAR(100), NOT NULL)
  - last_name (VARCHAR(100), NOT NULL)
  - role (ENUM: 'admin', 'teacher', 'student', 'staff', NOT NULL)
  - school_id (INT, FK → School.id, NULLABLE)
  - created_date (DATETIME, NOT NULL, DEFAULT CURRENT_TIMESTAMP)

### 3. Student
- **Primary Key:** `id`
- **Foreign Keys:**
  - `user_id` → User(id) [One-to-One]
  - `class_id` → Class(id) [Many-to-One]
- **Properties:**
  - id (INT, PK, AUTO_INCREMENT)
  - user_id (INT, FK → User.id, NOT NULL, UNIQUE)
  - student_number (VARCHAR(50), NOT NULL, UNIQUE)
  - enrollment_date (DATE, NOT NULL)
  - class_id (INT, FK → Class.id, NULLABLE)
  - status (ENUM: 'active', 'inactive', 'graduated', 'transferred', NOT NULL, DEFAULT 'active')

### 4. Class
- **Primary Key:** `id`
- **Foreign Keys:**
  - `teacher_id` → User(id) [Many-to-One]
  - `school_id` → School(id) [Many-to-One]
- **Properties:**
  - id (INT, PK, AUTO_INCREMENT)
  - name (VARCHAR(100), NOT NULL)
  - grade_level (VARCHAR(50), NOT NULL)
  - teacher_id (INT, FK → User.id, NULLABLE)
  - school_id (INT, FK → School.id, NOT NULL)
  - max_capacity (INT, NOT NULL, DEFAULT 30)
  - created_date (DATETIME, NOT NULL, DEFAULT CURRENT_TIMESTAMP)

### 5. Course
- **Primary Key:** `id`
- **Foreign Keys:**
  - `teacher_id` → User(id) [Many-to-One]
  - `class_id` → Class(id) [Many-to-One]
- **Properties:**
  - id (INT, PK, AUTO_INCREMENT)
  - name (VARCHAR(255), NOT NULL)
  - course_code (VARCHAR(50), NOT NULL, UNIQUE)
  - teacher_id (INT, FK → User.id, NULLABLE)
  - class_id (INT, FK → Class.id, NULLABLE)
  - credits (DECIMAL(3,1), NOT NULL, DEFAULT 0.0)
  - description (TEXT)

### 6. Grade
- **Primary Key:** `id`
- **Foreign Keys:**
  - `student_id` → Student(id) [Many-to-One]
  - `course_id` → Course(id) [Many-to-One]
- **Properties:**
  - id (INT, PK, AUTO_INCREMENT)
  - student_id (INT, FK → Student.id, NOT NULL)
  - course_id (INT, FK → Course.id, NOT NULL)
  - score (DECIMAL(5,2), NOT NULL)
  - date_recorded (DATETIME, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
  - notes (TEXT)
- **Unique Constraint:** (student_id, course_id, date_recorded)

### 7. Attendance
- **Primary Key:** `id`
- **Foreign Keys:**
  - `student_id` → Student(id) [Many-to-One]
  - `class_id` → Class(id) [Many-to-One]
- **Properties:**
  - id (INT, PK, AUTO_INCREMENT)
  - student_id (INT, FK → Student.id, NOT NULL)
  - class_id (INT, FK → Class.id, NOT NULL)
  - date (DATE, NOT NULL)
  - status (ENUM: 'present', 'absent', 'late', 'excused', NOT NULL, DEFAULT 'present')
  - notes (TEXT)
- **Unique Constraint:** (student_id, class_id, date)

### 8. Feature
- **Primary Key:** `id`
- **Foreign Keys:**
  - `school_id` → School(id) [Many-to-One]
- **Properties:**
  - id (INT, PK, AUTO_INCREMENT)
  - name (VARCHAR(255), NOT NULL)
  - key (VARCHAR(100), NOT NULL, UNIQUE)
  - description (TEXT)
  - icon (VARCHAR(100))
  - enabled (BOOLEAN, NOT NULL, DEFAULT TRUE)
  - school_id (INT, FK → School.id, NULLABLE)
  - dependencies (TEXT) - Stores feature dependencies (JSON or comma-separated)

## Relationship Summary

### One-to-Many Relationships
1. **School → User** (1:N)
   - One school has many users
   - Foreign Key: `User.school_id`

2. **School → Class** (1:N)
   - One school has many classes
   - Foreign Key: `Class.school_id`

3. **School → Feature** (1:N)
   - One school has many features
   - Foreign Key: `Feature.school_id`

4. **User → Class** (1:N)
   - One teacher can teach many classes
   - Foreign Key: `Class.teacher_id`

5. **User → Course** (1:N)
   - One teacher can teach many courses
   - Foreign Key: `Course.teacher_id`

6. **Class → Student** (1:N)
   - One class has many students
   - Foreign Key: `Student.class_id`

7. **Class → Course** (1:N)
   - One class has many courses
   - Foreign Key: `Course.class_id`

8. **Student → Grade** (1:N)
   - One student has many grades
   - Foreign Key: `Grade.student_id`

9. **Student → Attendance** (1:N)
   - One student has many attendance records
   - Foreign Key: `Attendance.student_id`

10. **Course → Grade** (1:N)
    - One course has many grades
    - Foreign Key: `Grade.course_id`

11. **Class → Attendance** (1:N)
    - One class has many attendance records
    - Foreign Key: `Attendance.class_id`

### One-to-One Relationships
1. **User → Student** (1:1)
   - One user account corresponds to one student record
   - Foreign Key: `Student.user_id` (with UNIQUE constraint)

### Many-to-Many Relationships (Implicit)
1. **Student ↔ Course** (M:N)
   - Students enroll in multiple courses
   - Courses have multiple students
   - Junction Table: `Grade`

2. **Student ↔ Class** (M:N)
   - Students belong to classes
   - Classes have multiple students
   - Direct relationship via `Student.class_id`, also tracked through `Attendance`

## Notes

- The `School.admin_id` creates a circular reference with `User.school_id`. This is handled by allowing `admin_id` to be NULL initially, or by ensuring the admin user is created first.
- All foreign keys have appropriate CASCADE or SET NULL behaviors for data integrity.
- Unique constraints prevent duplicate student-course grades on the same date and duplicate attendance records for the same student-class-date combination.
- Indexes are created on frequently queried fields for performance optimization.

