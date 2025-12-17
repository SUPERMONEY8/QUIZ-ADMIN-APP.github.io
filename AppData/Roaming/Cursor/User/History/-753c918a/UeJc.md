# Onboarding Flow Guide

Complete onboarding system for the Couple Action App with 3 steps, state management, Firebase integration, and LocalStorage backup.

## Features

✅ **3-Step Onboarding Flow:**
1. **Names** - Enter partner names with magical animations
2. **Preferred Days** - Select days for playing
3. **Sound & Music Setup** - Configure audio preferences

✅ **State Management** - Simple JS object with getters/setters

✅ **Navigation Functions** - `nextStep()`, `prevStep()`, `skipStep()`

✅ **Firebase Integration** - Saves data to Firestore after completion

✅ **LocalStorage Backup** - Automatic backup in case of sync issues

✅ **Magical Animations** - Text reveal, floating particles, sparkle effects

## File Structure

```
src/onboarding/
├── state.js          # State management (getState, updateState, etc.)
├── views.js          # Step rendering functions
├── animations.js     # Magical animation utilities
├── navigation.js    # Navigation and Firebase save logic
└── index.js         # Main exports
```

## Usage

### Basic Integration

The onboarding is automatically integrated into the app. When a user signs in, if onboarding is not completed, they'll see the onboarding flow.

### Manual Initialization

```javascript
import { initOnboarding, getOnboardingContainerHTML } from './onboarding/index.js';

// Get container HTML
const html = getOnboardingContainerHTML();
document.querySelector('#app').innerHTML = html;

// Initialize
const container = document.querySelector('#onboarding-container');
await initOnboarding(container);
```

### Listening for Completion

```javascript
document.addEventListener('onboarding-complete', (event) => {
  const onboardingData = event.detail;
  console.log('Onboarding completed:', onboardingData);
  // Navigate to dashboard, etc.
});
```

## State Management

### Get Current State

```javascript
import { getState } from './onboarding/index.js';

const state = getState();
console.log(state.step); // Current step (1, 2, or 3)
console.log(state.partner1Name);
console.log(state.partner2Name);
console.log(state.preferredDays);
console.log(state.audioPreferences);
```

### Update State

```javascript
import { 
  setStep, 
  setPartnerNames, 
  setPreferredDays, 
  setAudioPreferences 
} from './onboarding/index.js';

// Set step
setStep(2);

// Set partner names
setPartnerNames('John', 'Jane');

// Set preferred days
setPreferredDays({ monday: true, friday: true });

// Set audio preferences
setAudioPreferences({ soundEffects: false, soundVolume: 0.5 });
```

### State Structure

```javascript
{
  step: 1,                    // Current step (1-3)
  partner1Name: '',          // First partner name
  partner2Name: '',          // Second partner name
  preferredDays: {           // Days selection
    monday: false,
    tuesday: false,
    // ... etc
  },
  audioPreferences: {         // Audio settings
    soundEffects: true,
    backgroundMusic: true,
    soundVolume: 0.7,
    musicVolume: 0.5
  },
  completed: false            // Completion status
}
```

## Navigation Functions

```javascript
import { nextStep, prevStep, skipStep } from './onboarding/index.js';

// Go to next step
nextStep();

// Go to previous step
prevStep();

// Skip current step
skipStep();
```

## Validation

Each step has built-in validation:

- **Step 1**: Both names must be entered
- **Step 2**: At least one day must be selected
- **Step 3**: No validation (audio preferences are optional)

```javascript
import { validateCurrentStep } from './onboarding/index.js';

if (validateCurrentStep()) {
  nextStep();
}
```

## Firebase Integration

Onboarding data is automatically saved to Firebase when completed:

```javascript
// Saved to user profile in Firestore
{
  partner1Name: "John",
  partner2Name: "Jane",
  preferredDays: { ... },
  audioPreferences: { ... },
  onboardingCompleted: true,
  onboardingCompletedAt: "2025-11-25T10:00:00.000Z"
}
```

The data is saved to the user's profile document in the `users` collection.

## LocalStorage Backup

State is automatically saved to localStorage on every update:

```javascript
// Stored as 'onboarding_state' in localStorage
localStorage.getItem('onboarding_state'); // JSON string
```

This provides a backup in case Firebase sync fails.

## Animations

### Magical Text Reveal

```javascript
import { magicalTextReveal } from './onboarding/animations.js';

const element = document.querySelector('#title');
await magicalTextReveal(element, 'Welcome!', 50);
```

### Floating Particles

```javascript
import { createFloatingParticles } from './onboarding/animations.js';

const container = document.querySelector('#particles');
createFloatingParticles(container, 20);
```

### Step Transitions

```javascript
import { stepTransition } from './onboarding/animations.js';

await stepTransition(oldStep, newStep, 'next'); // or 'prev'
```

## Styling

Onboarding styles are in `src/styles/onboarding.css`. Key classes:

- `.onboarding-container` - Main container
- `.onboarding-step` - Individual step
- `.step-header` - Step header with number and title
- `.step-content` - Step content area
- `.step-footer` - Navigation buttons

## Customization

### Custom Step Content

Modify `src/onboarding/views.js` to customize step content:

```javascript
export function renderStep1() {
  // Custom HTML for step 1
  return `<div>...</div>`;
}
```

### Custom Animations

Add new animations in `src/onboarding/animations.js`:

```javascript
export function myCustomAnimation(element) {
  // Your animation code
}
```

## Testing

To test the onboarding flow:

1. Sign in to the app
2. If onboarding is not completed, you'll see step 1
3. Complete each step
4. Data will be saved to Firebase and localStorage

To reset onboarding:

```javascript
import { resetState } from './onboarding/index.js';

resetState(); // Clears state and localStorage
```

## Notes

- All state updates automatically save to localStorage
- Firebase save happens only on completion
- Navigation buttons are disabled until step is valid
- Animations are mobile-optimized
- All functions use ES modules (no CommonJS)

