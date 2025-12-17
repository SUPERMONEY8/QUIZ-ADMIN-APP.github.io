# École de Formation - Authentication System Guide

## Overview

The authentication system provides:
- Email/password login
- Role-based auto-assignment
- Session management with localStorage
- Protected routes
- Logout functionality
- Modern glassmorphism UI design

## Architecture

```
AuthContext (Global State)
    ↓
Login Component
    ↓
ProtectedRoute (Route Guard)
    ↓
App Components
```

## Components

### 1. AuthContext (`src/context/AuthContext.jsx`)

**Purpose**: Manages global authentication state

**Features**:
- User session management
- Login/logout functions
- Role checking
- Session persistence

**Usage**:
```jsx
import { useAuth } from './context/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

### 2. Login Component (`src/components/auth/Login.jsx`)

**Purpose**: User login interface

**Features**:
- Email and password input
- Role-based auto-assignment
- Form validation
- Loading states
- Error handling
- Glassmorphism design

**Role Assignment**:
- `admin@` or `superadmin@` → Super Admin
- `schooladmin@` or `@admin` → School Admin
- `teacher@` or `@teacher` → Teacher
- `student@` or `@student` → Student
- `parent@` or `@parent` → Parent
- Default → Student

### 3. ProtectedRoute (`src/components/auth/ProtectedRoute.jsx`)

**Purpose**: Route protection based on authentication and roles

**Features**:
- Authentication check
- Role-based access control
- Loading states
- Automatic redirects

**Usage**:
```jsx
// Basic protection
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Role-specific
<ProtectedRoute requiredRole={ROLES.TEACHER}>
  <TeacherDashboard />
</ProtectedRoute>
```

### 4. LogoutButton (`src/components/auth/LogoutButton.jsx`)

**Purpose**: Logout functionality

**Variants**:
- `default`: Icon + text button
- `icon`: Icon only
- `text`: Text only

### 5. Storage Utilities (`src/utils/storage.js`)

**Purpose**: localStorage management

**Functions**:
- `saveToStorage(key, data)`
- `loadFromStorage(key, defaultValue)`
- `clearStorage(key)`
- `removeFromStorage(key)`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install react-router-dom lucide-react
```

### 2. Wrap App with AuthProvider

```jsx
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app */}
    </AuthProvider>
  );
}
```

### 3. Set Up Routes

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';

<Routes>
  <Route path="/login" element={<Login />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>
```

## Usage Examples

### Check Authentication Status

```jsx
import { useAuth } from './context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome, {user.email}!</div>;
};
```

### Check User Role

```jsx
const { user, hasRole } = useAuth();

if (hasRole(ROLES.TEACHER)) {
  // Show teacher-specific content
}
```

### Protect Component

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

### Conditional Navigation

```jsx
const Navigation = () => {
  const { user } = useAuth();
  
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/students', label: 'Students', role: ROLES.TEACHER },
    { path: '/admin', label: 'Admin', role: ROLES.SUPER_ADMIN },
  ].filter(item => !item.role || item.role === user?.role);
  
  return (
    <nav>
      {menuItems.map(item => (
        <Link to={item.path}>{item.label}</Link>
      ))}
    </nav>
  );
};
```

## Demo Credentials

For testing, use these email patterns:

| Email Pattern | Assigned Role |
|--------------|---------------|
| `admin@ecole.fr` | Super Admin |
| `schooladmin@ecole.fr` | School Admin |
| `teacher@ecole.fr` | Teacher |
| `student@ecole.fr` | Student |
| `parent@ecole.fr` | Parent |

**Password**: Any (demo mode - not validated)

## Session Management

### Session Storage

- **User Data**: `localStorage.user`
- **Session Token**: `localStorage.session_token`
- **Session Expiry**: `localStorage.session_expiry` (24 hours)

### Session Expiry

Sessions expire after 24 hours. The system automatically checks expiry on:
- App initialization
- Route access
- Permission checks

### Manual Session Management

```jsx
// Clear session
const { logout } = useAuth();
logout();

// Update user data
const { updateUser } = useAuth();
updateUser({ firstName: 'New Name' });
```

## Security Considerations

⚠️ **Important**: This is a demo implementation using localStorage.

### For Production:

1. **Backend Validation**: Always validate on server
2. **JWT Tokens**: Use secure HTTP-only cookies
3. **Password Hashing**: Never store plain passwords
4. **CSRF Protection**: Implement CSRF tokens
5. **Rate Limiting**: Prevent brute force attacks
6. **Session Management**: Use secure session storage
7. **HTTPS Only**: Always use HTTPS in production

## Customization

### Change Role Assignment Logic

Edit `src/context/AuthContext.jsx`:

```jsx
// Custom role assignment
if (email.includes('@admin.')) {
  role = ROLES.SUPER_ADMIN;
}
```

### Customize Login UI

Edit `src/components/auth/Login.jsx`:
- Change colors in className
- Modify glassmorphism effects
- Add additional fields

### Extend Session Duration

Edit `src/context/AuthContext.jsx`:

```jsx
// Change from 24 hours to 7 days
saveToStorage('session_expiry', Date.now() + 7 * 24 * 60 * 60 * 1000);
```

## Troubleshooting

### Login Not Working

1. Check browser console for errors
2. Verify localStorage is enabled
3. Check email format matches role pattern
4. Ensure AuthProvider wraps app

### Session Not Persisting

1. Check localStorage permissions
2. Verify storage utilities are working
3. Check for storage quota exceeded

### Protected Route Redirect Loop

1. Verify user is being saved to localStorage
2. Check session expiry logic
3. Ensure logout clears all auth data

## Testing

### Test Login Flow

```jsx
// Test different roles
const testEmails = [
  'admin@ecole.fr',
  'teacher@ecole.fr',
  'student@ecole.fr',
];

testEmails.forEach(email => {
  // Login and verify role assignment
});
```

### Test Protected Routes

```jsx
// Test access control
- Login as student
- Try to access teacher route
- Should redirect to /unauthorized
```

## Next Steps

1. Integrate with backend API
2. Add password reset functionality
3. Implement "Remember Me" feature
4. Add two-factor authentication
5. Create registration flow
6. Add email verification

