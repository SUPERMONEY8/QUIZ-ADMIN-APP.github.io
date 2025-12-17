# Medical Premium Cursor System & Motion Design

A production-ready React cursor system with physics-based animations, magnet effects, and glassmorphism design. Built for medical premium applications with three distinct motion personalities.

## 🎯 Features

- **Physics-Based Cursor**: Smooth, floating target with configurable damping & mass
- **Two-Layer Cursor**: Precise pointer + pulsing halo
- **Magnet Effect**: Interactive elements attract cursor with spring physics
- **Glassmorphism UI**: White-first design with soft gradients and teal accents
- **Motion Personalities**: 3 distinct styles (Calm Clinical, Premium Concierge, Energetic Assist)
- **Page-Level Presets**: Adaptive motion per route type
- **Accessibility**: Respects `prefers-reduced-motion`, keyboard navigation, touch fallback
- **Performance**: Optimized with `requestAnimationFrame`, `will-change`, and transform-only animations

## 📦 Installation

```bash
npm install framer-motion
```

The cursor system is already integrated into your project. All components are in:
- `src/components/Cursor/` - Cursor system
- `src/components/Magnet/` - Magnet effect
- `src/components/ui/` - Reusable UI components
- `src/hooks/` - Custom hooks
- `src/utils/tokens.js` - Design tokens

## 🚀 Quick Start

### 1. Wrap Your App with CursorProvider

```jsx
import CursorProvider from './components/Cursor/CursorProvider';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <CursorProvider personality="premium-concierge">
      <BrowserRouter>
        {/* Your routes */}
      </BrowserRouter>
    </CursorProvider>
  );
}
```

### 2. Use Magnet Effect

```jsx
import Magnet from './components/Magnet/Magnet';
import MotionButton from './components/ui/MotionButton';

<Magnet strength={0.25} radius={140}>
  <MotionButton variant="primary">
    Click Me
  </MotionButton>
</Magnet>
```

### 3. Use Glass Cards

```jsx
import GlassCard from './components/ui/GlassCard';

<GlassCard hover variant="glow">
  <h2>Card Title</h2>
  <p>Card content</p>
</GlassCard>
```

## 🎨 Motion Personalities

### Calm Clinical
- **Use Case**: Dashboards, forms, data-heavy pages
- **Feel**: Minimal motion, precise, medical trust
- **Settings**: Higher damping (0.2), heavier mass (1.0), smaller halo (35px)

### Premium Concierge
- **Use Case**: Landing pages, hero sections, premium features
- **Feel**: Smooth, luxurious, reassuring
- **Settings**: Lower damping (0.12), medium mass (0.9), larger halo (50px)

### Energetic Assist
- **Use Case**: Lists, search results, interactive tools
- **Feel**: Responsive, quick, engaging
- **Settings**: Medium damping (0.18), lighter mass (0.7), medium halo (45px)

## 📐 Tuning Guide

### Cursor Physics

| Parameter | Range | Default | Effect |
|-----------|-------|---------|--------|
| `damping` | 0.1 - 0.3 | 0.15 | Lower = more lag, smoother |
| `mass` | 0.5 - 1.2 | 0.8 | Higher = heavier, slower response |
| `haloSize` | 30 - 60px | 40px | Base size of cursor halo |

**Recommended Values:**
- **Smooth & Floaty**: `damping: 0.12, mass: 0.9`
- **Precise & Quick**: `damping: 0.2, mass: 0.7`
- **Heavy & Deliberate**: `damping: 0.15, mass: 1.1`

### Magnet Effect

| Parameter | Range | Default | Effect |
|-----------|-------|---------|--------|
| `strength` | 0.1 - 0.4 | 0.22 | Pull strength (higher = stronger) |
| `radius` | 80 - 200px | 140px | Attraction radius |
| `clamp` | 5 - 20px | 12px | Max element movement |

**Recommended Values:**
- **Subtle**: `strength: 0.18, radius: 120, clamp: 8`
- **Moderate**: `strength: 0.22, radius: 140, clamp: 12`
- **Strong**: `strength: 0.28, radius: 160, clamp: 16`

## 🧩 Components

### CursorProvider

```jsx
<CursorProvider 
  enabled={true}
  personality="premium-concierge"
  config={{ damping: 0.15, mass: 0.8 }}
>
  {children}
</CursorProvider>
```

**Props:**
- `enabled` (boolean): Enable/disable cursor
- `personality` (string): Motion personality preset
- `config` (object): Override cursor physics

### useCursor Hook

```jsx
const { 
  enabled, 
  setEnabled, 
  setCursorType, 
  position, 
  targetPosition 
} = useCursor();

// Change cursor type on hover
onMouseEnter={() => setCursorType('hover')}
onMouseLeave={() => setCursorType('default')}
```

### Magnet Component

```jsx
<Magnet strength={0.25} radius={140} clamp={12}>
  <YourComponent />
</Magnet>
```

**Props:**
- `strength` (number): Pull strength (0.1-0.4)
- `radius` (number): Attraction radius in px
- `clamp` (number): Max element movement in px

### GlassCard

```jsx
<GlassCard 
  hover={true}
  variant="glow" // 'soft' | 'medium' | 'glow'
  className="custom-class"
>
  Content
</GlassCard>
```

### MotionButton

```jsx
<MotionButton
  variant="primary" // 'primary' | 'secondary' | 'ghost'
  magnet={true}
  onClick={handleClick}
>
  Button Text
</MotionButton>
```

### MotionInput

```jsx
<MotionInput
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

## 🎬 Micro-Animations

### 1. Button Hover

```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
>
  Click Me
</motion.button>
```

### 2. Input Focus

```jsx
<MotionInput
  label="Email"
  // Automatically handles focus animations
/>
```

### 3. Card Lift

```jsx
<GlassCard
  hover
  motionProps={{
    whileHover: { y: -4, scale: 1.02 }
  }}
>
  Card Content
</GlassCard>
```

### 4. List Item Enter

```jsx
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
>
  List Item
</motion.div>
```

### 5. Modal Open

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.8, x: clickX, y: clickY }}
  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
>
  Modal Content
</motion.div>
```

## 🎨 Tailwind Utilities

### Glassmorphism Classes

```css
.glass-card          /* Base glass card */
.glass-card-hover    /* Glass card with hover */
.glass-overlay       /* Backdrop overlay */
```

### Custom Colors

```jsx
className="bg-glass-white"
className="border-glass-border"
className="text-teal-400"
```

### Custom Shadows

```jsx
className="shadow-glass-soft"
className="shadow-glass-medium"
className="shadow-glass-glow"
className="shadow-teal-glow"
```

## 📱 Demo Pages

### Landing Page (`/landing`)
- Premium Concierge personality
- Hero section with parallax
- Orbiting background particles
- Magnetic buttons

### Dashboard (`/dashboard`)
- Calm Clinical personality
- Metric cards with magnet effect
- Subtle chart animations

### Form Demo (`/form`)
- Calm Clinical personality
- Focus-first input animations
- Smooth transitions

### List Demo (`/list`)
- Energetic Assist personality
- Staggered list item entrances
- Magnetic list items
- Search functionality

### Modal Demo (`/modal`)
- Premium Concierge personality
- Scale-in from click position
- Glass blur backdrop

## ♿ Accessibility

### Reduced Motion

The system automatically respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations disabled */
}
```

### Keyboard Navigation

- All interactive elements have focus outlines
- Tab navigation works smoothly
- Cursor is hidden on keyboard use

### Touch Devices

- Cursor automatically disabled on touch devices
- Touch-specific affordances (ripples, focus outlines) enabled
- All interactions remain functional

## 🚀 Performance

### Optimizations

1. **Transform-only animations**: Uses `transform` and `opacity` only
2. **will-change**: Applied strategically to animated elements
3. **requestAnimationFrame**: Used for cursor physics loop
4. **Passive listeners**: Pointer events use passive listeners
5. **Throttled updates**: State updates are throttled for performance

### Performance Checklist

- ✅ Use `transform` instead of `top/left`
- ✅ Apply `will-change: transform` to animated elements
- ✅ Throttle expensive calculations
- ✅ Use `requestAnimationFrame` for animations
- ✅ Lazy-load heavy effects
- ✅ Disable cursor on low-power devices

## 🧪 Testing

### Desktop Testing
- [ ] Cursor follows mouse smoothly
- [ ] Magnet effect works on hover
- [ ] All animations are smooth (60fps)
- [ ] No layout thrashing
- [ ] Keyboard navigation works

### Mobile Testing
- [ ] Cursor is hidden
- [ ] Touch interactions work
- [ ] No performance issues
- [ ] Reduced motion respected

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] All animations work consistently

### Performance Testing
- [ ] Lighthouse score > 90
- [ ] No janky animations
- [ ] Smooth scrolling
- [ ] Fast page loads

## 🎛️ Customization

### Change Theme Colors

Edit `src/utils/tokens.js`:

```js
colors: {
  teal: {
    primary: '#14b8a6', // Change this
    accent: '#2dd4bf',
  },
}
```

### Adjust Motion Personality

```js
personalities: {
  'your-personality': {
    name: 'Your Style',
    cursor: { damping: 0.15, mass: 0.8 },
    magnet: { strength: 0.22, radius: 140 },
  },
}
```

### Override Per Component

```jsx
<CursorProvider 
  personality="premium-concierge"
  config={{ damping: 0.1, mass: 1.0 }} // Override
>
```

## 📚 API Reference

### CursorProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable cursor |
| `personality` | string | `'premium-concierge'` | Motion personality |
| `config` | object | `{}` | Override cursor config |

### Magnet Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `strength` | number | `0.22` | Pull strength (0.1-0.4) |
| `radius` | number | `140` | Attraction radius (px) |
| `clamp` | number | `12` | Max element movement (px) |

## 🐛 Troubleshooting

### Cursor not appearing
- Check if `enabled` is `true`
- Verify not on touch device
- Check `prefers-reduced-motion` setting

### Magnet effect not working
- Ensure element is inside `CursorProvider`
- Check `strength` and `radius` values
- Verify element is hoverable

### Performance issues
- Reduce number of magnet elements
- Lower animation complexity
- Check for layout thrashing
- Disable cursor on low-power devices

## 📝 License

Part of the Quiz App Admin project.

## 🤝 Contributing

When adding new motion effects:
1. Keep physics calculations in `tokens.js`
2. Use `transform` only for animations
3. Respect `prefers-reduced-motion`
4. Test on multiple devices
5. Document tuning parameters

---

**Built with ❤️ for medical premium applications**

