# Components Usage Guide

## Buttons

### Primary Button (Olive Green)
```html
<button class="btn btn-primary">حفظ</button>
```
- Background: `#4E5B31` (--primary-dark)
- Hover: `#0e6b0e` (--hover-green)
- White text, rounded corners

### Danger Button (Red)
```html
<button class="btn btn-danger">حذف</button>
```
- Background: `#e74c3c` (--danger-red)
- Hover: `#c0392b` (--danger-dark)

### Secondary Button (Gray)
```html
<button class="btn btn-secondary">إلغاء</button>
```

### Success Button (Green)
```html
<button class="btn btn-success">موافق</button>
```
- Background: `#27ae60` (--success-green)

### Button Sizes
```html
<button class="btn btn-primary btn-sm">صغير</button>
<button class="btn btn-primary">عادي</button>
<button class="btn btn-primary btn-lg">كبير</button>
```

## Tables

### Basic Table
```html
<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        <th>الاسم</th>
        <th>الحالة</th>
        <th>الإجراءات</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>محمد أحمد</td>
        <td>نشط</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-primary">تعديل</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### X Marker in Table
```html
<td>
  <span class="x-marker">X</span>
</td>
```
- Green background: `#D4E673` (--select-highlight)

## Forms

### Input Field
```html
<div class="form-group">
  <label class="form-label" for="name">الاسم</label>
  <input type="text" id="name" class="form-input" placeholder="أدخل الاسم">
</div>
```

### Required Field
```html
<label class="form-label required" for="email">البريد الإلكتروني</label>
```

### Select Dropdown
```html
<div class="form-group">
  <label class="form-label" for="status">الحالة</label>
  <select id="status" class="form-select">
    <option value="active">نشط</option>
    <option value="inactive">غير نشط</option>
  </select>
</div>
```

### Textarea
```html
<div class="form-group">
  <label class="form-label" for="description">الوصف</label>
  <textarea id="description" class="form-textarea" rows="4"></textarea>
</div>
```

### Checkbox
```html
<div class="form-checkbox-wrapper">
  <input type="checkbox" id="agree" class="form-checkbox">
  <label for="agree" class="form-checkbox-label">أوافق على الشروط</label>
</div>
```
- Custom olive green style when checked

### Radio Button
```html
<div class="form-checkbox-wrapper">
  <input type="radio" id="option1" name="options" class="form-radio">
  <label for="option1" class="form-checkbox-label">الخيار الأول</label>
</div>
```

### Form Help Text
```html
<span class="form-help">هذا نص مساعد</span>
```

### Form Error
```html
<span class="form-error">هذا الحقل مطلوب</span>
```

### Form Actions
```html
<div class="form-actions">
  <button type="submit" class="btn btn-primary">حفظ</button>
  <button type="button" class="btn btn-secondary">إلغاء</button>
</div>
```

## Cards

### Basic Card
```html
<div class="card">
  <h3>عنوان البطاقة</h3>
  <p>محتوى البطاقة</p>
</div>
```

### Dashboard Stat Card
```html
<div class="card-stat">
  <div class="card-stat-title">إجمالي المهام</div>
  <div class="card-stat-value">125</div>
  <div class="card-stat-change">+12 هذا الشهر</div>
</div>
```

### Group Info Card
```html
<div class="card-group card-border-primary">
  <div class="card-group-header">
    <h3 class="card-group-title">مجموعة DCC</h3>
  </div>
  <div class="card-group-body">
    <p>معلومات المجموعة</p>
  </div>
</div>
```

### Card Border Colors
```html
<div class="card-group card-border-primary">Primary</div>
<div class="card-group card-border-success">Success</div>
<div class="card-group card-border-danger">Danger</div>
<div class="card-group card-border-warning">Warning</div>
```

## Badges

### Status Badges (Group Specific)
```html
<span class="badge badge-dcc">DCC</span>
<span class="badge badge-sante">Santé</span>
<span class="badge badge-cook">Cook</span>
<span class="badge badge-drive">Drive</span>
<span class="badge badge-officier">Officier</span>
```

### X Assignment Badge
```html
<span class="badge badge-x-assignment">X</span>
```
- Background: `#D4E673` (--select-highlight)

### Standard Badges
```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-danger">Danger</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-info">Info</span>
```

### Badge Sizes
```html
<span class="badge badge-sm">صغير</span>
<span class="badge">عادي</span>
<span class="badge badge-lg">كبير</span>
```

## Navigation - Sidebar

### Sidebar Structure
```html
<aside class="sidebar">
  <div class="sidebar-header">
    <h2 class="sidebar-title">القائمة</h2>
  </div>
  <nav>
    <ul class="sidebar-nav">
      <li class="sidebar-nav-item">
        <a href="#" class="sidebar-nav-link active">
          <span class="sidebar-nav-icon">🏠</span>
          <span class="sidebar-nav-text">الرئيسية</span>
        </a>
      </li>
      <li class="sidebar-nav-item">
        <a href="#" class="sidebar-nav-link">
          <span class="sidebar-nav-icon">📋</span>
          <span class="sidebar-nav-text">المهام</span>
        </a>
      </li>
    </ul>
  </nav>
  <div class="sidebar-footer">
    <p>Footer content</p>
  </div>
</aside>
```

### Active State
- Add `active` class to `sidebar-nav-link` for active state
- Active link has highlight border and background

## Modals

### Basic Modal
```html
<div class="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">عنوان النافذة</h2>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <p>محتوى النافذة</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">إلغاء</button>
      <button class="btn btn-primary">حفظ</button>
    </div>
  </div>
</div>
```

### Modal Sizes
```html
<div class="modal modal-sm">Small Modal</div>
<div class="modal">Default Modal</div>
<div class="modal modal-lg">Large Modal</div>
<div class="modal modal-xl">Extra Large Modal</div>
```

## Utility Components

### Loading State
```html
<div class="loading">
  Content that is loading...
</div>
```

### Empty State
```html
<div class="empty-state">
  <div class="empty-state-icon">📭</div>
  <h3 class="empty-state-title">لا توجد بيانات</h3>
  <p class="empty-state-text">لم يتم العثور على أي سجلات</p>
</div>
```

## RTL Support

All components are fully RTL-aware:
- Text alignment: Right by default
- Direction: RTL for Arabic content
- Spacing: Logical properties used
- Icons: Positioned correctly for RTL
- Forms: Right-aligned inputs and labels

## Responsive Behavior

- **Mobile (< 768px)**:
  - Sidebar becomes full-width overlay
  - Modals take full width with margins
  - Form actions stack vertically
  - Table font size reduced

- **Desktop (≥ 768px)**:
  - Sidebar fixed position
  - Modals centered with max-width
  - Form actions horizontal
  - Full table styling

