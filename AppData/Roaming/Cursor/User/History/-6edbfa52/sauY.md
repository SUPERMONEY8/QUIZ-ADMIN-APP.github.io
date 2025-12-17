# École de Formation - RBAC Implementation Guide

## Quick Start

### 1. Import Permission Utilities

```javascript
import { 
  hasPermission, 
  ROLES, 
  SECTIONS, 
  ACTIONS,
  canManageFeatures,
  canViewStudentData 
} from './utils/permissions';
```

### 2. Use PermissionGuard Component

```jsx
import PermissionGuard from './components/common/PermissionGuard';

<PermissionGuard 
  role={user.role} 
  section={SECTIONS.GRADES} 
  action={ACTIONS.CREATE}
>
  <CreateGradeButton />
</PermissionGuard>
```

### 3. Use Permission Hooks

```jsx
import { usePermission } from './components/common/PermissionGuard';

const canEdit = usePermission(user.role, SECTIONS.GRADES, ACTIONS.UPDATE);
```

## Permission Checking Patterns

### Pattern 1: Component-Level Guarding

```jsx
const GradesPage = () => {
  const user = useAuth(); // Get current user
  
  return (
    <PermissionGuard 
      role={user.role} 
      section={SECTIONS.GRADES} 
      action={ACTIONS.VIEW}
      fallback={<AccessDenied />}
    >
      <GradesList />
    </PermissionGuard>
  );
};
```

### Pattern 2: Conditional Rendering

```jsx
const GradeActions = () => {
  const user = useAuth();
  const canCreate = usePermission(user.role, SECTIONS.GRADES, ACTIONS.CREATE);
  const canUpdate = usePermission(user.role, SECTIONS.GRADES, ACTIONS.UPDATE);
  
  return (
    <>
      {canCreate && <CreateButton />}
      {canUpdate && <UpdateButton />}
    </>
  );
};
```

### Pattern 3: Data Filtering

```jsx
const StudentsList = () => {
  const user = useAuth();
  const allStudents = useStudents();
  
  // Filter based on role
  const visibleStudents = useMemo(() => {
    if (user.role === ROLES.SUPER_ADMIN) {
      return allStudents; // All schools
    } else if (user.role === ROLES.SCHOOL_ADMIN) {
      return allStudents.filter(s => s.school_id === user.school_id);
    } else if (user.role === ROLES.TEACHER) {
      return allStudents.filter(s => 
        user.class_ids.includes(s.class_id)
      );
    } else if (user.role === ROLES.STUDENT) {
      return allStudents.filter(s => s.user_id === user.id);
    }
    return [];
  }, [allStudents, user]);
  
  return <StudentsGrid students={visibleStudents} />;
};
```

### Pattern 4: Navigation Filtering

```jsx
const NavigationMenu = () => {
  const user = useAuth();
  
  const menuItems = [
    { key: 'students', section: SECTIONS.STUDENTS, action: ACTIONS.VIEW },
    { key: 'grades', section: SECTIONS.GRADES, action: ACTIONS.VIEW },
    { key: 'features', section: SECTIONS.FEATURES, action: ACTIONS.VIEW },
  ].filter(item => 
    hasPermission(user.role, item.section, item.action)
  );
  
  return (
    <nav>
      {menuItems.map(item => (
        <NavLink key={item.key} to={`/${item.key}`}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};
```

### Pattern 5: API Route Protection

```javascript
// Backend route handler
app.post('/api/grades', authenticate, (req, res) => {
  const { role } = req.user;
  
  if (!hasPermission(role, SECTIONS.GRADES, ACTIONS.CREATE)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Create grade...
});
```

## Common Use Cases

### Feature Management

```jsx
const FeatureButton = () => {
  const user = useAuth();
  const canManage = canManageFeatures(user.role);
  
  if (!canManage) return null;
  
  return <Button onClick={openFeatureModal}>Manage Features</Button>;
};
```

### Student Data Access

```jsx
const StudentProfile = ({ studentId }) => {
  const user = useAuth();
  const student = useStudent(studentId);
  
  const canView = canViewStudentData(
    user.role,
    user.id,
    student.user_id,
    user.class_student_ids, // For teachers
    user.children_ids      // For parents
  );
  
  if (!canView) return <AccessDenied />;
  
  return <StudentDetails student={student} />;
};
```

### School Data Scoping

```jsx
const SchoolData = () => {
  const user = useAuth();
  const canViewAll = canViewSchoolData(
    user.role,
    user.school_id,
    targetSchoolId
  );
  
  if (!canViewAll) return <AccessDenied />;
  
  return <SchoolDashboard schoolId={targetSchoolId} />;
};
```

## Best Practices

1. **Always Check Permissions Server-Side**
   - Client-side checks are for UX only
   - Server must validate all requests

2. **Use PermissionGuard for Conditional Rendering**
   - Cleaner than multiple if statements
   - Centralized permission logic

3. **Filter Data at the API Level**
   - Don't send data user can't see
   - Reduce data transfer and improve security

4. **Cache Permission Checks**
   - Use useMemo for expensive checks
   - Don't recalculate on every render

5. **Provide Clear Error Messages**
   - Tell users why they can't access something
   - Suggest actions they can take

6. **Test All Role Combinations**
   - Ensure each role sees appropriate data
   - Verify no data leakage between roles

## Testing Permissions

```javascript
// Unit test example
describe('Permissions', () => {
  it('should allow teacher to create grades', () => {
    expect(hasPermission(ROLES.TEACHER, SECTIONS.GRADES, ACTIONS.CREATE))
      .toBe(true);
  });
  
  it('should deny student from deleting grades', () => {
    expect(hasPermission(ROLES.STUDENT, SECTIONS.GRADES, ACTIONS.DELETE))
      .toBe(false);
  });
});
```

## Migration Checklist

When implementing RBAC:

- [ ] Define all roles and their responsibilities
- [ ] Create permission matrix for all sections/actions
- [ ] Implement permission checking utilities
- [ ] Add PermissionGuard component to protected routes
- [ ] Filter navigation based on permissions
- [ ] Filter data based on role scoping
- [ ] Add server-side permission validation
- [ ] Test all role combinations
- [ ] Document permission rules
- [ ] Train users on role capabilities

