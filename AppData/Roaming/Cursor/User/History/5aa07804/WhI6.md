# Grade Tracking Module - Guide

## Overview

Complete Grade Tracking module with role-based views:
- **Teacher View**: Input grades for students
- **Student View**: View own grades and GPA

## Features

### ✅ Implemented Features

1. **Teacher View**
   - Select course dropdown
   - Table with all students in course
   - Grade input (0-100) for each student
   - Date field for grade entry
   - Notes field for each student
   - Save all grades at once
   - Search students
   - Sort by name, grade, or date

2. **Student View**
   - List of all courses with grades
   - Grade display with letter (A-F)
   - Date grades were entered
   - Teacher notes (if any)
   - GPA calculation (weighted by credits)
   - Search by course
   - Sort by course, grade, or date

3. **Role-Based Access**
   - Teachers can input grades
   - Students can only view their own grades
   - Automatic view switching based on role

4. **Data Persistence**
   - localStorage for demo
   - Timestamps for all grades
   - Links to students and courses

## Component Structure

```
Grades Page
├── DashboardLayout (wrapper)
├── Header Section
│   ├── Title & Icon
│   └── Role-based description
├── TeacherGradeView (if teacher)
│   ├── Course Selection
│   ├── Date Picker
│   ├── Search & Sort
│   ├── Grades Table
│   └── Save Button
└── StudentGradeView (if student)
    ├── GPA Card
    ├── Search & Sort
    ├── Grades Grid
    └── Grades Table (desktop)
```

## Grade Data Structure

```javascript
{
  id: 1,
  student_id: 1,
  course_id: 1,
  score: 85.5,
  date_recorded: "2024-01-15T00:00:00.000Z",
  notes: "Good work, keep it up!",
  created_date: "2024-01-15T10:30:00.000Z"
}
```

## Teacher View Features

### Course Selection
- Dropdown shows all courses
- Format: "Course Name (Code) - Class"
- Auto-loads students when course selected

### Grade Input
- Number input (0-100)
- Supports decimals
- Real-time validation
- Shows existing grade if already entered for date

### Date Field
- Defaults to today
- Allows selecting past dates
- Filters grades by date

### Notes Field
- Optional text input
- Per-student notes
- Saved with grade

### Save Functionality
- Validates all grades (0-100 range)
- Saves all grades at once
- Updates existing grades for same date
- Creates new grades if not exists

## Student View Features

### GPA Calculation
- Weighted average by credits
- Formula: Σ(score × credits) / Σ(credits)
- Displayed prominently
- Updates automatically

### Grade Display
- Score (0-100)
- Letter grade (A, B, C, D, F)
- Color-coded:
  - A (90+): Green
  - B (80-89): Blue
  - C (70-79): Yellow
  - D (60-69): Orange
  - F (<60): Red

### Course Information
- Course name and code
- Credits
- Date grade entered
- Teacher notes

### Search & Sort
- Search by course name or code
- Sort by course, grade, or date
- Ascending/descending toggle

## Role-Based Access

### Teacher Access
- Can input grades
- Can edit existing grades
- Can view all students in course
- Can add notes

### Student Access
- Can only view own grades
- Cannot modify grades
- Can see GPA
- Can see all course grades

### Admin Access
- Same as teacher
- Can view all students

## Usage

### For Teachers

1. **Navigate to Grades**
   - Click "Grades" in sidebar
   - Or go to `/grades`

2. **Select Course**
   - Choose course from dropdown
   - Students for that course appear

3. **Input Grades**
   - Enter grade (0-100) for each student
   - Select date (defaults to today)
   - Add optional notes

4. **Save Grades**
   - Click "Save All Grades"
   - All grades saved at once
   - Success message shown

### For Students

1. **Navigate to Grades**
   - Click "Grades" in sidebar
   - Or go to `/grades`

2. **View Grades**
   - See GPA at top
   - View all courses with grades
   - See date and notes

3. **Search/Sort**
   - Search by course name
   - Sort by different criteria
   - Toggle sort order

## Grade Calculation

### GPA Formula
```
GPA = Σ(score × credits) / Σ(credits)
```

Example:
- Math: 90 (3 credits) = 270 points
- French: 85 (3 credits) = 255 points
- Physics: 80 (4 credits) = 320 points
- Total: 845 points / 10 credits = 84.5 GPA

### Letter Grades
- A: 90-100
- B: 80-89
- C: 70-79
- D: 60-69
- F: 0-59

## Data Storage

Grades stored in `localStorage` with key `grades`:
```javascript
[
  {
    id: 1,
    student_id: 1,
    course_id: 1,
    score: 85.5,
    date_recorded: "2024-01-15T00:00:00.000Z",
    notes: "Good work!",
    created_date: "2024-01-15T10:30:00.000Z"
  }
]
```

## Validation

### Teacher View
- Grade must be between 0 and 100
- Grade can be decimal (e.g., 85.5)
- Date must be selected
- Course must be selected

### Student View
- No validation needed (read-only)

## Responsive Design

- **Desktop**: Full table view
- **Tablet**: Card grid
- **Mobile**: Card grid (1 column)

## Design Features

- Yellow/orange accent colors
- Color-coded grades
- GPA highlight card
- Smooth transitions
- Modern table design
- Clear visual hierarchy

## Integration

- Route added: `/grades`
- Protected route (requires login)
- Role-based view switching
- Integrated with DashboardLayout
- Links to students and courses
- Navigation updates based on enabled features

## Next Steps

1. Connect to backend API
2. Add grade history/charts
3. Add grade trends over time
4. Add grade distribution
5. Add bulk grade import
6. Add grade export
7. Add grade notifications
8. Add grade categories (homework, tests, projects)

---

**The Grade Tracking module is fully functional!** 🎉

