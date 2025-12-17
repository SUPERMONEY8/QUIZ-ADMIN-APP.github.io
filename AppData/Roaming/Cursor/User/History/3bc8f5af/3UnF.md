# École de Formation - Responsive Design Guide

## Quick Reference

### Breakpoints
- **xs**: 320px (Mobile - small)
- **sm**: 640px (Mobile - large)
- **md**: 768px (Tablet)
- **lg**: 1024px (Desktop)
- **xl**: 1280px (Desktop - large)
- **2xl**: 1440px (Desktop - wide)

### Mobile-First Approach
Always start with mobile styles, then add larger breakpoint styles:

```jsx
// ✅ Good: Mobile-first
<div className="text-sm md:text-base lg:text-lg">

// ❌ Bad: Desktop-first
<div className="text-lg lg:text-base md:text-sm">
```

## Component Patterns

### 1. Sidebar Navigation
```jsx
// Use ResponsiveSidebar component
<ResponsiveSidebar 
  menuItems={menuItems}
  activeSection={activeSection}
  onSectionChange={handleSectionChange}
/>
```

**Breakpoint Behavior:**
- Mobile: Hidden, hamburger menu
- Tablet+: Always visible

### 2. Tables
```jsx
// Use ResponsiveTable component
<ResponsiveTable 
  columns={columns}
  data={data}
  renderCard={(row) => <CardContent row={row} />}
/>
```

**Breakpoint Behavior:**
- Mobile: Card view
- Desktop: Table view

### 3. Modals
```jsx
// Use ResponsiveModal component
<ResponsiveModal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="md" // sm, md, lg, xl, full
>
  {content}
</ResponsiveModal>
```

**Breakpoint Behavior:**
- Mobile: Full-screen
- Desktop: Centered with max-width

### 4. Forms
```jsx
// Use ResponsiveForm components
<ResponsiveForm onSubmit={handleSubmit}>
  <FormGroup columns={{ mobile: 1, desktop: 2 }}>
    <ResponsiveInput label="First Name" name="firstName" />
    <ResponsiveInput label="Last Name" name="lastName" />
  </FormGroup>
  <ResponsiveButton type="submit" fullWidth>
    Submit
  </ResponsiveButton>
</ResponsiveForm>
```

**Breakpoint Behavior:**
- Mobile: Stacked inputs, full-width buttons
- Desktop: Multi-column, auto-width buttons

## Common Patterns

### Grid Layouts
```jsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items}
</div>
```

### Flexbox Layouts
```jsx
// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">
  {items}
</div>
```

### Visibility
```jsx
// Show/hide based on breakpoint
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

### Spacing
```jsx
// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  <div className="space-y-4 md:space-y-6">
    {content}
  </div>
</div>
```

## Touch-Friendly Guidelines

### Minimum Sizes
- Buttons: 44px × 44px
- Input fields: 44px height
- Menu items: 44px height
- Icons: 24px minimum

### Spacing
- Between touch targets: 8px minimum
- Padding in cards: 16px minimum
- Margins between sections: 24px minimum

## Testing Checklist

### Before Deployment
- [ ] Test on 320px width (iPhone SE)
- [ ] Test on 768px width (iPad)
- [ ] Test on 1024px width (Desktop)
- [ ] Test on 1440px width (Wide desktop)
- [ ] Test landscape orientation
- [ ] Verify touch targets are ≥44px
- [ ] Check text readability
- [ ] Verify no horizontal scroll
- [ ] Test modal interactions
- [ ] Test form submissions

### Device Testing
- iPhone SE (320px)
- iPhone 12/13 (390px)
- iPad (768px)
- iPad Pro (1024px)
- Desktop (1280px+)

## Performance Tips

1. **Use lazy loading for images**
   ```jsx
   <img loading="lazy" src="..." />
   ```

2. **Conditional rendering**
   ```jsx
   {isDesktop && <HeavyComponent />}
   ```

3. **Debounce resize handlers**
   ```jsx
   const debouncedResize = debounce(handleResize, 250);
   ```

4. **Virtual scrolling for long lists**
   ```jsx
   // Use react-window or similar for 100+ items
   ```

## Common Issues & Fixes

### Issue: Horizontal Scroll
**Fix:** Add `overflow-x-hidden` to body or container

### Issue: Text Too Small
**Fix:** Use responsive text classes: `text-sm md:text-base`

### Issue: Buttons Too Small
**Fix:** Add `min-h-[44px] min-w-[44px]`

### Issue: Modal Too Wide
**Fix:** Add max-width constraints: `md:max-w-lg`

### Issue: Table Overflow
**Fix:** Use ResponsiveTable component or add horizontal scroll

## Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev Responsive Design](https://web.dev/responsive-web-design-basics/)

