# Cursor System Quick Start

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install framer-motion
```

### Step 2: Access Demo Pages
Navigate to `/demo` in your browser to see all motion demos:
- Landing Page: `/demo/landing`
- Dashboard: `/demo/dashboard`
- Form Demo: `/demo/form`
- List Demo: `/demo/list`
- Modal Demo: `/demo/modal`

### Step 3: Use in Your Components

```jsx
import CursorProvider from './components/Cursor/CursorProvider';
import Magnet from './components/Magnet/Magnet';
import GlassCard from './components/ui/GlassCard';

function MyComponent() {
  return (
    <CursorProvider personality="premium-concierge">
      <Magnet strength={0.25}>
        <GlassCard hover>
          Your content here
        </GlassCard>
      </Magnet>
    </CursorProvider>
  );
}
```

## 🎨 Quick Customization

### Change Cursor Feel
```jsx
<CursorProvider 
  personality="calm-clinical"  // or "premium-concierge" | "energetic-assist"
  config={{ damping: 0.15, mass: 0.8 }}  // Override physics
/>
```

### Adjust Magnet Strength
```jsx
<Magnet strength={0.28} radius={160} clamp={12}>
  {/* Your element */}
</Magnet>
```

### Glass Card Variants
```jsx
<GlassCard variant="glow" />  // 'soft' | 'medium' | 'glow'
```

## 📖 Full Documentation

See `CURSOR_SYSTEM_README.md` for complete documentation.

