# Attendance Module - Guide

## Overview

Complete Attendance module with role-based views:
- **Teacher View**: Mark attendance for students
- **Admin View**: View attendance reports and statistics

## Features

### ✅ Implemented Features

1. **Teacher View**
   - Select class dropdown
   - Select date picker
   - List of all students in selected class
   - Radio buttons: Present / Absent / Late
   - Optional notes field for each student
   - Mark All Present / Mark All Absent buttons
   - Submit to save attendance

2. **Admin View**
   - View mode toggle: By Student / By Class / Calendar
   - Attendance reports by student
   - Attendance percentage for each student
   - Highlight students with high absence rates (<80%)
   - Class statistics
   - Calendar view for specific dates

3. **Data Storage**
   - localStorage for demo
   - Stores: student_id, class, date, status, notes
   - Sample data initialization

## Component Structure

```
Attendance Page
├── DashboardLayout (wrapper)
├── Header Section
│   ├── Title & Icon
│   └── Role-based description
├── TeacherAttendanceView (if teacher)
│   ├── Class & Date Selection
│   ├── Bulk Actions
│   ├── Attendance Table
│   └── Submit Button
└── AdminAttendanceView (if admin)
    ├── View Mode Tabs
    ├── Search & Filter
    ├── Student Report Table
    ├── Class Statistics Cards
    └── Calendar View
```

## Attendance Data Structure

```javascript
{
  id: 1,
  student_id: 1,
  class: "Grade 10A",
  date: "2024-01-15",
  status: "present", // "present" | "absent" | "late"
  notes: "Optional notes",
  created_date: "2024-01-15T10:30:00.000Z"
}
```

## Teacher View Features

### Class Selection
- Dropdown shows all classes with students
- Auto-loads students when class selected
- Resets attendance state on change

### Date Selection
- Date picker (defaults to today)
- Allows selecting past dates
- Loads existing attendance for selected date
- Updates when date changes

### Attendance Status
- **Present**: Green, checked by default
- **Absent**: Red
- **Late**: Yellow
- Radio buttons for each student
- Visual feedback on selection

### Notes Field
- Optional text input per student
- Saved with attendance record
- Useful for excused absences, reasons, etc.

### Bulk Actions
- **Mark All Present**: Sets all students to present
- **Mark All Absent**: Sets all students to absent
- Quick actions for common scenarios

### Submit
- Saves all attendance at once
- Updates existing records for same date
- Creates new records if needed
- Success confirmation

## Admin View Features

### View Modes

#### By Student
- Table showing all students
- Attendance percentage
- Present/Absent/Late counts
- Total records
- Highlights students with <80% attendance
- Search and filter by class

#### By Class
- Card grid showing class statistics
- Average attendance percentage
- Total days tracked
- Number of students
- Visual indicators (green/yellow/red)

#### Calendar
- Date picker to select date
- Table showing all attendance for that date
- Student name, class, status, notes
- Quick overview of daily attendance

### Attendance Percentage
Calculated as: `(Present Count / Total Records) × 100`

### High Absence Highlighting
- Students with <80% attendance highlighted
- Red border and background tint
- "High Absence" badge
- Trending down icon

## Usage

### For Teachers

1. **Navigate to Attendance**
   - Click "Attendance" in sidebar
   - Or go to `/attendance`

2. **Select Class and Date**
   - Choose class from dropdown
   - Select date (defaults to today)

3. **Mark Attendance**
   - Click radio buttons for each student
   - Present (green), Absent (red), Late (yellow)
   - Add optional notes

4. **Bulk Actions** (Optional)
   - Click "Mark All Present" or "Mark All Absent"
   - Adjust individual students as needed

5. **Save**
   - Click "Save Attendance"
   - All attendance records saved

### For Admins

1. **Navigate to Attendance**
   - Click "Attendance" in sidebar
   - Or go to `/attendance`

2. **Select View Mode**
   - By Student: See individual attendance
   - By Class: See class statistics
   - Calendar: See daily attendance

3. **View Reports**
   - See attendance percentages
   - Identify high absence students
   - Review class statistics
   - Check specific dates

## Sample Data

Pre-loaded sample attendance records:
- 3 dates (2 days ago, yesterday, today)
- Mix of present, absent, and late statuses
- Sample notes for absences and lates
- Automatically created on first load

## Status Types

- **Present**: Green, normal attendance
- **Absent**: Red, student not present
- **Late**: Yellow, student arrived late

## Attendance Percentage Calculation

```
Attendance % = (Present Count / Total Records) × 100
```

### Thresholds:
- **90-100%**: Excellent (Green)
- **80-89%**: Good (Yellow)
- **<80%**: High Absence (Red, highlighted)

## Data Storage

Attendance stored in `localStorage` with key `attendance`:
```javascript
[
  {
    id: 1,
    student_id: 1,
    class: "Grade 10A",
    date: "2024-01-15",
    status: "present",
    notes: "",
    created_date: "2024-01-15T10:30:00.000Z"
  }
]
```

## Responsive Design

- **Desktop**: Full table view
- **Tablet**: Card grid, simplified table
- **Mobile**: Card grid (1 column), touch-friendly inputs

## Design Features

- Green accent colors (different from other modules)
- Color-coded status indicators
- High absence highlighting
- Visual feedback on interactions
- Clean table design
- Smooth transitions

## Integration

- Route added: `/attendance`
- Protected route (requires login)
- Role-based view switching
- Integrated with DashboardLayout
- Links to students and classes
- Navigation updates based on enabled features

## Next Steps

1. Connect to backend API
2. Add attendance history charts
3. Add attendance trends over time
4. Add automatic absence notifications
5. Add attendance export
6. Add bulk attendance import
7. Add attendance policies/rules
8. Add excused absence tracking

---

**The Attendance module is fully functional!** 🎉

