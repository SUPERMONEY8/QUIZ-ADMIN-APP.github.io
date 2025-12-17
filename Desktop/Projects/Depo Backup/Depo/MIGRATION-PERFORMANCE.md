# Performance Optimization Migration Guide

This guide helps you migrate existing code to use the new performance utilities.

## 🔄 Replacing Local Debounce Functions

### Before (Local debounce in each file)
```javascript
// src/pages/products.js
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

searchInput.addEventListener('input', debounce((e) => {
  handleSearch(e.target.value);
}, 300));
```

### After (Using performance utility)
```javascript
// src/pages/products.js
import { debounce } from '../utils/performance.js';

searchInput.addEventListener('input', debounce((e) => {
  handleSearch(e.target.value);
}, 300));
```

**Files to update:**
- `src/pages/products.js` (line 901)
- `src/pages/sales.js` (line 1454)
- `src/pages/customers.js` (line 957)
- `src/pages/purchases.js` (line 555)
- `src/pages/suppliers.js` (line 650)

## 🖼️ Adding Lazy Image Loading

### Before
```html
<img src="/images/product.jpg" alt="Product">
```

### After
```html
<img data-src="/images/product.jpg" alt="Product" class="lazy-loading">
```

**Files to update:**
- `src/pages/products.js` - Product table images
- `src/pages/customers.js` - Customer avatars (if any)
- Any component rendering product images

## 📜 Implementing Virtual Scrolling

### Before (Rendering all items)
```javascript
function renderTable(items) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.price}</td>
    </tr>
  `).join('');
}
```

### After (Virtual scrolling for large lists)
```javascript
import { VirtualScroller } from '../utils/performance.js';

let scroller = null;

function renderTable(items) {
  const container = document.getElementById('tableContainer');
  
  // Use virtual scrolling for lists > 100 items
  if (items.length > 100) {
    if (!scroller) {
      scroller = new VirtualScroller(
        container,
        items,
        50, // row height
        (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.price}</td>
          </tr>
        `
      );
    } else {
      scroller.setItems(items);
    }
  } else {
    // Small lists: render normally
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.price}</td>
      </tr>
    `).join('');
  }
}
```

**Files to update:**
- `src/pages/products.js` - Products table
- `src/pages/reports.js` - Reports table
- `src/pages/customers.js` - Customers list
- `src/pages/sales.js` - Sales history

## 🎯 Using Event Delegation

### Before (Individual event listeners)
```javascript
document.querySelectorAll('.btn-edit').forEach(btn => {
  btn.addEventListener('click', () => {
    handleEdit(btn.dataset.id);
  });
});

document.querySelectorAll('.btn-delete').forEach(btn => {
  btn.addEventListener('click', () => {
    handleDelete(btn.dataset.id);
  });
});
```

### After (Event delegation)
```javascript
import { eventDelegator } from '../utils/performance.js';

// Single event listener for all action buttons
eventDelegator.on('[data-action]', (event, target) => {
  const action = target.dataset.action;
  const id = target.dataset.id;
  
  if (action === 'edit') {
    handleEdit(id);
  } else if (action === 'delete') {
    handleDelete(id);
  }
});
```

**HTML Update:**
```html
<button data-action="edit" data-id="${item.id}">Edit</button>
<button data-action="delete" data-id="${item.id}">Delete</button>
```

## 💾 Adding Response Caching

### Before
```javascript
async function loadProducts() {
  const products = await fetch('/api/products').then(r => r.json());
  return products;
}
```

### After
```javascript
import { responseCache } from '../utils/performance.js';

async function loadProducts(category = 'all') {
  const cacheKey = `products:${category}`;
  
  // Check cache
  let products = responseCache.get(cacheKey);
  if (products) {
    return products;
  }
  
  // Fetch and cache
  products = await fetch(`/api/products?category=${category}`)
    .then(r => r.json());
  responseCache.set(cacheKey, products);
  
  return products;
}
```

## 📊 Adding Performance Monitoring

### Before
```javascript
function renderTable() {
  // ... rendering code
}
```

### After
```javascript
import { performanceMonitor } from '../utils/performance.js';

function renderTable() {
  performanceMonitor.startMeasure('renderTable');
  
  // ... rendering code
  
  const duration = performanceMonitor.endMeasure('renderTable');
  if (duration > 100) {
    console.warn(`Slow render: ${duration}ms`);
  }
}
```

## 🚀 Batch DOM Updates

### Before
```javascript
function renderItems(items) {
  const container = document.getElementById('container');
  items.forEach(item => {
    const div = document.createElement('div');
    div.textContent = item.name;
    container.appendChild(div);
  });
}
```

### After
```javascript
import { DOMBatcher } from '../utils/performance.js';

function renderItems(items) {
  const container = document.getElementById('container');
  const batcher = new DOMBatcher();
  
  items.forEach(item => {
    batcher.add(`<div>${item.name}</div>`);
  });
  
  batcher.appendTo(container);
}
```

## 📝 Step-by-Step Migration

1. **Replace debounce functions** (5 files)
   - Remove local `debounce()` functions
   - Import from `performance.js`

2. **Add lazy image loading** (3-5 files)
   - Change `src` to `data-src`
   - Add `lazy-loading` class

3. **Implement virtual scrolling** (4 files)
   - Identify lists with > 100 items
   - Replace rendering with VirtualScroller

4. **Add event delegation** (All pages)
   - Replace individual listeners
   - Use eventDelegator

5. **Add caching** (API calls)
   - Wrap fetch calls with cache
   - Set appropriate cache keys

6. **Add performance monitoring** (Critical paths)
   - Measure render times
   - Monitor memory usage

## ✅ Quick Checklist

- [ ] Replace all local debounce functions
- [ ] Add lazy loading to all images
- [ ] Implement virtual scrolling for large lists
- [ ] Convert to event delegation
- [ ] Add response caching
- [ ] Add performance monitoring
- [ ] Test all functionality
- [ ] Run performance benchmarks

## 🧪 Testing Performance

After migration, test performance:

```javascript
// Open performance dashboard
import performanceDashboard from './src/components/PerformanceDashboard.js';
performanceDashboard.show();

// Or use keyboard shortcut: Ctrl+Shift+P
```

Check:
- Render times < 100ms
- Memory usage stable
- No memory leaks
- Smooth scrolling
- Fast search responses

