# CSV Import Templates

This document provides CSV templates for importing data into École de Formation.

## Students Template

**File:** `students_template.csv`

```csv
first_name,last_name,email,student_number,class,status
Marie,Martin,marie.martin@ecole.fr,STU-2024-001,Grade 10A,active
Jean,Dupont,jean.dupont@ecole.fr,STU-2024-002,Grade 10B,active
Sophie,Bernard,sophie.bernard@ecole.fr,STU-2024-003,Grade 11A,active
```

### Required Fields:
- `first_name` - Student's first name
- `last_name` - Student's last name
- `email` - Valid email address (must be unique)
- `student_number` - Unique student identifier
- `class` - Class name (e.g., "Grade 10A")
- `status` - Optional: "active", "inactive", "graduated", "transferred" (default: "active")

### Validation Rules:
- Email must be valid format
- Student number must be unique
- Class must not be empty
- First and last names are required

## Grades Template

**File:** `grades_template.csv`

```csv
student_id,course_id,score,date_recorded,notes
1,1,85.5,2024-01-15,Excellent work!
2,1,78.0,2024-01-15,Good effort
1,2,92.0,2024-01-16,Well done!
```

### Required Fields:
- `student_id` - Student ID (or use `student_number` or `email` as alternative)
- `course_id` - Course ID (or use `course_code` or `course_name` as alternative)
- `score` - Numeric score between 0 and 100

### Optional Fields:
- `date_recorded` - Date in YYYY-MM-DD format (defaults to today)
- `notes` - Teacher notes about the grade

### Alternative Identifiers:
You can use any of these combinations:
- `student_id` + `course_id`
- `student_number` + `course_code`
- `email` + `course_name`

### Validation Rules:
- Score must be between 0 and 100
- Student must exist in system
- Course must exist in system

## Courses Template

**File:** `courses_template.csv`

```csv
course_name,course_code,class,teacher_name,credits,description
Mathematics,MATH-101,Grade 10A,Dr. Jean Lefebvre,3.0,Introduction to algebra and geometry
French Literature,FREN-201,Grade 11A,Mme. Marie Dubois,3.0,Study of French literature and poetry
Physics,PHYS-301,Grade 12A,Dr. Jean Lefebvre,4.0,Advanced physics and mechanics
```

### Required Fields:
- `course_name` - Full course name
- `course_code` - Unique course code (e.g., "MATH-101")
- `class` - Class name (e.g., "Grade 10A")

### Optional Fields:
- `teacher_name` - Teacher's full name (will be matched to existing teachers)
- `teacher_email` - Teacher's email (alternative to teacher_name)
- `teacher_id` - Teacher ID (if known)
- `credits` - Number of credits (default: 3.0)
- `description` - Course description

### Validation Rules:
- Course code must be unique
- Class must not be empty
- Course name is required

## Import Process

1. **Download Template**: Click "Download Template" button in Import modal
2. **Fill Data**: Add your data following the template format
3. **Save as CSV**: Save file with `.csv` extension
4. **Upload**: Click "Import" button and select your CSV file
5. **Review**: Check preview and validation errors
6. **Import**: Click "Import" button to complete

## Tips

### CSV Format Guidelines:
- Use commas (`,`) to separate fields
- Use quotes (`"`) around fields containing commas or quotes
- Use newlines (`\n`) to separate rows
- First row should contain headers
- No empty rows between data

### Common Issues:

1. **Encoding Problems**: Save CSV as UTF-8 encoding
2. **Date Format**: Use YYYY-MM-DD format for dates
3. **Special Characters**: Wrap fields containing commas in quotes
4. **Empty Fields**: Leave empty or use empty string `""`

### Example with Special Characters:

```csv
first_name,last_name,email,student_number,class,status
"John, Jr.",O'Brien,john.obrien@ecole.fr,STU-2024-006,Grade 10A,active
```

### Duplicate Detection:

The system automatically detects duplicates based on:
- **Students**: `student_number` or `email`
- **Courses**: `course_code`
- **Grades**: Combination of `student_id`, `course_id`, and `date_recorded`

Duplicates will be skipped during import.

## Export Formats

### CSV Export:
- All data exported as CSV files
- Includes all columns
- Ready for Excel/Google Sheets
- Can be re-imported after editing

### JSON Backup:
- Complete backup of all data
- Includes all features and settings
- Can be restored using import function
- Preserves data structure

## Validation

Before import, the system validates:
- ✅ Required fields are present
- ✅ Data types are correct
- ✅ Email formats are valid
- ✅ Numeric values are in range
- ✅ Duplicates are detected
- ✅ References (students, courses) exist

Errors are displayed with row numbers for easy fixing.

