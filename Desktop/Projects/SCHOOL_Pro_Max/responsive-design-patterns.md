# École de Formation - Responsive Design Patterns

## Breakpoint System

```javascript
Breakpoints:
- xs:   320px   (Mobile - small)
- sm:   640px   (Mobile - large)
- md:   768px   (Tablet - portrait)
- lg:   1024px  (Tablet - landscape / Desktop)
- xl:   1280px  (Desktop - large)
- 2xl:  1440px  (Desktop - wide)
```

## Core Responsive Patterns

### 1. Mobile-First Approach
Always design for mobile first, then enhance for larger screens:

```jsx
// ❌ Bad: Desktop-first
<div className="grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1">

// ✅ Good: Mobile-first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

### 2. Container Patterns

```jsx
// Standard container with responsive padding
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {content}
</div>

// Full-width container with max-width
<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {content}
</div>
```

### 3. Typography Scaling

```jsx
// Responsive text sizes
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Title
</h1>

<p className="text-sm sm:text-base md:text-lg">
  Body text
</p>
```

### 4. Spacing Patterns

```jsx
// Responsive spacing
<div className="space-y-4 sm:space-y-6 md:space-y-8">
  {items}
</div>

// Responsive padding
<div className="p-4 sm:p-6 md:p-8 lg:p-12">
  Content
</div>
```

### 5. Grid Layouts

```jsx
// Responsive grid columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items}
</div>

// Auto-fit responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
  {items}
</div>
```

### 6. Flexbox Patterns

```jsx
// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">
  {items}
</div>

// Responsive flex direction
<div className="flex flex-col-reverse md:flex-row">
  {items}
</div>
```

## Component-Specific Patterns

### Sidebar Navigation

```jsx
// Mobile: Hidden, toggled via hamburger
// Desktop: Always visible
<aside className={`
  fixed inset-y-0 left-0 z-50
  w-64 bg-dark-900 border-r border-dark-700
  transform transition-transform duration-300 ease-in-out
  ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  md:translate-x-0 md:static md:z-auto
`}>
  {/* Sidebar content */}
</aside>

// Overlay for mobile
{isOpen && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
    onClick={() => setIsOpen(false)}
  />
)}
```

### Responsive Tables

```jsx
// Mobile: Cards, Desktop: Table
<div className="hidden md:block overflow-x-auto">
  <table className="min-w-full">
    {/* Table content */}
  </table>
</div>

<div className="md:hidden space-y-4">
  {data.map(item => (
    <div className="bg-dark-800 rounded-lg p-4">
      {/* Card content */}
    </div>
  ))}
</div>
```

### Modal/Dialog Patterns

```jsx
// Responsive modal sizing
<div className={`
  fixed inset-4 md:inset-auto
  md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
  w-full md:w-full md:max-w-lg lg:max-w-2xl
  bg-dark-800 rounded-lg shadow-xl z-50
  max-h-[calc(100vh-2rem)] overflow-y-auto
`}>
  {/* Modal content */}
</div>
```

### Form Patterns

```jsx
// Responsive form layout
<form className="space-y-4 md:space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input className="w-full" />
    <input className="w-full" />
  </div>
  
  <button className="w-full md:w-auto min-h-[44px]">
    Submit
  </button>
</form>
```

### Touch-Friendly Targets

```jsx
// All interactive elements should be at least 44px
<button className="min-h-[44px] min-w-[44px] px-4 py-2">
  Click me
</button>

// Icon buttons
<button className="h-11 w-11 flex items-center justify-center">
  <Icon />
</button>
```

## Utility Classes

### Responsive Visibility

```jsx
// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">Mobile only</div>

// Show on specific breakpoints
<div className="hidden lg:block xl:hidden">Only on lg</div>
```

### Responsive Images

```jsx
<img 
  src="image.jpg"
  className="w-full h-auto object-cover"
  loading="lazy"
  alt="Description"
/>

// Responsive background images
<div className="bg-cover bg-center bg-no-repeat h-48 md:h-64 lg:h-96">
</div>
```

## Performance Considerations

1. **Lazy Loading**: Use `loading="lazy"` for images
2. **Conditional Rendering**: Only render what's needed for current viewport
3. **CSS Containment**: Use `contain` for isolated components
4. **Virtual Scrolling**: For long lists on mobile

## Testing Checklist

- [ ] Test on 320px width (smallest mobile)
- [ ] Test on 768px width (tablet)
- [ ] Test on 1024px width (desktop)
- [ ] Test on 1440px width (wide desktop)
- [ ] Verify touch targets are ≥44px
- [ ] Check text readability at all sizes
- [ ] Verify no horizontal scrolling
- [ ] Test landscape orientation
- [ ] Test with keyboard navigation
- [ ] Verify modals work on mobile

