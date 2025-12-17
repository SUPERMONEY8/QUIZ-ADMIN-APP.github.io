# Excel-like Data Grid Component

A React component focused on **navigation and row management** for spreadsheet-like data grids.

## Features

### ✅ Keyboard Navigation
- **Arrow Keys (↑ ↓ ← →)**: Navigate between cells
- **Tab / Enter**: Move to next cell (wraps to next row)
- **Enter on cell**: Start editing
- **Enter on last cell of last row**: Automatically adds a new row
- **Escape**: Cancel editing
- **Backspace / Delete**: Delete current row (when row is selected)

### ✅ Row Management
- **Add Row**: 
  - Press `Enter` while on the last cell of the last row
  - Click the "➕ Add Row" button below the table
- **Delete Row**:
  - Press `Backspace` or `Delete` when a row is selected
  - Click the 🗑️ icon at the end of any row

### ✅ UX Features
- **Excel-style selection**: Subtle blue border around active cell
- **Smooth transitions**: No lag or jumpy behavior
- **Auto-focus**: New rows automatically focus the first cell
- **Smart focus management**: After deletion, focus moves to previous row
- **Inline editing**: Double-click or press Enter to edit
- **Dynamic row indexing**: Row numbers update automatically

### ✅ Accessibility
- Full ARIA support (roles, labels, selected states)
- Keyboard-only navigation
- Screen reader friendly
- Focus indicators

## Installation

### Option 1: Standalone (Recommended for testing)

```bash
cd frontend
npm install
npm run dev
```

This will start a Vite dev server at `http://localhost:3000`

### Option 2: Integrate into Existing Tauri App

Since your current app uses vanilla JS, you have two options:

#### A. Use React only for the Grid component

1. Install React dependencies:
```bash
cd frontend
npm install react react-dom
npm install --save-dev @vitejs/plugin-react vite
```

2. Build the Grid component separately:
```bash
npm run build
```

3. Import and use in your existing code (you'll need to set up React rendering)

#### B. Convert to React (Full migration)

This would require converting your entire app to React, which is a larger undertaking.

## Usage

```jsx
import React from 'react';
import Grid from './Grid';

function MyApp() {
  const handleCellChange = (row, col, value) => {
    console.log(`Cell [${row}, ${col}] = ${value}`);
  };

  const handleRowAdd = (rowIndex) => {
    console.log(`Row added at index ${rowIndex}`);
  };

  const handleRowDelete = (rowIndex) => {
    console.log(`Row deleted at index ${rowIndex}`);
  };

  return (
    <Grid
      initialRows={5}
      initialCols={5}
      onCellChange={handleCellChange}
      onRowAdd={handleRowAdd}
      onRowDelete={handleRowDelete}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialRows` | `number` | `5` | Initial number of rows |
| `initialCols` | `number` | `5` | Initial number of columns |
| `onCellChange` | `(row, col, value) => void` | `() => {}` | Callback when cell value changes |
| `onRowAdd` | `(rowIndex) => void` | `() => {}` | Callback when row is added |
| `onRowDelete` | `(rowIndex) => void` | `() => {}` | Callback when row is deleted |

## Component Structure

```
Grid.jsx
├── State Management
│   ├── gridData: Cell data array
│   ├── selectedCell: Current selection {row, col}
│   ├── isEditing: Editing state
│   └── editValue: Current edit value
│
├── Navigation Logic
│   ├── navigateToCell(): Move to specific cell
│   ├── focusCell(): Focus and scroll to cell
│   └── handleKeyDown(): Keyboard event handling
│
├── Editing Logic
│   ├── startEditing(): Begin cell edit
│   ├── finishEditing(): Save edit
│   └── cancelEditing(): Cancel edit
│
└── Row Management
    ├── handleAddRow(): Add new row
    └── handleDeleteRow(): Remove row
```

## Key Implementation Details

### Focus Management
- Uses `useRef` to store cell element references
- `scrollIntoView` with `behavior: 'smooth'` for smooth scrolling
- Prevents default browser scrolling with arrow keys

### State Updates
- All state updates use functional updates to avoid stale closures
- `useCallback` for memoized functions to prevent unnecessary re-renders

### Accessibility
- ARIA roles: `grid`, `row`, `gridcell`, `columnheader`, `rowheader`
- `aria-label` and `aria-selected` attributes
- Proper `tabIndex` management
- Keyboard-only navigation support

## Limitations (By Design)

This component focuses **only** on navigation and row management. It does NOT include:
- ❌ Database integration
- ❌ Formula computation
- ❌ Cell formatting
- ❌ Column management
- ❌ Copy/paste
- ❌ Undo/redo
- ❌ Data persistence

## Next Steps

To extend this component:
1. Add column management (similar to row management)
2. Add data persistence (localStorage, API calls)
3. Add formula support
4. Add cell formatting
5. Add copy/paste functionality

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT


