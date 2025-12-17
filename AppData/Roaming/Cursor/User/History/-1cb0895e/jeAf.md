# Signature Opening Animation Guide

Complete signature opening animation for Step 1 (Names Input) with all interactive effects.

## Features

✅ **Dark Screen with Floating Particles** - Firefly-like glowing dots  
✅ **Heartbeat Sound** - Subtle looping background sound  
✅ **Two Silhouettes** - Male (left) and Female (right)  
✅ **Interactive Glow Effects** - Golden glow for male, rose/pink for female  
✅ **Flying Letters** - Letters animate into silhouettes as user types  
✅ **Hand Reach Animation** - Silhouettes turn and reach toward each other  
✅ **Hand Touch** - Explosion of red/pink sparks  
✅ **Heart Formation** - Single heart forms from connection  
✅ **Logo Transformation** - Heart transforms into app logo  
✅ **Final Message** - "Are you ready to start your journey?" with button  

## File Structure

```
src/onboarding/
├── signature-animation.js    # Main animation class (Canvas-based)
├── signature-integration.js  # Integration with Step 1
└── views.js                  # Updated Step 1 view

src/styles/
└── signature-animation.css   # Animation styles

public/sounds/
├── heartbeat.mp3            # Heartbeat sound (optional)
└── chime.mp3                # Chime sound (optional)
```

## Animation Phases

1. **Particles** (2 seconds) - Floating firefly particles
2. **Silhouettes** - Two silhouettes fade in
3. **Glow** - Silhouettes glow as names are typed
4. **Letters** - Letters fly into silhouettes
5. **Reach** - Hands reach toward each other
6. **Touch** - Hands touch, sparks explode
7. **Heart** - Heart forms at center
8. **Logo** - Heart transforms to logo
9. **Complete** - Final message appears

## How It Works

### Initialization

When Step 1 loads:
1. Signature animation container is created
2. Canvas is initialized for particles
3. Silhouettes appear after 2 seconds
4. Name inputs are positioned over animation

### Interactive Effects

**As User Types:**
- Each letter triggers a flying letter animation
- Silhouette glows intensify based on name length
- Male silhouette glows golden (#FFD700)
- Female silhouette glows rose/pink (#FF69B4)

**When Both Names Are Filled:**
- Hand reach animation triggers (1.5s delay)
- Hands reach toward center
- Touch triggers spark explosion
- Chime sound plays (if available)
- Heart forms at center
- Heart transforms to logo
- Final message appears

### Audio

- **Heartbeat**: Loops continuously (volume 0.1)
- **Chime**: Plays on hand touch (volume 0.3)

Audio files are optional - animation works without them.

## Customization

### Colors

Edit in `signature-animation.js`:
```javascript
// Male glow color
'#FFD700'  // Golden

// Female glow color
'#FF69B4'  // Rose/Pink

// Spark colors
'#FF69B4'  // Pink
'#FF0000'  // Red
```

### Timing

Adjust delays in `signature-integration.js`:
```javascript
setTimeout(() => {
  signatureAnimation.triggerHandReach();
}, 1500); // Delay before hand reach
```

### Particle Count

Edit in `signature-animation.js`:
```javascript
const particleCount = 50; // Number of firefly particles
```

## Mobile Responsive

- Canvas automatically resizes
- Silhouette spacing adjusts (150px desktop, 80px mobile)
- Touch-friendly input positioning
- Optimized particle count for performance

## Performance

- Uses Canvas for efficient particle rendering
- RequestAnimationFrame for smooth 60fps
- Particles wrap around screen edges
- Automatic cleanup on phase completion

## Adding Audio Files

1. Place audio files in `/public/sounds/`:
   - `heartbeat.mp3` - Subtle heartbeat loop
   - `chime.mp3` - Chime on touch

2. Audio will automatically load and play

3. If files are missing, animation works silently

## Testing

1. Run `bun dev`
2. Navigate to Step 1 (onboarding)
3. Watch particles appear
4. Type in name inputs
5. See glow effects and flying letters
6. Complete both names to trigger full sequence

## Troubleshooting

**Animation not showing:**
- Check browser console for errors
- Ensure canvas element is created
- Verify CSS is loaded

**Audio not playing:**
- Check browser autoplay policies
- Audio may require user interaction first
- Verify audio file paths are correct

**Performance issues:**
- Reduce particle count
- Check device capabilities
- Ensure hardware acceleration is enabled

## Next Steps

After animation completes:
- User clicks "Yes, Start Softly"
- Animation fades out
- Step 1 content fades in
- User can continue with onboarding

