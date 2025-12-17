# Design System Documentation

## Overview
Complete CSS design system for the Military Assignment App with RTL support for Arabic language.

## Color Palette

### Primary Colors (Olive Green Military Theme)
- `--primary-dark`: #4E5B31
- `--primary-medium`: #7A8B4D
- `--military-dark`: #556B2F
- `--military-light`: #B8C76F
- `--select-highlight`: #D4E673
- `--vacation-badge`: #6B8E23
- `--forest-green`: #228B22
- `--success-green`: #27ae60
- `--dark-green`: #229954
- `--ok-badge`: #107c10
- `--hover-green`: #0e6b0e

### Background Colors
- `--bg-white`: #FFFFFF
- `--bg-light-gray`: #F5F5F5
- `--bg-very-light`: #f8f9fa
- `--bg-striped`: #fcfcfc
- `--bg-blue-tint`: #fbfcff
- `--bg-page-green`: #E1E8D5
- `--border-pastel-green`: #C2D6A4

### Text Colors
- `--text-dark`: #1E1E1E
- `--text-muted`: #666666
- `--text-gray`: #888
- `--text-blue-gray`: #2c3e50
- `--text-blue`: #1f4e79
- `--text-dark-blue`: #0b2e59

### Danger/Red Colors
- `--danger-red`: #e74c3c
- `--danger-dark`: #c0392b
- `--error-red`: #dc3545
- `--badge-red`: #D13438
- `--hover-red`: #b72d30
- `--bg-red-light`: #ffe5e5
- `--border-red`: #ffd1d1

### Status Colors
- `--status-court`: #C3B091
- `--status-mission`: #81613C
- `--status-training`: #8B7E66
- `--status-escape`: #4d4848
- `--warning-orange`: #FFB900

### Border Colors
- `--border-light`: #e0e0e0
- `--border-gray`: #dee2e6
- `--border-blue`: #cfe6fb

## Typography

### Font Family
```css
font-family: 'Segoe UI', 'Tahoma', 'Arial', sans-serif;
```

### Font Sizes
- `--font-size-xs`: 0.75rem (12px)
- `--font-size-sm`: 0.875rem (14px)
- `--font-size-base`: 1rem (16px)
- `--font-size-lg`: 1.125rem (18px)
- `--font-size-xl`: 1.25rem (20px)
- `--font-size-2xl`: 1.5rem (24px)
- `--font-size-3xl`: 1.875rem (30px)
- `--font-size-4xl`: 2.25rem (36px)

## Spacing System

### Spacing Scale
- `--spacing-xs`: 0.25rem (4px)
- `--spacing-sm`: 0.5rem (8px)
- `--spacing-md`: 1rem (16px)
- `--spacing-lg`: 1.5rem (24px)
- `--spacing-xl`: 2rem (32px)
- `--spacing-2xl`: 3rem (48px)
- `--spacing-3xl`: 4rem (64px)

### Usage Examples
```html
<div class="p-md m-lg">Content with padding and margin</div>
<div class="mt-xl mb-md">Content with top and bottom margins</div>
```

## Utility Classes

### Spacing Utilities
- Margin: `.m-0`, `.m-xs`, `.m-sm`, `.m-md`, `.m-lg`, `.m-xl`, `.m-2xl`, `.m-3xl`
- Margin Top: `.mt-0`, `.mt-xs`, `.mt-sm`, `.mt-md`, `.mt-lg`, `.mt-xl`
- Margin Bottom: `.mb-0`, `.mb-xs`, `.mb-sm`, `.mb-md`, `.mb-lg`, `.mb-xl`
- Margin Right/Left: `.mr-*`, `.ml-*` (RTL-aware)
- Padding: `.p-0`, `.p-xs`, `.p-sm`, `.p-md`, `.p-lg`, `.p-xl`, `.p-2xl`, `.p-3xl`
- Padding Top/Bottom/Right/Left: `.pt-*`, `.pb-*`, `.pr-*`, `.pl-*`

### Text Utilities
- Alignment: `.text-right`, `.text-left`, `.text-center`, `.text-justify`
- Colors: `.text-dark`, `.text-muted`, `.text-gray`, `.text-primary`, `.text-success`, `.text-danger`, `.text-warning`

### Background Utilities
- `.bg-white`, `.bg-light-gray`, `.bg-very-light`, `.bg-page-green`
- `.bg-primary`, `.bg-primary-dark`, `.bg-military-dark`, `.bg-military-light`
- `.bg-success`, `.bg-danger`, `.bg-error`, `.bg-warning`

### Border Utilities
- `.border`, `.border-0`, `.border-top`, `.border-bottom`, `.border-right`, `.border-left`
- Border Colors: `.border-gray`, `.border-blue`, `.border-red`, `.border-pastel-green`, `.border-primary`
- Border Radius: `.border-radius-sm`, `.border-radius-md`, `.border-radius-lg`, `.border-radius-xl`, `.border-radius-full`

### Display Utilities
- `.d-none`, `.d-block`, `.d-inline`, `.d-inline-block`, `.d-flex`, `.d-grid`

### Flexbox Utilities
- Direction: `.flex-row`, `.flex-column`
- Wrap: `.flex-wrap`, `.flex-nowrap`
- Justify: `.justify-start`, `.justify-end`, `.justify-center`, `.justify-between`, `.justify-around`
- Align: `.align-start`, `.align-end`, `.align-center`, `.align-stretch`
- Gap: `.gap-xs`, `.gap-sm`, `.gap-md`, `.gap-lg`, `.gap-xl`

### Shadow Utilities
- `.shadow-sm`, `.shadow-md`, `.shadow-lg`, `.shadow-xl`, `.shadow-none`

## Components

### Badges
```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-danger">Danger</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-vacation">Vacation</span>
<span class="badge badge-ok">OK</span>
<span class="badge badge-status-court">Court</span>
<span class="badge badge-status-mission">Mission</span>
<span class="badge badge-status-training">Training</span>
<span class="badge badge-status-escape">Escape</span>
```

### Buttons
```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-success">Success Button</button>
<button class="btn btn-danger">Danger Button</button>
<button class="btn btn-warning">Warning Button</button>
<button class="btn btn-outline">Outline Button</button>
```

## RTL Support

The design system is fully optimized for RTL (Right-to-Left) layout:

- Base HTML has `dir="rtl"` and `text-align: right`
- All spacing utilities work correctly in RTL context
- Logical properties available: `.margin-inline-start`, `.margin-inline-end`, `.padding-inline-start`, `.padding-inline-end`
- RTL-aware float: `.float-right`, `.float-left`
- Direction utilities: `.dir-rtl`, `.dir-ltr`

## Responsive Breakpoints

- **Small (sm)**: 576px and up
- **Medium (md)**: 768px and up
- **Large (lg)**: 992px and up
- **Extra Large (xl)**: 1200px and up
- **Extra Extra Large (xxl)**: 1400px and up

### Responsive Utilities
```html
<div class="d-md-none">Hidden on medium screens</div>
<div class="d-lg-flex">Flex on large screens</div>
```

## Usage

### Import in your CSS
```css
@import url('./design-system.css');
```

### Or link in HTML
```html
<link rel="stylesheet" href="src/styles/design-system.css">
```

## Examples

### Card Component
```html
<div class="bg-white border border-radius-lg p-lg shadow-md">
  <h3 class="text-primary mb-md">Card Title</h3>
  <p class="text-muted">Card content goes here</p>
</div>
```

### Flexbox Layout
```html
<div class="d-flex justify-between align-center gap-md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Status Badge with Button
```html
<div class="d-flex align-center gap-sm">
  <span class="badge badge-status-mission">Mission</span>
  <button class="btn btn-primary">Action</button>
</div>
```

