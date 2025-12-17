# Course Management Module - Guide

## Overview

Complete Course Management module with CRUD operations, search, filter, teacher and class integration, and enrollment tracking.

## Features

### ✅ Implemented Features

1. **Course List View**
   - Table format (desktop)
   - Card grid format (mobile/tablet)
   - Toggle between views
   - Shows: course name, code, teacher, class, credits, enrollment count

2. **Add Course**
   - Modal form
   - All required fields
   - Teacher dropdown (from users)
   - Class dropdown (from classes)
   - Form validation
   - Unique course code check

3. **Edit Course**
   - Same modal form
   - Pre-populated with course data
   - Updates existing course

4. **Delete Course**
   - Confirmation prompt
   - Removes from list
   - Updates localStorage

5. **Search & Filter**
   - Search by name, code, teacher, description
   - Filter by class
   - Filter by teacher
   - Real-time filtering

6. **Enrollment Tracking**
   - Shows student count per course
   - Mock data for demo (5-30 students)
   - Ready for real enrollment integration

7. **Data Persistence**
   - localStorage for demo
   - Sample data (3 courses, 3 teachers pre-loaded)
   - Auto-saves on changes

## Component Structure

```
Courses Page
├── DashboardLayout (wrapper)
├── Header Section
│   ├── Title & Icon
│   ├── Course Count
│   └── Add Button
├── Search & Filter Bar
│   ├── Search Input
│   ├── Class Filter
│   └── Teacher Filter
├── CourseList
│   ├── View Toggle (Grid/Table)
│   ├── CourseTable (desktop)
│   └── CourseCard Grid (mobile)
└── CourseFormModal
    ├── Form Fields
    ├── Validation
    └── Submit/Cancel
```

## Form Fields

- **Course Name** (required)
- **Course Code** (required, unique)
- **Teacher** (required, dropdown from users)
- **Class** (required, dropdown from classes)
- **Credits** (required, number > 0)
- **Description** (optional, textarea)

## Validation Rules

1. **Required Fields**: Course name, code, teacher, class, credits
2. **Unique Course Code**: Cannot duplicate existing codes
3. **Credits Validation**: Must be greater than 0
4. **Real-time Validation**: Errors show as you type

## Sample Data

### Pre-loaded Courses:
1. Mathematics (MATH-101) - Dr. Jean Lefebvre - Grade 10A - 3 credits
2. French Literature (FREN-201) - Mme. Marie Dubois - Grade 11A - 3 credits
3. Physics (PHYS-301) - Dr. Jean Lefebvre - Grade 12A - 4 credits

### Pre-loaded Teachers:
1. Dr. Jean Lefebvre
2. Mme. Marie Dubois
3. M. Pierre Martin

### Pre-loaded Classes:
- Grade 10A, Grade 10B
- Grade 11A, Grade 11B
- Grade 12A, Grade 12B

## Usage

### Access Courses Page

1. Login to dashboard
2. Enable "Courses" feature in Feature Panel
3. Click "Courses" in sidebar
4. Or navigate to `/courses`

### Add Course

1. Click "Add Course" button
2. Fill in form fields:
   - Enter course name
   - Enter unique course code
   - Select teacher from dropdown
   - Select class from dropdown
   - Enter credits (default: 3.0)
   - Add description (optional)
3. Click "Add Course"
4. Course appears in list

### Edit Course

1. Click "Edit" on any course card/row
2. Modify fields
3. Click "Update Course"
4. Changes saved

### Delete Course

1. Click "Delete" on any course card/row
2. Confirm deletion
3. Course removed from list

### Search/Filter

1. Type in search box (searches name, code, teacher, description)
2. Select class from dropdown
3. Select teacher from dropdown
4. Results update in real-time

## Data Storage

### Courses Structure:
```javascript
{
  id: 1,
  course_name: "Mathematics",
  course_code: "MATH-101",
  teacher_id: 1,
  teacher_name: "Dr. Jean Lefebvre",
  class: "Grade 10A",
  credits: 3.0,
  description: "Introduction to algebra and geometry",
  created_date: "2024-01-01T00:00:00.000Z"
}
```

### Teachers Structure:
```javascript
{
  id: 1,
  first_name: "Jean",
  last_name: "Lefebvre",
  email: "teacher@ecole.fr",
  full_name: "Dr. Jean Lefebvre"
}
```

## Enrollment Count

Currently shows mock enrollment count (5-30 students per course).

To implement real enrollment:
1. Create enrollment table/state
2. Link students to courses
3. Count enrollments per course
4. Update `getEnrollmentCount` function

## Responsive Design

- **Desktop**: Table view with all columns
- **Tablet**: Card grid (2-3 columns)
- **Mobile**: Card grid (1 column), simplified table

## Design Features

- Purple accent color (different from Students)
- Course icon with gradient
- Credits badge
- Enrollment count display
- Teacher and class information
- Description preview

## Integration

- Route added to `App.jsx`: `/courses`
- Protected route (requires login)
- Integrated with DashboardLayout
- Navigation updates based on enabled features
- Linked to teachers and classes

## Next Steps

1. Connect to backend API
2. Implement real enrollment tracking
3. Add course prerequisites
4. Add course scheduling
5. Add bulk operations
6. Add export functionality
7. Add course materials/documents

---

**The Course Management module is fully functional!** 🎉

