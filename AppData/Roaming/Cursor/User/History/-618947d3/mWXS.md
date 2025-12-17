# École de Formation - Modular Feature System Documentation

## Overview

The modular feature system allows school administrators to enable or disable specific features for their school. Each feature can have dependencies on other features, required roles, and custom initialization data.

## Master Feature Registry

The system includes 12 core features:

1. **Students** - Student management
2. **Courses** - Course catalog
3. **Grades** - Grade management
4. **Attendance** - Attendance tracking
5. **Assignments** - Assignment management
6. **Documents** - Document management
7. **Payments** - Payment processing
8. **Communication** - Messaging system
9. **Schedule** - Schedule/timetable management
10. **Library** - Library management
11. **Events** - Event management
12. **Behavior** - Behavior tracking

## Feature Properties

Each feature in the registry includes:

- **name**: Human-readable feature name
- **key**: Unique identifier (e.g., "students", "grades")
- **icon**: Icon identifier for UI display
- **description**: Feature description
- **required_role**: Minimum role needed to enable/manage
- **dependencies**: Array of feature keys that must be enabled first
- **category**: Feature category (core, academic, general, financial)
- **initialization_data**: Configuration needed when enabling
- **lifecycle_hooks**: Actions to perform on enable/disable
- **navigation_config**: Navigation menu configuration

## Feature State Management

### Database Structure

Features are stored in two main tables:

1. **FeatureRegistry**: Master list of all available features
2. **FeatureState**: Per-school feature states and settings

### State Storage

```sql
FeatureState {
    feature_key: VARCHAR(100)  -- References FeatureRegistry
    school_id: INT             -- References School
    enabled: BOOLEAN           -- Current state
    settings: JSON             -- Feature-specific settings
    enabled_date: DATETIME     -- When enabled
    disabled_date: DATETIME     -- When disabled
    enabled_by: INT            -- User who enabled
    disabled_by: INT           -- User who disabled
}
```

### State Validation

Before enabling a feature:
1. Check all dependencies are enabled
2. Verify user has required_role
3. Validate initialization_data

Before disabling a feature:
1. Check if other features depend on this one
2. Warn about dependent features (allow override)

## Feature Lifecycle

### Enabling a Feature

**Workflow:**
1. Validate dependencies (all must be enabled)
2. Validate permissions (user has required_role)
3. Initialize data (create tables, set defaults)
4. Execute on_enable hooks
5. Update feature state (enabled=TRUE)
6. Update navigation menu
7. Notify users

**On Failure:**
- Rollback all changes
- Return error with details
- Log failure for debugging

### Disabling a Feature

**Workflow:**
1. Check dependent features (warn if any exist)
2. Validate permissions
3. Execute on_disable hooks
4. Archive data (make read-only)
5. Update feature state (enabled=FALSE)
6. Remove from navigation menu
7. Notify users

**On Failure:**
- Log error but continue (non-critical steps)
- Preserve data integrity

## Navigation Management

### Dynamic Navigation

Navigation items are dynamically generated based on:
1. Features enabled for the school
2. User's role and permissions
3. Feature navigation configuration

### Implementation

**Backend:**
```sql
SELECT fr.* FROM FeatureRegistry fr
JOIN FeatureState fs ON fr.key = fs.feature_key
WHERE fs.school_id = ? AND fs.enabled = TRUE
AND (fr.required_role <= user.role OR user.role = 'super_admin')
ORDER BY fr.navigation_config->>'$.order'
```

**Frontend:**
- Query `/api/schools/{school_id}/features/enabled/navigation`
- Cache results for 5 minutes
- Render navigation items dynamically

### Navigation Groups

Features are grouped by category:
- **Academic**: courses, grades, attendance, assignments, schedule, behavior
- **Student Management**: students
- **General**: documents, communication, library, events
- **Financial**: payments

## Feature Dependencies

### Dependency Rules

- **Required Dependencies**: Must be enabled before dependent feature
- **Optional Dependencies**: Enhance functionality but not required
- **Circular Dependencies**: Detected and prevented

### Example Dependency Chain

```
students (no dependencies)
  └── classes (depends on: students)
       └── courses (depends on: classes)
            └── grades (depends on: students, courses)
```

### Dependency Validation

```javascript
function canEnableFeature(featureKey, schoolId) {
    const feature = getFeature(featureKey);
    const dependencies = feature.dependencies;
    
    for (const depKey of dependencies) {
        if (!isFeatureEnabled(depKey, schoolId)) {
            return {
                canEnable: false,
                reason: `Dependency '${depKey}' is not enabled`
            };
        }
    }
    return { canEnable: true };
}
```

## API Endpoints

### Get Available Features
```http
GET /api/features
Response: List of all features in registry
```

### Get School Features
```http
GET /api/schools/{school_id}/features
Response: List of features with enabled status for school
```

### Enable Feature
```http
POST /api/schools/{school_id}/features/{feature_key}/enable
Body: { settings: {...} }
Response: { success: true, feature: {...} }
```

### Disable Feature
```http
POST /api/schools/{school_id}/features/{feature_key}/disable
Body: { reason: "..." }
Response: { success: true }
```

### Get Feature Status
```http
GET /api/schools/{school_id}/features/{feature_key}/status
Response: { enabled: true, settings: {...}, ... }
```

### Update Feature Settings
```http
PUT /api/schools/{school_id}/features/{feature_key}/settings
Body: { settings: {...} }
Response: { success: true }
```

### Get Navigation Items
```http
GET /api/schools/{school_id}/features/enabled/navigation
Response: [ { path: "/students", label: "Students", ... }, ... ]
```

## Usage Examples

### Enable Students Feature
```javascript
POST /api/schools/1/features/students/enable
{
    "settings": {
        "max_students_per_class": 30,
        "auto_generate_student_number": true
    }
}
```

### Check if Feature Can Be Enabled
```javascript
const result = await canEnableFeature('grades', schoolId);
if (!result.canEnable) {
    console.error(`Cannot enable: ${result.reason}`);
}
```

### Get Navigation Menu
```javascript
const navItems = await fetch(
    `/api/schools/${schoolId}/features/enabled/navigation`
).then(r => r.json());

// Render navigation based on enabled features
navItems.forEach(item => {
    renderNavItem(item);
});
```

## Best Practices

1. **Always check dependencies** before enabling features
2. **Archive data, don't delete** when disabling features
3. **Cache navigation** for performance
4. **Log all feature changes** for audit trail
5. **Validate permissions** at every step
6. **Provide clear error messages** when operations fail
7. **Support rollback** for failed enable operations
8. **Preserve data integrity** when disabling features

## Security Considerations

1. Only Super Admin and School Admin can enable/disable features
2. Required role is checked before allowing feature enable
3. Feature settings are validated before saving
4. All feature changes are logged with user ID
5. Dependent features are checked to prevent breaking dependencies

