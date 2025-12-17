# École de Formation - Role-Based Access Control (RBAC) System

## Permission Matrix

| Section | Action | Super Admin | School Admin | Teacher | Student | Parent |
|---------|--------|-------------|--------------|---------|---------|--------|
| **SCHOOLS** |
| Schools List | View | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| Schools List | Create | ✅ | ✅ | ❌ | ❌ | ❌ |
| Schools List | Update | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| Schools List | Delete | ✅ | ❌ | ❌ | ❌ | ❌ |
| School Settings | View | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| School Settings | Update | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| **USERS** |
| Users List | View | ✅ All Schools | ✅ Own School | ✅ Own Classes Only | ❌ | ❌ |
| Users List | Create | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| Users List | Update | ✅ All Schools | ✅ Own School | ✅ Own Profile | ✅ Own Profile | ✅ Own Profile |
| Users List | Delete | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| User Profiles | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own | ✅ Own Children |
| User Profiles | Update | ✅ All Schools | ✅ Own School | ✅ Own Profile | ✅ Own Profile | ✅ Own Profile |
| **STUDENTS** |
| Students List | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own Record | ✅ Own Children |
| Students List | Create | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| Students List | Update | ✅ All Schools | ✅ Own School | ✅ Limited Info | ❌ | ❌ |
| Students List | Delete | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| Student Profiles | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own | ✅ Own Children |
| Student Profiles | Update | ✅ All Schools | ✅ Own School | ✅ Limited Fields | ❌ | ❌ |
| **CLASSES** |
| Classes List | View | ✅ All Schools | ✅ Own School | ✅ Assigned Classes | ✅ Own Class | ✅ Children's Classes |
| Classes List | Create | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| Classes List | Update | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Classes List | Delete | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| Class Enrollment | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own Class | ✅ Children's Classes |
| Class Enrollment | Manage | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| **COURSES** |
| Courses List | View | ✅ All Schools | ✅ Own School | ✅ Own Courses | ✅ Enrolled Courses | ✅ Children's Courses |
| Courses List | Create | ✅ All Schools | ✅ Own School | ✅ Own Courses | ❌ | ❌ |
| Courses List | Update | ✅ All Schools | ✅ Own School | ✅ Own Courses | ❌ | ❌ |
| Courses List | Delete | ✅ All Schools | ✅ Own School | ✅ Own Courses | ❌ | ❌ |
| Course Content | View | ✅ All Schools | ✅ Own School | ✅ Own Courses | ✅ Enrolled | ✅ Children's |
| Course Content | Manage | ✅ All Schools | ✅ Own School | ✅ Own Courses | ❌ | ❌ |
| **GRADES** |
| Grades List | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own Grades | ✅ Children's Grades |
| Grades List | Create | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Grades List | Update | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Grades List | Delete | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Grade Reports | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own Reports | ✅ Children's Reports |
| Grade Reports | Generate | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| **ATTENDANCE** |
| Attendance List | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own Record | ✅ Children's Records |
| Attendance List | Create | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Attendance List | Update | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Attendance List | Delete | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Attendance Reports | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own Reports | ✅ Children's Reports |
| Attendance Reports | Generate | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| **ASSIGNMENTS** |
| Assignments List | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Assigned | ✅ Children's |
| Assignments List | Create | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Assignments List | Update | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Assignments List | Delete | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Assignment Submissions | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own Submissions | ✅ Children's |
| Assignment Submissions | Submit | ✅ All Schools | ✅ Own School | ❌ | ✅ Own | ❌ |
| Assignment Submissions | Grade | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| **DOCUMENTS** |
| Documents List | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own Documents | ✅ Children's |
| Documents List | Upload | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own | ❌ |
| Documents List | Download | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own | ✅ Children's |
| Documents List | Delete | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own | ❌ |
| **PAYMENTS** |
| Payments List | View | ✅ All Schools | ✅ Own School | ❌ | ✅ Own Payments | ✅ Children's Payments |
| Payments List | Create | ✅ All Schools | ✅ Own School | ❌ | ✅ Own Payments | ❌ |
| Payments List | Update | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| Payments List | Delete | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| Payment Reports | View | ✅ All Schools | ✅ Own School | ❌ | ✅ Own | ✅ Children's |
| Payment Reports | Generate | ✅ All Schools | ✅ Own School | ✅ | ❌ | ❌ |
| **COMMUNICATION** |
| Messages | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own Messages | ✅ Children's Messages |
| Messages | Send | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own | ✅ Own |
| Messages | Delete | ✅ All Schools | ✅ Own School | ✅ Own Messages | ✅ Own Messages | ✅ Own Messages |
| Announcements | View | ✅ All Schools | ✅ Own School | ✅ All | ✅ All | ✅ All |
| Announcements | Create | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Announcements | Update | ✅ All Schools | ✅ Own School | ✅ Own | ❌ | ❌ |
| Announcements | Delete | ✅ All Schools | ✅ Own School | ✅ Own | ❌ | ❌ |
| **SCHEDULE** |
| Schedule | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own Schedule | ✅ Children's Schedules |
| Schedule | Create | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Schedule | Update | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Schedule | Delete | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| **LIBRARY** |
| Library Books | View | ✅ All Schools | ✅ Own School | ✅ All | ✅ All | ✅ All |
| Library Books | Create | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| Library Books | Update | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| Library Books | Delete | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| Library Borrowing | View | ✅ All Schools | ✅ Own School | ✅ All | ✅ Own | ✅ Children's |
| Library Borrowing | Manage | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| **EVENTS** |
| Events | View | ✅ All Schools | ✅ Own School | ✅ All | ✅ All | ✅ All |
| Events | Create | ✅ All Schools | ✅ Own School | ✅ Own Events | ❌ | ❌ |
| Events | Update | ✅ All Schools | ✅ Own School | ✅ Own Events | ❌ | ❌ |
| Events | Delete | ✅ All Schools | ✅ Own School | ✅ Own Events | ❌ | ❌ |
| Events | Register | ✅ All Schools | ✅ Own School | ✅ Own | ✅ Own | ✅ Own |
| **BEHAVIOR** |
| Behavior Records | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own Record | ✅ Children's Records |
| Behavior Records | Create | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Behavior Records | Update | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Behavior Records | Delete | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Behavior Reports | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own | ✅ Children's |
| Behavior Reports | Generate | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| **FEATURES** |
| Feature Management | View | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| Feature Management | Enable/Disable | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| Feature Settings | View | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| Feature Settings | Update | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| **REPORTS** |
| Reports | View | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own Reports | ✅ Children's Reports |
| Reports | Generate | ✅ All Schools | ✅ Own School | ✅ Own Classes | ❌ | ❌ |
| Reports | Export | ✅ All Schools | ✅ Own School | ✅ Own Classes | ✅ Own | ✅ Children's |
| **SETTINGS** |
| System Settings | View | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| System Settings | Update | ✅ All Schools | ✅ Own School | ❌ | ❌ | ❌ |
| User Settings | View | ✅ All Schools | ✅ Own School | ✅ Own | ✅ Own | ✅ Own |
| User Settings | Update | ✅ All Schools | ✅ Own School | ✅ Own | ✅ Own | ✅ Own |

## Role Definitions

### 🔴 Super Admin
**Scope:** System-wide access across all schools
- **Can Access:** All sections across all schools
- **Can Perform:** All CRUD operations on all data
- **Data Visibility:** Complete access to all schools, users, and data
- **Feature Control:** Can enable/disable features for any school
- **Use Cases:** System administrators, platform owners

### 🟠 School Admin
**Scope:** Single school management
- **Can Access:** All sections within their assigned school
- **Can Perform:** Full CRUD within their school (except deleting school itself)
- **Data Visibility:** All data within their school only
- **Feature Control:** Can enable/disable features for their school
- **Use Cases:** School principals, administrative staff

### 🟡 Teacher
**Scope:** Own classes and courses
- **Can Access:** Sections related to their assigned classes/courses
- **Can Perform:** Create/Update/Delete for their courses, grades, assignments, attendance
- **Data Visibility:** Only students in their classes, own profile
- **Feature Control:** Cannot manage features
- **Use Cases:** Classroom teachers, subject teachers

### 🟢 Student
**Scope:** Own academic data
- **Can Access:** View-only access to own grades, assignments, schedule, documents
- **Can Perform:** Submit assignments, upload own documents, view own data
- **Data Visibility:** Own records only
- **Feature Control:** Cannot manage features
- **Use Cases:** Enrolled students

### 🔵 Parent
**Scope:** Own children's academic data
- **Can Access:** View access to children's grades, attendance, assignments, schedule
- **Can Perform:** View-only for children's data, can send messages
- **Data Visibility:** Only data for their linked children
- **Feature Control:** Cannot manage features
- **Use Cases:** Parents/guardians of enrolled students

## Permission Rules

### Data Scoping Rules
1. **Super Admin:** Can see all data across all schools
2. **School Admin:** Can see all data within their school
3. **Teacher:** Can see data for students in their assigned classes only
4. **Student:** Can see only their own data
5. **Parent:** Can see only data for their linked children

### Action Restrictions
- **Delete Operations:** Only Super Admin and School Admin can delete users, students, classes
- **School Management:** Only Super Admin can create/delete schools
- **Feature Management:** Only Super Admin and School Admin can enable/disable features
- **Bulk Operations:** Only Super Admin and School Admin can perform bulk imports/exports

### Feature Access
- Features must be enabled for a school before users can access them
- Role permissions are checked in addition to feature availability
- If a feature is disabled, even Super Admin cannot access it for that school (unless they enable it)

## Implementation Notes

### Permission Checking Flow
1. Check if user has required role
2. Check if feature is enabled for the school
3. Check if user has permission for the specific action
4. Apply data scoping based on role
5. Execute action with filtered data

### Role Hierarchy
```
Super Admin (highest)
    ↓
School Admin
    ↓
Teacher
    ↓
Student / Parent (same level)
```

### Special Permissions
- **Own Profile:** All roles can update their own profile
- **Own Messages:** All roles can delete their own messages
- **Own Submissions:** Students can submit assignments but not delete them
- **Own Documents:** Students can upload/download own documents but not delete others'

