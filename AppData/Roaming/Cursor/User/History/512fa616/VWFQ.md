# Action Cards System Setup Guide

This guide explains how to set up and use the Action Card system in the Enjoyed app.

## Overview

The Action Card system provides a collection of romantic, playful, and sensual activities for couples. Cards are stored in Firebase Firestore and cached locally using IndexedDB for offline access.

## Card Structure

Each action card follows this structure:

```javascript
{
  id: "unique-id",                    // Unique identifier
  target: "HIM" | "HER" | "TOGETHER", // Who performs the action
  action: "string description",        // What to do
  duration: 60,                        // Duration in seconds
  difficulty: "easy" | "medium" | "hard", // Difficulty level
  category: "sensual" | "playful" | "romantic", // Category
  icon: "heart" | "flame" | "lips"    // Visual icon
}
```

## Setup Instructions

### 1. Firebase Security Rules

Copy the rules from `firebase-security-rules.txt` to your Firebase Console:

1. Go to Firebase Console > Firestore Database > Rules
2. Paste the rules
3. Publish the rules

The rules allow:
- **Read access**: All authenticated users can read action cards
- **Write access**: Authenticated users can create/update cards (restrict to admins in production)

### 2. Create Firestore Indexes

For optimal query performance, create composite indexes in Firebase Console:

1. Go to Firestore Database > Indexes
2. Create these indexes:

**Index 1:**
- Collection: `actionCards`
- Fields: `target` (Ascending), `difficulty` (Ascending)

**Index 2:**
- Collection: `actionCards`
- Fields: `target` (Ascending), `category` (Ascending)

**Index 3:**
- Collection: `actionCards`
- Fields: `difficulty` (Ascending), `category` (Ascending)

### 3. Seed the Database

To populate Firebase with sample cards, run the seeding script:

**Option 1: From Browser Console**
```javascript
// After the app loads, open browser console and run:
window.seedActionCards();
```

**Option 2: Programmatically**
```javascript
import { seedFirebaseWithCards } from './utils/card-manager.js';

await seedFirebaseWithCards();
```

This will:
- Upload all 100+ sample cards to Firebase
- Cache them locally in IndexedDB
- Make them available for offline use

## Usage

### Import the Card Manager

```javascript
import {
  getRandomCard,
  getCardsByTarget,
  getCardsByCategory,
  getCardsByDifficulty,
  getCardsByFilters,
  cacheCardsLocally,
  clearCache
} from './utils/card-manager.js';
```

### Get a Random Card

```javascript
// Get any random card
const card = await getRandomCard();

// Get random card for HIM, easy difficulty
const card = await getRandomCard('HIM', 'easy');

// Get random romantic card for TOGETHER
const card = await getRandomCard('TOGETHER', null, 'romantic');
```

### Get Cards by Filter

```javascript
// Get all cards for HIM
const cards = await getCardsByTarget('HIM');

// Get all romantic cards
const cards = await getCardsByCategory('romantic');

// Get all easy cards
const cards = await getCardsByDifficulty('easy');

// Get cards with multiple filters
const cards = await getCardsByFilters({
  target: 'TOGETHER',
  difficulty: 'medium',
  category: 'sensual'
});
```

### Caching Strategy

The system automatically:
1. **Checks local cache first** - Loads instantly if available
2. **Fetches from Firebase** - If cache is invalid or missing
3. **Updates cache** - Stores fetched cards locally
4. **Falls back to samples** - If Firebase is unavailable

Cache expires after 7 days. To force refresh:

```javascript
const cards = await getCards({}, true); // forceRefresh = true
```

### Clear Cache

```javascript
await clearCache();
```

## Local Caching (IndexedDB)

Cards are cached in IndexedDB for:
- **Instant loading** - No network delay
- **Offline access** - Works without internet
- **Reduced Firebase reads** - Saves on quota

Cache structure:
- **Database**: `EnjoyedApp`
- **Store**: `actionCards`
- **Indexes**: `target`, `difficulty`, `category`, `icon`

## Sample Cards

The system includes 100+ sample cards covering:
- **Targets**: HIM (35), HER (35), TOGETHER (30)
- **Difficulties**: Easy (45), Medium (45), Hard (10)
- **Categories**: Romantic (35), Playful (35), Sensual (30)

## API Reference

### `getRandomCard(target?, difficulty?, category?)`
Returns a random card matching the filters.

**Parameters:**
- `target` (optional): 'HIM' | 'HER' | 'TOGETHER'
- `difficulty` (optional): 'easy' | 'medium' | 'hard'
- `category` (optional): 'sensual' | 'playful' | 'romantic'

**Returns:** `Promise<Object|null>` - Card object or null if no match

### `getCardsByTarget(target)`
Returns all cards for a specific target.

**Parameters:**
- `target`: 'HIM' | 'HER' | 'TOGETHER'

**Returns:** `Promise<Array>` - Array of card objects

### `getCardsByCategory(category)`
Returns all cards in a specific category.

**Parameters:**
- `category`: 'sensual' | 'playful' | 'romantic'

**Returns:** `Promise<Array>` - Array of card objects

### `getCardsByDifficulty(difficulty)`
Returns all cards of a specific difficulty.

**Parameters:**
- `difficulty`: 'easy' | 'medium' | 'hard'

**Returns:** `Promise<Array>` - Array of card objects

### `getCardsByFilters(filters)`
Returns cards matching multiple filters.

**Parameters:**
- `filters`: Object with optional `target`, `difficulty`, `category`, `icon`

**Returns:** `Promise<Array>` - Array of card objects

### `cacheCardsLocally(cards)`
Manually cache cards to IndexedDB.

**Parameters:**
- `cards`: Array of card objects

**Returns:** `Promise<void>`

### `clearCache()`
Clears all cached cards from IndexedDB.

**Returns:** `Promise<void>`

### `seedFirebaseWithCards()`
Seeds Firebase with sample cards (run once).

**Returns:** `Promise<void>`

## Example: Game Integration

```javascript
import { getRandomCard } from './utils/card-manager.js';

// In your game logic
async function startTurnBasedGame() {
  const currentPlayer = getCurrentPlayer(); // 'HIM' or 'HER'
  const difficulty = getSelectedDifficulty(); // 'easy', 'medium', 'hard'
  
  const card = await getRandomCard(currentPlayer, difficulty);
  
  if (card) {
    displayCard(card);
    startTimer(card.duration);
  }
}

async function startFreeSwipeGame() {
  // Get random card for any target
  const card = await getRandomCard();
  displayCard(card);
}

async function startRandomGame() {
  // Get completely random card
  const card = await getRandomCard();
  displayCard(card);
}
```

## Troubleshooting

### Cards not loading
1. Check Firebase connection
2. Verify security rules are published
3. Check browser console for errors
4. Try clearing cache: `await clearCache()`

### Cache not working
1. Check IndexedDB support in browser
2. Verify database was created (check DevTools > Application > IndexedDB)
3. Check cache version matches

### Firebase quota exceeded
- Cards are cached locally, so repeated reads use cache
- Cache expires after 7 days
- Consider implementing cache refresh strategy

## Production Considerations

1. **Restrict write access** - Only allow admins to create/update cards
2. **Add validation** - Validate card structure before saving
3. **Rate limiting** - Implement rate limits for card creation
4. **Analytics** - Track which cards are most popular
5. **A/B testing** - Test different card descriptions

## Next Steps

- [ ] Set up Firebase indexes
- [ ] Run seed script to populate database
- [ ] Test card fetching in your game
- [ ] Implement card display UI
- [ ] Add card usage tracking

