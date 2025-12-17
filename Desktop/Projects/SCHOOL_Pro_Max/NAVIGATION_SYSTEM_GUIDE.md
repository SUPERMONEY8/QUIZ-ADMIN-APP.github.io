# Smart Navigation System - Guide

## Overview

The Smart Navigation System dynamically builds the sidebar menu based on enabled features with:

- ✅ Dynamic menu building from enabled features
- ✅ Hierarchical menu structure
- ✅ Smooth animations for appearance/disappearance
- ✅ Active section highlighting
- ✅ Conditional rendering
- ✅ Real-time updates when features are toggled

---

## Component Structure

```
SmartNavigation
├── Base Items (Always Visible)
│   └── Dashboard
├── Core Features Section
│   └── Students (if enabled)
├── Academic Features Section
│   ├── Courses (if enabled)
│   ├── Grades (if enabled)
│   ├── Attendance (if enabled)
│   ├── Assignments (if enabled)
│   ├── Schedule (if enabled)
│   └── Behavior (if enabled)
├── General Features Section
│   ├── Documents (if enabled)
│   ├── Messages (if enabled)
│   ├── Library (if enabled)
│   └── Events (if enabled)
├── Financial Features Section
│   └── Payments (if enabled)
└── System Items (Admin Only)
    └── Feature Panel
```

---

## Features

### 1. Dynamic Menu Building

The navigation reads from `localStorage.enabledFeatures` and builds the menu dynamically:

```javascript
const enabledFeatures = ['students', 'courses', 'grades'];
// Only these features will appear in the menu
```

### 2. Hierarchical Structure

Features are grouped by category:
- **Base**: Dashboard (always visible)
- **Core**: Students
- **Academic**: Courses, Grades, Attendance, Assignments, Schedule, Behavior
- **General**: Documents, Messages, Library, Events
- **Financial**: Payments
- **System**: Feature Panel (admin only)

### 3. Conditional Rendering

Menu items only appear if:
- Feature is enabled in `enabledFeatures`
- User has permission to see it
- Feature is in the registry

### 4. Smooth Animations

- **Fade In**: Items fade in when appearing
- **Slide In**: Items slide from left (-translate-x-4 → translate-x-0)
- **Stagger**: Items appear with 50ms delay between each
- **Opacity**: Smooth opacity transitions (0 → 1)

### 5. Active Section Highlighting

- Active section has:
  - Primary blue background
  - White text
  - Shadow glow effect
  - Left border indicator

### 6. Real-Time Updates

When features are toggled:
1. `featuresUpdated` event is dispatched
2. `SmartNavigation` listens and updates
3. Menu rebuilds with new features
4. Animations play for new items

---

## How It Works

### Feature State Management

```javascript
// Features are stored in localStorage
localStorage.setItem('enabledFeatures', JSON.stringify(['students', 'courses']));

// Navigation listens for updates
window.addEventListener('featuresUpdated', (event) => {
  // Update menu with new features
  setEnabledFeatures(event.detail.enabledFeatures);
});
```

### Menu Building Logic

1. **Load enabled features** from localStorage
2. **Filter features** by enabled status
3. **Group by category** (core, academic, general, financial)
4. **Sort by order** (defined in registry)
5. **Render with animations**

### Animation System

```javascript
// Items appear with staggered delay
items.map((item, index) => (
  <MenuItem delay={index * 50} /> // 0ms, 50ms, 100ms, etc.
))

// CSS transitions handle the animation
className={`
  transition-all duration-300
  ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
`}
```

---

## Usage

### In DashboardLayout

```jsx
<ResponsiveSidebar
  activeSection={activeSection}
  onSectionChange={handleSectionChange}
>
  <SmartNavigation 
    activeSection={activeSection}
    onSectionChange={handleSectionChange}
  />
</ResponsiveSidebar>
```

### Feature Registry

Features are defined in `SmartNavigation` component:

```javascript
const featureRegistry = {
  students: {
    label: 'Students',
    icon: <Users />,
    category: 'core',
    order: 1,
  },
  // ... more features
};
```

---

## Testing

1. **Enable Features**:
   - Open Feature Panel
   - Toggle features on/off
   - Watch menu update instantly

2. **Check Animations**:
   - Enable a new feature
   - Watch it fade/slide into menu
   - Disable a feature
   - Watch it fade out

3. **Test Active State**:
   - Click different menu items
   - Verify active highlighting
   - Check smooth transitions

4. **Test Hierarchical Structure**:
   - Enable features from different categories
   - Verify they appear in correct sections
   - Check collapsible sections work

---

## Customization

### Add New Feature

1. Add to `featureRegistry`:
```javascript
newFeature: {
  label: 'New Feature',
  icon: <NewIcon />,
  category: 'academic', // or 'core', 'general', 'financial'
  order: 13,
}
```

2. Feature will automatically appear when enabled

### Change Animation Speed

```javascript
// In MenuItem component
delay={index * 50} // Change 50 to adjust stagger speed

// In CSS
transition-all duration-300 // Change 300 to adjust speed
```

### Customize Categories

Edit category names in `MenuSection`:
```javascript
<MenuSection title="Custom Category Name" />
```

---

## Performance

- **Memoized Menu Structure**: Uses `useMemo` to prevent unnecessary recalculations
- **Efficient Updates**: Only updates when features change
- **Smooth Animations**: CSS transitions (hardware accelerated)
- **Minimal Re-renders**: Only affected items re-render

---

**The navigation system is fully functional and ready to use!** 🎉

