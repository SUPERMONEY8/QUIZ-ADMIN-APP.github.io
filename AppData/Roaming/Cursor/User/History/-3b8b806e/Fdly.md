# École de Formation - Data Storage Guide

## Overview

The application uses **localStorage** for persistent data storage. All data is automatically saved and loaded, ensuring data persistence across page refreshes and browser sessions.

## Storage Architecture

### Core Storage Utilities

Located in `src/utils/storage.js`:

- **`saveToStorage(key, data)`** - Save data to localStorage
- **`loadFromStorage(key, defaultValue)`** - Load data from localStorage
- **`removeFromStorage(key)`** - Remove specific key
- **`clearStorage(key?)`** - Clear all or specific storage
- **`hasStorageKey(key)`** - Check if key exists
- **`isStorageAvailable()`** - Check localStorage availability

### Data Initialization

Located in `src/utils/dataInitialization.js`:

- **`initializeDefaultData()`** - Initialize sample data on first load
- **`resetAllData()`** - Reset all data (for testing)
- **`getStorageStats()`** - Get storage statistics
- **`exportAllData()`** - Export all data as JSON
- **`importAllData(jsonString)`** - Import data from JSON

## Storage Keys

### Core Data

| Key | Description | Default Value |
|-----|-------------|---------------|
| `students` | Array of student records | Sample students |
| `courses` | Array of course records | Sample courses |
| `grades` | Array of grade records | Sample grades |
| `attendance` | Array of attendance records | Sample attendance |
| `assignments` | Array of assignment records | Sample assignments |
| `teachers` | Array of teacher records | Sample teachers |
| `users` | Array of user records | Sample users |
| `classes` | Array of class names | Sample classes |

### Authentication

| Key | Description |
|-----|-------------|
| `user` | Current logged-in user object |
| `session_token` | Session authentication token |
| `session_expiry` | Session expiration timestamp |

### Feature Management

| Key | Description |
|-----|-------------|
| `enabledFeatures` | Array of enabled feature keys |
| `data_initialized` | Boolean flag for initialization |
| `data_initialized_date` | Timestamp of initialization |

### Optional Features

| Key | Description | Default |
|-----|-------------|---------|
| `documents` | Document/file metadata | `[]` |
| `payments` | Payment and invoice records | `[]` |
| `messages` | Communication messages | `[]` |
| `events` | Calendar events | `[]` |
| `library` | Library books and checkouts | `[]` |
| `behavior_incidents` | Behavior tracking incidents | `[]` |
| `schedules` | Timetable/schedule entries | `[]` |

## Usage Examples

### Saving Data

```javascript
import { saveToStorage } from '../utils/storage';

// Save a student
const newStudent = {
  id: Date.now(),
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@ecole.fr',
  student_number: 'STU-2024-006',
  class: 'Grade 10A',
  status: 'active',
  created_date: new Date().toISOString(),
};

saveToStorage('students', [...existingStudents, newStudent]);
```

### Loading Data

```javascript
import { loadFromStorage } from '../utils/storage';

// Load students with default empty array
const students = loadFromStorage('students', []);

// Load with default value
const settings = loadFromStorage('settings', { theme: 'dark' });
```

### Updating Data

```javascript
import { loadFromStorage, saveToStorage } from '../utils/storage';

// Update a student
const students = loadFromStorage('students', []);
const updatedStudents = students.map(student =>
  student.id === studentId
    ? { ...student, status: 'inactive' }
    : student
);
saveToStorage('students', updatedStudents);
```

### Deleting Data

```javascript
import { loadFromStorage, saveToStorage } from '../utils/storage';

// Delete a student
const students = loadFromStorage('students', []);
const filtered = students.filter(s => s.id !== studentId);
saveToStorage('students', filtered);
```

## Automatic Initialization

The app automatically initializes default sample data on first load:

1. **App Initializer** (`src/components/AppInitializer.jsx`) runs on app start
2. Checks if data has been initialized
3. If not, calls `initializeDefaultData()`
4. Creates sample students, courses, grades, attendance, etc.

## Session Persistence

User sessions are automatically persisted:

1. **Login**: User data saved to `localStorage.user`
2. **Session Token**: Generated and saved to `localStorage.session_token`
3. **Session Expiry**: Set to 24 hours from login
4. **Auto-Login**: On app start, checks for valid session
5. **Logout**: Clears all session data

### Session Management

```javascript
import { useAuth } from './context/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();

// Login persists session automatically
await login('student@ecole.fr', 'password');

// Logout clears session
logout();

// Check if authenticated
if (isAuthenticated()) {
  // User is logged in
}
```

## Feature Settings Persistence

Feature toggles are automatically saved:

1. **Toggle Feature**: Changes saved to `localStorage.enabledFeatures`
2. **App Restart**: Features loaded from localStorage
3. **Navigation Updates**: Menu dynamically updates based on enabled features

```javascript
// Feature settings are automatically saved in FeaturePanelModal
// When toggled, they're saved using saveToStorage('enabledFeatures', newFeatures)
```

## Data Structure Examples

### Student Record

```javascript
{
  id: 1,
  first_name: 'Marie',
  last_name: 'Martin',
  email: 'marie.martin@ecole.fr',
  student_number: 'STU-2024-001',
  class: 'Grade 10A',
  status: 'active',
  user_id: 1,
  created_date: '2024-01-15T10:30:00.000Z'
}
```

### Grade Record

```javascript
{
  id: 1,
  student_id: 1,
  course_id: 1,
  score: 85.5,
  date_recorded: '2024-01-15T00:00:00.000Z',
  notes: 'Excellent work!',
  created_date: '2024-01-15T10:30:00.000Z'
}
```

### Course Record

```javascript
{
  id: 1,
  course_name: 'Mathematics',
  course_code: 'MATH-101',
  teacher_id: 1,
  teacher_name: 'Dr. Jean Lefebvre',
  class: 'Grade 10A',
  credits: 3.0,
  description: 'Introduction to algebra and geometry',
  created_date: '2024-01-15T10:30:00.000Z'
}
```

## Best Practices

### 1. Always Use Storage Utilities

✅ **Good:**
```javascript
import { saveToStorage, loadFromStorage } from '../utils/storage';
saveToStorage('students', students);
```

❌ **Bad:**
```javascript
localStorage.setItem('students', JSON.stringify(students));
```

### 2. Provide Default Values

✅ **Good:**
```javascript
const students = loadFromStorage('students', []);
```

❌ **Bad:**
```javascript
const students = loadFromStorage('students'); // May return null
```

### 3. Handle Errors

✅ **Good:**
```javascript
try {
  const data = loadFromStorage('important_data', []);
  // Use data
} catch (error) {
  console.error('Error loading data:', error);
  // Fallback behavior
}
```

### 4. Update Arrays Immutably

✅ **Good:**
```javascript
const newStudents = [...students, newStudent];
saveToStorage('students', newStudents);
```

❌ **Bad:**
```javascript
students.push(newStudent);
saveToStorage('students', students); // May cause issues
```

## Testing

### Reset All Data

```javascript
import { resetAllData } from './utils/dataInitialization';

// Reset and reinitialize
resetAllData();
```

### Export Data

```javascript
import { exportAllData } from './utils/dataInitialization';

const jsonData = exportAllData();
// Save to file or copy to clipboard
```

### Import Data

```javascript
import { importAllData } from './utils/dataInitialization';

const jsonString = '...'; // From file or user input
importAllData(jsonString);
```

### Check Storage Stats

```javascript
import { getStorageStats } from './utils/dataInitialization';

const stats = getStorageStats();
console.log('Total keys:', stats.totalKeys);
console.log('Total size:', stats.totalSize);
console.log('Data keys:', stats.dataKeys);
```

## Storage Limits

- **localStorage Limit**: ~5-10MB (varies by browser)
- **Best Practice**: Keep data structures lean
- **Monitoring**: Use `getStorageStats()` to monitor usage

## Troubleshooting

### Data Not Persisting

1. Check browser console for errors
2. Verify localStorage is available: `isStorageAvailable()`
3. Check if data is being saved: Inspect localStorage in DevTools
4. Verify JSON serialization is working

### Session Not Persisting

1. Check `session_expiry` timestamp
2. Verify `user` and `session_token` exist in localStorage
3. Check AuthContext initialization

### Features Not Persisting

1. Verify `enabledFeatures` array in localStorage
2. Check FeaturePanelModal is using `saveToStorage`
3. Verify event listeners are working

## Migration Notes

When upgrading or changing data structure:

1. Use version flags in localStorage
2. Check data version on load
3. Migrate old data format if needed
4. Update version flag after migration

## Security Considerations

⚠️ **Important**: localStorage is client-side only and not secure for sensitive data.

### Do NOT Store:
- Passwords (even hashed)
- Credit card numbers
- Personal identification numbers
- Authentication tokens (use httpOnly cookies in production)

### Safe to Store:
- UI preferences
- Non-sensitive user data
- Feature flags
- Session identifiers (for demo only)

## Production Recommendations

For production deployment:

1. **Backend API**: Move data to server-side database
2. **API Integration**: Replace localStorage calls with API calls
3. **Session Management**: Use secure HTTP-only cookies
4. **Data Validation**: Validate all data on server
5. **Backup Strategy**: Implement database backups
6. **Encryption**: Encrypt sensitive data at rest

---

**Storage system is fully functional and tested!** ✅

