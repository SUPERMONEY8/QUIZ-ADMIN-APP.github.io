# Assignments Module - Guide

## Overview

Complete Assignments module with role-based views:
- **Teacher View**: Create and manage assignments
- **Student View**: View and submit assignments

**Note**: This is an optional feature that only shows if "assignments" is enabled in the feature panel.

## Features

### ✅ Implemented Features

1. **Teacher View**
   - Create Assignment button opens modal
   - Form fields: title, description, course, due_date, rubric (optional), max_score
   - Assignment list showing all created assignments
   - Edit and Delete options
   - Submission status (e.g., "15/20 students submitted")
   - Progress bar for submissions

2. **Student View**
   - See assignments for their courses
   - Filter by course and status (submitted/not submitted/overdue)
   - Download assignment details (text file)
   - Submit assignment button (placeholder for future document upload)

3. **Feature Gating**
   - Only accessible if "assignments" feature is enabled
   - Shows disabled message if feature is off

4. **Data Storage**
   - localStorage for demo
   - Stores: id, course_id, teacher_id, title, description, due_date, rubric, max_score, submissions
   - Sample data initialization

## Component Structure

```
Assignments Page
├── Feature Check (enabled/disabled)
├── DashboardLayout (wrapper)
├── Header Section
│   ├── Title & Icon
│   └── Role-based description
├── TeacherAssignmentView (if teacher)
│   ├── Search Bar
│   ├── Create Button
│   ├── AssignmentList
│   └── AssignmentFormModal
└── StudentAssignmentView (if student)
    ├── Filters (Course, Status)
    ├── Assignment Cards
    └── Download/Submit Actions
```

## Assignment Data Structure

```javascript
{
  id: 1,
  course_id: 1,
  teacher_id: 1,
  title: "Algebra Fundamentals Quiz",
  description: "Complete the algebra quiz covering chapters 1-3.",
  due_date: "2024-01-22",
  rubric: "Graded on correctness (80%) and showing work (20%)",
  max_score: 100,
  created_date: "2024-01-15T10:30:00.000Z",
  submissions: [
    {
      student_id: 1,
      submitted_date: "2024-01-20T10:30:00.000Z",
      // Future: file_url, grade, feedback
    }
  ]
}
```

## Teacher View Features

### Create Assignment
- Modal form with all required fields
- Course dropdown (from available courses)
- Due date picker (defaults to tomorrow)
- Max score input
- Optional rubric field
- Form validation

### Assignment List
- Table format showing all assignments
- Course name and class
- Due date
- Max score
- Submission count (e.g., "15/20 students")
- Progress bar showing submission percentage
- Edit and Delete buttons

### Submission Status
- Shows "X/Y students submitted"
- Progress bar visualization
- Calculated based on students in course class
- Updates when submissions are added

## Student View Features

### Assignment Cards
- Grid layout (responsive)
- Course name and assignment title
- Description preview
- Due date with overdue indicator
- Max score
- Rubric (if provided)
- Status indicators (Submitted/Overdue)

### Filters
- Filter by course (dropdown)
- Filter by status:
  - All Status
  - Not Submitted
  - Submitted
  - Overdue

### Actions
- **Download**: Downloads assignment details as text file
- **Submit**: Placeholder button (future document upload)
- Shows "Submitted" badge if already submitted

### Status Indicators
- **Submitted**: Green checkmark, green border
- **Overdue**: Red X, red border, "Overdue" label
- **Not Submitted**: Default border, submit button

## Feature Gating

The module checks if "assignments" is enabled in the feature panel:
- If disabled: Shows message to contact administrator
- If enabled: Shows full functionality
- Feature state checked on component mount

## Usage

### For Teachers

1. **Navigate to Assignments**
   - Click "Assignments" in sidebar (if enabled)
   - Or go to `/assignments`

2. **Create Assignment**
   - Click "Create Assignment" button
   - Fill in form:
     - Title (required)
     - Description (required)
     - Course (dropdown, required)
     - Due Date (required)
     - Max Score (required)
     - Rubric (optional)
   - Click "Create Assignment"

3. **Manage Assignments**
   - View all assignments in table
   - See submission status
   - Edit assignment details
   - Delete assignments

### For Students

1. **Navigate to Assignments**
   - Click "Assignments" in sidebar (if enabled)
   - Or go to `/assignments`

2. **View Assignments**
   - See all assignments for your courses
   - Filter by course or status
   - Check due dates and requirements

3. **Download Assignment**
   - Click "Download" button
   - Assignment details saved as text file

4. **Submit Assignment** (Future)
   - Click "Submit" button
   - Document upload feature coming soon

## Sample Data

Pre-loaded sample assignments:
1. Algebra Fundamentals Quiz (MATH-101)
2. French Literature Essay (FREN-201)

Created automatically on first load if courses exist.

## Status Logic

### Submission Status
- Checks if student has submission in `assignments.submissions` array
- Matches by `student_id`

### Overdue Status
- Compares `due_date` with today's date
- Only if assignment is not submitted
- Shows red indicator and "Overdue" label

## Data Storage

Assignments stored in `localStorage` with key `assignments`:
```javascript
[
  {
    id: 1,
    course_id: 1,
    teacher_id: 1,
    title: "Algebra Fundamentals Quiz",
    description: "Complete the algebra quiz...",
    due_date: "2024-01-22",
    rubric: "Graded on correctness...",
    max_score: 100,
    created_date: "2024-01-15T10:30:00.000Z",
    submissions: []
  }
]
```

## Responsive Design

- **Desktop**: Full table view (teacher), 3-column grid (student)
- **Tablet**: 2-column grid (student)
- **Mobile**: 1-column grid, simplified table

## Design Features

- Blue accent colors (different from other modules)
- Color-coded status indicators
- Progress bars for submission tracking
- Overdue highlighting
- Download functionality
- Clean card design

## Integration

- Route added: `/assignments`
- Protected route (requires login)
- Feature-gated (only if enabled)
- Role-based view switching
- Integrated with DashboardLayout
- Links to courses and students
- Navigation updates based on enabled features

## Future Enhancements

1. Document upload for submissions
2. Grade assignments
3. Provide feedback
4. Assignment templates
5. Bulk assignment creation
6. Assignment categories
7. Recurring assignments
8. Assignment analytics

## Notes

- Document upload feature is placeholder (coming soon)
- Submission tracking is basic (ready for file upload integration)
- Grading will be added in future update
- File storage will require backend integration

---

**The Assignments module is fully functional!** 🎉

