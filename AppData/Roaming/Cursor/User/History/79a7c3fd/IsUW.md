# Firestore Database Structure

This document describes the Firestore collection structure for the Couple Action App.

## Collections Overview

1. **users** - User profiles and partner information
2. **couples** - Linked pairs of users
3. **actionCards** - Game action cards
4. **gameHistory** - Logs of game plays

---

## 1. Users Collection (`users`)

Stores individual user profiles and partner information.

### Document Structure

```javascript
{
  userId: "user123",                    // Document ID (same as auth.uid)
  email: "user@example.com",
  displayName: "John Doe",
  photoURL: "https://...",              // Optional
  partnerId: "user456",                 // ID of their partner (if linked)
  coupleId: "couple789",                // ID of the couple document
  createdAt: Timestamp,
  updatedAt: Timestamp,
  preferences: {
    notifications: true,
    theme: "light"
  }
}
```

### Example Usage

```javascript
import { getUserProfile, setUserProfile } from './firebase/firestore.js';

// Get user profile
const user = await getUserProfile('user123');

// Create/update user profile
await setUserProfile('user123', {
  email: 'user@example.com',
  displayName: 'John Doe',
  preferences: {
    notifications: true
  }
});
```

---

## 2. Couples Collection (`couples`)

Stores linked pairs of users who are playing together.

### Document Structure

```javascript
{
  coupleId: "couple789",                // Document ID
  partnerIds: ["user123", "user456"],   // Array of user IDs
  partner1Id: "user123",                // First partner ID
  partner2Id: "user456",                // Second partner ID
  createdAt: Timestamp,
  updatedAt: Timestamp,
  status: "active",                      // "active", "paused", "archived"
  stats: {
    totalGamesPlayed: 10,
    totalActionsCompleted: 25,
    lastPlayedAt: Timestamp
  }
}
```

### Example Usage

```javascript
import { getCouple, getCoupleByUserId, setCouple } from './firebase/firestore.js';

// Get couple by couple ID
const couple = await getCouple('couple789');

// Get couple by user ID
const couple = await getCoupleByUserId('user123');

// Create a new couple
const coupleId = await setCouple(null, {
  partnerIds: ['user123', 'user456'],
  partner1Id: 'user123',
  partner2Id: 'user456',
  status: 'active',
  stats: {
    totalGamesPlayed: 0,
    totalActionsCompleted: 0
  }
});
```

---

## 3. Action Cards Collection (`actionCards`)

Stores game action cards that couples can play.

### Document Structure

```javascript
{
  cardId: "card123",                    // Document ID
  coupleId: "couple789",                // Which couple owns this card
  title: "Cook dinner together",
  description: "Prepare and enjoy a meal together",
  category: "romantic",                 // "romantic", "fun", "adventure", "intimate", etc.
  difficulty: "easy",                   // "easy", "medium", "hard"
  points: 10,                           // Points awarded for completion
  estimatedTime: 60,                    // Minutes
  isCompleted: false,
  completedBy: null,                    // User ID who completed it
  completedAt: null,                     // Timestamp
  createdAt: Timestamp,
  updatedAt: Timestamp,
  tags: ["cooking", "home"],            // Optional tags
  imageURL: "https://...",              // Optional image
  instructions: "Step by step instructions..." // Optional
}
```

### Example Usage

```javascript
import { getActionCards, createActionCard } from './firebase/firestore.js';

// Get all cards for a couple
const cards = await getActionCards({ coupleId: 'couple789' });

// Get cards by category
const romanticCards = await getActionCards({ 
  coupleId: 'couple789',
  category: 'romantic'
});

// Create a new action card
const cardId = await createActionCard({
  coupleId: 'couple789',
  title: 'Cook dinner together',
  description: 'Prepare and enjoy a meal together',
  category: 'romantic',
  difficulty: 'easy',
  points: 10,
  estimatedTime: 60
});
```

---

## 4. Game History Collection (`gameHistory`)

Stores logs of when couples play cards and complete actions.

### Document Structure

```javascript
{
  historyId: "history123",              // Document ID
  coupleId: "couple789",                // Which couple played
  cardId: "card123",                    // Which card was played
  cardTitle: "Cook dinner together",    // Snapshot of card title
  completedBy: "user123",               // User ID who completed it
  completedByName: "John Doe",          // Display name snapshot
  points: 10,                           // Points earned
  playedAt: Timestamp,                  // When it was completed
  notes: "It was amazing!",             // Optional notes
  photoURL: "https://...",              // Optional photo proof
  rating: 5                             // Optional rating (1-5)
}
```

### Example Usage

```javascript
import { getGameHistory, addGameHistory } from './firebase/firestore.js';

// Get game history for a couple
const history = await getGameHistory('couple789', 20); // Last 20 entries

// Add a new game history entry
await addGameHistory({
  coupleId: 'couple789',
  cardId: 'card123',
  cardTitle: 'Cook dinner together',
  completedBy: 'user123',
  completedByName: 'John Doe',
  points: 10,
  notes: 'It was amazing!',
  rating: 5
});
```

---

## Data Relationships

```
users (user123) ──┐
                  ├──> couples (couple789) ──┐
users (user456) ──┘                          │
                                             ├──> actionCards (card123)
                                             │
                                             └──> gameHistory (history123)
```

## Security Rules

All collections are protected by Firestore security rules that ensure:
- Users can only access their own profile
- Couples can only access data for couples they belong to
- Action cards are only accessible by the couple that owns them
- Game history is only accessible by the couple that created it

See `firestore.rules` for the complete security rules.

## Best Practices

1. **Always use serverTimestamp()** for `createdAt` and `updatedAt` fields
2. **Store denormalized data** when needed (e.g., `cardTitle` in game history)
3. **Use batch writes** when updating multiple related documents
4. **Subscribe to real-time updates** for active game sessions
5. **Index frequently queried fields** in Firebase Console

