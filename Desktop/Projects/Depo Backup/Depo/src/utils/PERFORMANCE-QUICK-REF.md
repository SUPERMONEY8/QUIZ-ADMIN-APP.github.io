# Performance Utilities Quick Reference

## Import
```javascript
import {
  debounce,
  throttle,
  VirtualScroller,
  lazyImageLoader,
  responseCache,
  performanceMonitor,
  eventDelegator,
  DOMBatcher,
  updateHTML,
  preloadResource
} from './performance.js';
```

## Common Patterns

### 1. Debounced Search (300ms)
```javascript
searchInput.addEventListener('input', debounce((e) => {
  handleSearch(e.target.value);
}, 300));
```

### 2. Virtual Scrolling
```javascript
const scroller = new VirtualScroller(
  container,
  items,
  50, // item height
  (item) => `<div>${item.name}</div>`
);
```

### 3. Lazy Load Image
```html
<img data-src="/path/to/image.jpg" alt="Description">
```

### 4. Event Delegation
```javascript
eventDelegator.on('[data-action]', (event, target) => {
  const action = target.dataset.action;
  handleAction(action);
});
```

### 5. Cache API Response
```javascript
let data = responseCache.get(key);
if (!data) {
  data = await fetchData();
  responseCache.set(key, data);
}
```

### 6. Batch DOM Updates
```javascript
const batcher = new DOMBatcher();
items.forEach(item => batcher.add(`<div>${item}</div>`));
batcher.appendTo(container);
```

### 7. Performance Monitoring
```javascript
performanceMonitor.startMeasure('render');
render();
const duration = performanceMonitor.endMeasure('render');
```

### 8. Preload Resource
```javascript
preloadResource('/src/pages/dashboard.js', 'script');
```

## Keyboard Shortcuts

- **Ctrl+Shift+P**: Open/Close Performance Dashboard

## Performance Dashboard

```javascript
import performanceDashboard from '../components/PerformanceDashboard.js';

// Show dashboard
performanceDashboard.show();

// Hide dashboard
performanceDashboard.hide();
```

