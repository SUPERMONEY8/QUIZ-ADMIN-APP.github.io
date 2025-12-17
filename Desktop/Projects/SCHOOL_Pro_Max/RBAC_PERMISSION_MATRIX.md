# École de Formation - Role-Based Access Control (RBAC) Permission Matrix

## Roles Overview

| Role | Description | Scope |
|------|-------------|-------|
| **Super Admin** | System administrator | All schools, full access |
| **School Admin** | School administrator | Own school only, full access |
| **Teacher** | Classroom teacher | Own classes/courses, limited access |
| **Student** | Enrolled student | Own data only, view-only for most |
| **Parent** | Student guardian | Children's data only, view-only |

---

## Permission Matrix

### Legend
- ✅ = Allowed
- ❌ = Not Allowed
- ⚠️ = Limited (specific conditions apply)

| Section | Action | Super Admin | School Admin | Teacher | Student | Parent |
|---------|--------|-------------|--------------|---------|---------|--------|
| **SCHOOLS** |
| Schools | View | ✅ All | ✅ Own | ❌ | ❌ | ❌ |
| Schools | Create | ✅ | ❌ | ❌ | ❌ | ❌ |
| Schools | Update | ✅ All | ✅ Own | ❌ | ❌ | ❌ |
| Schools | Delete | ✅ | ❌ | ❌ | ❌ | ❌ |
| **USERS** |
| Users | View | ✅ All | ✅ Own School | ⚠️ Own Classes | ❌ | ❌ |
| Users | Create | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| Users | Update | ✅ All | ✅ Own School | ⚠️ Own Profile | ✅ Own | ✅ Own |
| Users | Delete | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| **STUDENTS** |
| Students | View | ✅ All | ✅ Own School | ⚠️ Own Classes | ✅ Own | ✅ Children |
| Students | Create | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| Students | Update | ✅ All | ✅ Own School | ⚠️ Limited Info | ❌ | ❌ |
| Students | Delete | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| **CLASSES** |
| Classes | View | ✅ All | ✅ Own School | ⚠️ Assigned | ✅ Own | ✅ Children's |
| Classes | Create | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| Classes | Update | ✅ All | ✅ Own School | ⚠️ Own Classes | ❌ | ❌ |
| Classes | Delete | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| Classes | Enroll | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| **COURSES** |
| Courses | View | ✅ All | ✅ Own School | ⚠️ Own Courses | ✅ Enrolled | ✅ Children's |
| Courses | Create | ✅ All | ✅ Own School | ✅ Own | ❌ | ❌ |
| Courses | Update | ✅ All | ✅ Own School | ✅ Own | ❌ | ❌ |
| Courses | Delete | ✅ All | ✅ Own School | ✅ Own | ❌ | ❌ |
| **GRADES** |
| Grades | View | ✅ All | ✅ Own School | ⚠️ Own Classes | ✅ Own | ✅ Children's |
| Grades | Create | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Grades | Update | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Grades | Delete | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Grades | Reports | ✅ All | ✅ Own School | ✅ Own Classes | ✅ Own | ✅ Children's |
| **ATTENDANCE** |
| Attendance | View | ✅ All | ✅ Own School | ⚠️ Own Classes | ✅ Own | ✅ Children's |
| Attendance | Create | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Attendance | Update | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Attendance | Delete | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Attendance | Reports | ✅ All | ✅ Own School | ✅ Own Classes | ✅ Own | ✅ Children's |
| **ASSIGNMENTS** |
| Assignments | View | ✅ All | ✅ Own School | ⚠️ Own Classes | ✅ Assigned | ✅ Children's |
| Assignments | Create | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Assignments | Update | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Assignments | Delete | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Assignments | Submit | ✅ All | ✅ Own School | ❌ | ✅ Own | ❌ |
| Assignments | Grade | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| **DOCUMENTS** |
| Documents | View | ✅ All | ✅ Own School | ⚠️ Own Classes | ✅ Own | ✅ Children's |
| Documents | Upload | ✅ All | ✅ Own School | ✅ Own Classes | ✅ Own | ❌ |
| Documents | Download | ✅ All | ✅ Own School | ✅ Own Classes | ✅ Own | ✅ Children's |
| Documents | Delete | ✅ All | ✅ Own School | ✅ Own Classes | ✅ Own | ❌ |
| **PAYMENTS** |
| Payments | View | ✅ All | ✅ Own School | ❌ | ✅ Own | ✅ Children's |
| Payments | Create | ✅ All | ✅ Own School | ❌ | ✅ Own | ❌ |
| Payments | Update | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| Payments | Delete | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| Payments | Process | ✅ All | ✅ Own School | ✅ | ❌ | ❌ |
| Payments | Reports | ✅ All | ✅ Own School | ✅ | ✅ Own | ✅ Children's |
| **COMMUNICATION** |
| Messages | View | ✅ All | ✅ Own School | ✅ All | ✅ Own | ✅ Own |
| Messages | Send | ✅ All | ✅ Own School | ✅ Own Classes | ✅ Own | ✅ Own |
| Messages | Delete | ✅ All | ✅ Own School | ✅ Own | ✅ Own | ✅ Own |
| Announcements | View | ✅ All | ✅ Own School | ✅ All | ✅ All | ✅ All |
| Announcements | Create | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Announcements | Update | ✅ All | ✅ Own School | ✅ Own | ❌ | ❌ |
| Announcements | Delete | ✅ All | ✅ Own School | ✅ Own | ❌ | ❌ |
| **SCHEDULE** |
| Schedule | View | ✅ All | ✅ Own School | ⚠️ Own Schedule | ✅ Own | ✅ Children's |
| Schedule | Create | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Schedule | Update | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Schedule | Delete | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| **LIBRARY** |
| Library | View | ✅ All | ✅ Own School | ✅ All | ✅ All | ✅ All |
| Library | Add Books | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| Library | Update Books | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| Library | Delete Books | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| Library | Borrow | ✅ All | ✅ Own School | ❌ | ✅ Own | ❌ |
| Library | Manage | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| **EVENTS** |
| Events | View | ✅ All | ✅ Own School | ✅ All | ✅ All | ✅ All |
| Events | Create | ✅ All | ✅ Own School | ✅ Own | ❌ | ❌ |
| Events | Update | ✅ All | ✅ Own School | ✅ Own | ❌ | ❌ |
| Events | Delete | ✅ All | ✅ Own School | ✅ Own | ❌ | ❌ |
| Events | Register | ✅ All | ✅ Own School | ✅ Own | ✅ Own | ✅ Own |
| **BEHAVIOR** |
| Behavior | View | ✅ All | ✅ Own School | ⚠️ Own Classes | ✅ Own | ✅ Children's |
| Behavior | Create | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Behavior | Update | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Behavior | Delete | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Behavior | Reports | ✅ All | ✅ Own School | ✅ Own Classes | ✅ Own | ✅ Children's |
| **FEATURES** |
| Features | View | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| Features | Enable | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| Features | Disable | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| Features | Manage | ✅ All | ✅ Own School | ❌ | ❌ | ❌ |
| **REPORTS** |
| Reports | View | ✅ All | ✅ Own School | ⚠️ Own Classes | ✅ Own | ✅ Children's |
| Reports | Generate | ✅ All | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Reports | Export | ✅ All | ✅ Own School | ✅ Own Classes | ✅ Own | ✅ Children's |
| **SETTINGS** |
| Settings | View | ✅ All | ✅ Own School | ✅ Own | ✅ Own | ✅ Own |
| Settings | Update | ✅ All | ✅ Own School | ✅ Own | ✅ Own | ✅ Own |

---

## Data Visibility Rules

### Super Admin
- **Scope**: All schools, all users, all data
- **Restrictions**: None

### School Admin
- **Scope**: Own school only
- **Can See**: All users, students, classes, courses within their school
- **Cannot See**: Data from other schools

### Teacher
- **Scope**: Own assigned classes and courses
- **Can See**: 
  - Students in their classes
  - Courses they teach
  - Grades for their courses
  - Attendance for their classes
- **Cannot See**: 
  - Other teachers' classes
  - School-wide settings
  - Payment information

### Student
- **Scope**: Own data only
- **Can See**: 
  - Own grades
  - Own attendance
  - Own assignments
  - Own documents
  - Own schedule
  - Own payment records
- **Cannot See**: 
  - Other students' data
  - Teacher-only sections
  - Admin sections

### Parent
- **Scope**: Linked children's data only
- **Can See**: 
  - Children's grades
  - Children's attendance
  - Children's assignments
  - Children's documents
  - Children's schedule
  - Children's payment records
- **Cannot See**: 
  - Other students' data
  - Teacher/admin sections

---

## Feature Management Permissions

| Role | Can Enable Features | Can Disable Features | Can View Features |
|------|---------------------|----------------------|-------------------|
| **Super Admin** | ✅ All Schools | ✅ All Schools | ✅ All Schools |
| **School Admin** | ✅ Own School | ✅ Own School | ✅ Own School |
| **Teacher** | ❌ | ❌ | ❌ |
| **Student** | ❌ | ❌ | ❌ |
| **Parent** | ❌ | ❌ | ❌ |

---

## Special Permission Rules

### Own Profile Access
- **All roles** can update their own profile (email, password, preferences)
- **All roles** can view their own profile

### Own Messages
- **All roles** can delete their own messages
- **All roles** can view their own messages

### Own Submissions
- **Students** can submit assignments but cannot delete them after submission
- **Teachers** can grade submissions for their classes

### Own Documents
- **Students** can upload, download, and delete their own documents
- **Teachers** can view documents from students in their classes
- **Parents** can view their children's documents (read-only)

---

## Implementation Notes

### Permission Checking Flow
1. Check user role
2. Check if feature is enabled for school
3. Check if user has permission for action
4. Apply data scoping based on role
5. Execute action with filtered data

### Role Hierarchy
```
Super Admin (highest privileges)
    ↓
School Admin
    ↓
Teacher
    ↓
Student / Parent (same level)
```

### Data Scoping
- **Super Admin**: No scoping (all data)
- **School Admin**: Scoped to school_id
- **Teacher**: Scoped to assigned class_ids
- **Student**: Scoped to own user_id
- **Parent**: Scoped to linked children's user_ids

### Edge Cases
- Teachers can see students in multiple classes if assigned to both
- Parents with multiple children can see all children's data
- School Admin can see all data within their school regardless of class assignments
- Super Admin bypasses all scoping rules

---

## Usage Examples

### Check Permission
```javascript
import { hasPermission, ROLES, SECTIONS, ACTIONS } from './utils/permissions';

// Check if teacher can create grades
const canCreate = hasPermission(ROLES.TEACHER, SECTIONS.GRADES, ACTIONS.CREATE);
// Returns: true

// Check if student can delete grades
const canDelete = hasPermission(ROLES.STUDENT, SECTIONS.GRADES, ACTIONS.DELETE);
// Returns: false
```

### Check Feature Management
```javascript
import { canManageFeatures, ROLES } from './utils/permissions';

// Check if school admin can manage features
const canManage = canManageFeatures(ROLES.SCHOOL_ADMIN);
// Returns: true
```

### Check Data Access
```javascript
import { canViewStudentData, ROLES } from './utils/permissions';

// Check if teacher can view specific student
const canView = canViewStudentData(
  ROLES.TEACHER,
  teacherUserId,
  studentUserId,
  assignedStudentIds
);
// Returns: true if student is in teacher's classes
```

