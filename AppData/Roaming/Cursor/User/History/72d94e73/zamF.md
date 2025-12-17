# École de Formation - Responsive Design Checklist

## General Responsiveness

### Layout
- [ ] Container uses responsive padding (`px-4 sm:px-6 lg:px-8`)
- [ ] No horizontal scrolling at any breakpoint
- [ ] Content doesn't overflow viewport
- [ ] Spacing scales appropriately (mobile: smaller, desktop: larger)
- [ ] Grid/flex layouts adapt to screen size

### Typography
- [ ] Font sizes scale appropriately
- [ ] Line heights are readable on mobile
- [ ] Text doesn't overflow containers
- [ ] Headings are properly sized for each breakpoint

### Images & Media
- [ ] Images are responsive (`w-full h-auto`)
- [ ] Images use lazy loading
- [ ] Videos scale properly
- [ ] No images cause horizontal scroll

## Component-Specific Checklist

### Sidebar Navigation
- [ ] Hidden on mobile with hamburger menu
- [ ] Overlay/drawer pattern on mobile
- [ ] Visible on tablet/desktop
- [ ] Collapsible on desktop (optional)
- [ ] Touch-friendly menu items (min 44px height)
- [ ] Smooth animations for open/close

### Top Bar / Header
- [ ] Logo/icon scales appropriately
- [ ] User menu is touch-friendly
- [ ] Notification bell is accessible
- [ ] Search bar adapts (full width on mobile, constrained on desktop)
- [ ] Hamburger menu visible on mobile only

### Tables
- [ ] Horizontal scroll on mobile (if needed)
- [ ] OR convert to cards on mobile
- [ ] Headers remain visible on scroll
- [ ] Touch-friendly row heights
- [ ] Action buttons are properly sized

### Forms
- [ ] Input fields are full-width on mobile
- [ ] Multi-column forms stack on mobile
- [ ] Buttons are full-width on mobile (or properly sized)
- [ ] Labels are readable
- [ ] Error messages are visible
- [ ] Form validation works on all devices

### Modals/Dialogs
- [ ] Full-screen on mobile
- [ ] Centered with max-width on desktop
- [ ] Scrollable content if needed
- [ ] Close button is accessible
- [ ] Backdrop overlay works properly

### Cards
- [ ] Stack vertically on mobile
- [ ] Grid layout on tablet/desktop
- [ ] Consistent spacing between cards
- [ ] Touch-friendly interactive areas
- [ ] Images scale properly

### Buttons
- [ ] Minimum 44px height and width
- [ ] Adequate padding for touch
- [ ] Full-width on mobile (if primary action)
- [ ] Proper spacing between buttons
- [ ] Hover states work on desktop, active states on mobile

### Dashboard Widgets
- [ ] Stats cards stack on mobile
- [ ] 2-column grid on tablet
- [ ] 3-4 column grid on desktop
- [ ] Charts are readable on all sizes
- [ ] Charts may need scroll on mobile

### Search & Filters
- [ ] Search bar is accessible on mobile
- [ ] Filters can be toggled (collapsed on mobile)
- [ ] Filter options are readable
- [ ] Clear filters button is visible

### Data Lists
- [ ] Pagination works on mobile
- [ ] Items per page selector is touch-friendly
- [ ] Empty states are responsive
- [ ] Loading states are visible

## Feature-Specific Checklists

### Student Management
- [ ] Student cards/grid is responsive
- [ ] Add student modal works on mobile
- [ ] Search/filter is accessible
- [ ] Edit/delete actions are touch-friendly

### Course Management
- [ ] Course list adapts to screen size
- [ ] Course cards are readable
- [ ] Form fields stack on mobile

### Grade Tracking
- [ ] Grade input table is scrollable on mobile
- [ ] Grade entry form is usable on mobile
- [ ] Student view is readable

### Attendance
- [ ] Attendance marking interface is touch-friendly
- [ ] Student list is scrollable
- [ ] Quick actions (Mark All) are accessible
- [ ] Calendar view adapts to screen

### Assignments
- [ ] Assignment list is responsive
- [ ] Submission interface works on mobile
- [ ] File upload is touch-friendly

### Documents
- [ ] File list is scrollable
- [ ] Upload area is accessible
- [ ] Folder navigation works

### Payments
- [ ] Invoice table is responsive
- [ ] Payment form is usable
- [ ] Reports are readable

### Communication
- [ ] Message list is scrollable
- [ ] Conversation thread is readable
- [ ] Compose message modal works

### Events
- [ ] Calendar is scrollable on mobile
- [ ] Event cards are readable
- [ ] Event form is usable

### Library
- [ ] Book catalog is responsive
- [ ] Search is accessible
- [ ] Checkout interface works

### Behavior
- [ ] Incident list is responsive
- [ ] Incident form is usable
- [ ] Reports are readable

### Schedule
- [ ] Weekly schedule is scrollable
- [ ] Time slots are readable
- [ ] Schedule form is usable

## Performance & Accessibility

### Performance
- [ ] Images are optimized and lazy-loaded
- [ ] No layout shifts on load
- [ ] Smooth scrolling
- [ ] Fast interactions (<100ms response)

### Accessibility
- [ ] Touch targets are ≥44px
- [ ] Text is readable (minimum 16px on mobile)
- [ ] Sufficient color contrast
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Focus indicators are visible

### Browser Compatibility
- [ ] Works on iOS Safari
- [ ] Works on Chrome Mobile
- [ ] Works on Firefox Mobile
- [ ] Works on desktop browsers

## Testing Checklist

### Device Testing
- [ ] iPhone SE (320px)
- [ ] iPhone 12/13 (390px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1280px+)
- [ ] Wide desktop (1440px+)

### Orientation Testing
- [ ] Portrait mode
- [ ] Landscape mode
- [ ] Rotation doesn't break layout

### Interaction Testing
- [ ] Touch gestures work
- [ ] Swipe actions work (if implemented)
- [ ] Pinch to zoom doesn't break layout
- [ ] Scroll performance is smooth

### Edge Cases
- [ ] Very long text doesn't break layout
- [ ] Empty states are responsive
- [ ] Error states are readable
- [ ] Loading states are visible

## Breakpoint-Specific Checks

### Mobile (320px - 639px)
- [ ] Single column layouts
- [ ] Stacked navigation
- [ ] Full-width buttons
- [ ] Touch-friendly targets
- [ ] Readable font sizes

### Tablet (640px - 1023px)
- [ ] 2-column layouts where appropriate
- [ ] Sidebar visible or collapsible
- [ ] Adjusted spacing
- [ ] Comfortable touch targets

### Desktop (1024px+)
- [ ] Multi-column layouts
- [ ] Sidebar always visible
- [ ] Hover states work
- [ ] Optimal spacing
- [ ] Maximum content width

## Quick Fixes Reference

### Common Issues
1. **Horizontal scroll**: Add `overflow-x-hidden` to body
2. **Text too small**: Use responsive text classes
3. **Buttons too small**: Add `min-h-[44px]`
4. **Spacing issues**: Use responsive spacing utilities
5. **Images overflow**: Add `w-full max-w-full`
6. **Modal too wide**: Add max-width constraints
7. **Table overflow**: Add horizontal scroll container

