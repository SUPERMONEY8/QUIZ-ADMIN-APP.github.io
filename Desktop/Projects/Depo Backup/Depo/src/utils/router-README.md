# Router Documentation

A vanilla JavaScript router with hash-based navigation for the Depo Business Management System.

## Features

✅ **Hash-based Navigation** - Uses URL hash (#/dashboard, #/inventory, etc.)  
✅ **No Page Reload** - Smooth navigation without refreshing  
✅ **Dynamic Component Loading** - Load components on demand  
✅ **Browser History** - Full back/forward button support  
✅ **Route Parameters** - Support for `/product/:id` style routes  
✅ **Query Parameters** - Support for `?key=value` query strings  
✅ **Loading States** - Visual feedback during navigation  
✅ **404 Handling** - Automatic 404 page for unknown routes  
✅ **Sidebar Integration** - Automatically updates active nav items  
✅ **Smooth Transitions** - Fade in/out animations between pages  

## Usage

### Basic Navigation

```javascript
// Navigate to a route
router.navigate('/dashboard');
router.navigate('/inventory');
router.navigate('/sales');

// Navigate with parameters
router.navigate('/product/123');
router.navigate('/customer/456');

// Navigate with query parameters
router.navigate('/products', {}, { query: { category: 'electronics', page: 1 } });

// Navigate by route name
router.navigateByName('dashboard');
router.navigateByName('product-detail', { id: 123 });
```

### Registering Routes

```javascript
// Simple route
router.route('/dashboard', null, { name: 'dashboard' });

// Route with handler
router.route('/products', async (context) => {
  const { params, query } = context;
  console.log('Loading products page', query);
  // Load data, update UI, etc.
}, { name: 'products' });

// Route with parameters
router.route('/product/:id', async (context) => {
  const { params } = context;
  console.log('Product ID:', params.id);
  // Load product details
}, { name: 'product-detail' });

// Route with beforeEnter hook
router.route('/settings', null, {
  name: 'settings',
  beforeEnter: async (route, previousRoute) => {
    // Check authentication, permissions, etc.
    if (!isAuthenticated()) {
      router.navigate('/login');
      return false; // Prevent navigation
    }
    return true; // Allow navigation
  }
});
```

### Route Hooks

```javascript
// Before entering a route
router.route('/admin', null, {
  beforeEnter: async (route, previousRoute) => {
    // Check permissions
    if (!hasAdminAccess()) {
      router.navigate('/dashboard');
      return false;
    }
    return true;
  }
});

// Before leaving a route
router.route('/form', null, {
  beforeLeave: (currentRoute, nextRoute) => {
    // Check if form has unsaved changes
    if (hasUnsavedChanges()) {
      return confirm('You have unsaved changes. Are you sure you want to leave?');
    }
    return true;
  }
});
```

### Getting Current Route

```javascript
// Get current route information
const current = router.getCurrentRoute();
console.log(current.path);      // '/dashboard'
console.log(current.params);    // {}
console.log(current.query);     // { category: 'electronics' }
console.log(current.route);     // Route config object
```

### Browser History

```javascript
// Go back
router.back();

// Go forward
router.forward();

// Get history
console.log(router.history);
```

### Loading States

The router automatically shows a loading indicator during navigation. You can also manually control it:

```javascript
router.setLoading(true);  // Show loader
router.setLoading(false); // Hide loader
```

## Route Configuration

### Route Options

```javascript
router.route(path, handler, {
  name: 'route-name',              // Unique route name
  meta: {                          // Custom metadata
    title: 'Page Title',
    requiresAuth: true
  },
  requiresAuth: false,             // Require authentication
  component: './components/Page',  // Component to load
  beforeEnter: async (route, prev) => {},  // Before enter hook
  beforeLeave: (current, next) => {}       // Before leave hook
});
```

## Default Routes

The router comes with these pre-configured routes:

- `/` → Redirects to `/dashboard`
- `/dashboard`
- `/inventory`
- `/suppliers`
- `/purchases`
- `/sales`
- `/customers`
- `/payments`
- `/reports`
- `/users`
- `/settings`
- `/product/:id` - Product detail page
- `/customer/:id` - Customer detail page
- `/sale/:id` - Sale detail page
- `/purchase/:id` - Purchase detail page

## 404 Handling

Unknown routes automatically show a 404 page with:
- Error message
- Requested path display
- Button to return to dashboard

## Integration with Sidebar

The router automatically:
- Updates active navigation items
- Sets `aria-current="page"` on active nav
- Removes active state from other nav items

## Examples

### Navigate to Product Detail

```javascript
// In your product list component
function showProduct(productId) {
  router.navigate(`/product/${productId}`);
}

// Or use route name
router.navigateByName('product-detail', { id: productId });
```

### Navigate with Query Parameters

```javascript
// Filter products
router.navigate('/inventory', {}, {
  query: {
    category: 'electronics',
    minPrice: 100,
    maxPrice: 1000
  }
});

// Access in route handler
router.route('/inventory', async (context) => {
  const { query } = context;
  console.log(query.category);  // 'electronics'
  console.log(query.minPrice);  // '100'
});
```

### Protected Route

```javascript
router.route('/admin', null, {
  name: 'admin',
  beforeEnter: async (route, previousRoute) => {
    const user = await getCurrentUser();
    if (user.role !== 'admin') {
      router.navigate('/dashboard');
      return false;
    }
    return true;
  }
});
```

### Form with Unsaved Changes Warning

```javascript
let formDirty = false;

router.route('/product/edit/:id', null, {
  beforeLeave: (currentRoute, nextRoute) => {
    if (formDirty) {
      return confirm('You have unsaved changes. Leave anyway?');
    }
    return true;
  }
});
```

## API Reference

### Methods

- `router.route(path, handler, options)` - Register a route
- `router.navigate(path, params, options)` - Navigate to a route
- `router.navigateByName(name, params, options)` - Navigate by route name
- `router.back()` - Go back in history
- `router.forward()` - Go forward in history
- `router.getCurrentRoute()` - Get current route info
- `router.getRouteByName(name)` - Get route by name
- `router.setLoading(loading)` - Set loading state
- `router.destroy()` - Destroy router and cleanup

### Properties

- `router.routes` - Map of all registered routes
- `router.currentRoute` - Current route configuration
- `router.currentParams` - Current route parameters
- `router.history` - Navigation history array

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- Hash-based routing
- History API

## Notes

- The router uses hash-based navigation (`#/path`) for compatibility
- All navigation is handled without page reloads
- Browser back/forward buttons work automatically
- URL updates reflect current route
- Active navigation items update automatically

