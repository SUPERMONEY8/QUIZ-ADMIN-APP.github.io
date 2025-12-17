# Participant App - Code Entry Implementation Guide

## 🎯 Goal
Update the participant app to accept quiz codes (like "ABC123") instead of links.

---

## 📋 Implementation Steps

### Step 1: Add Code Input Field

**Replace the link input with a code input:**

```jsx
// In participant app - main entry page
const [quizCode, setQuizCode] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleCodeSubmit = async (e) => {
  e.preventDefault();
  if (!quizCode.trim()) {
    setError("Please enter a quiz code");
    return;
  }
  
  setLoading(true);
  setError("");
  
  try {
    // Query quiz by share_code
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("*")
      .eq("share_code", quizCode.trim().toUpperCase())
      .single();
    
    if (quizError || !quiz) {
      throw new Error("Quiz not found. Please check the code and try again.");
    }
    
    // Check if quiz is published
    if (quiz.status !== "published" && !quiz.is_published) {
      throw new Error("This quiz is not available yet.");
    }
    
    // Navigate to quiz or load quiz
    // navigate(`/quiz/${quiz.id}`);
    // OR set quiz state and show quiz
    setQuiz(quiz);
  } catch (err) {
    setError(err.message || "Failed to load quiz");
  } finally {
    setLoading(false);
  }
};

// UI Component
<div>
  <h2>Enter Quiz Code</h2>
  <form onSubmit={handleCodeSubmit}>
    <input
      type="text"
      value={quizCode}
      onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
      placeholder="Enter quiz code (e.g., ABC123)"
      className="text-center text-2xl font-mono tracking-wider uppercase"
      maxLength={10}
    />
    <button type="submit" disabled={loading}>
      {loading ? "Loading..." : "Start Quiz"}
    </button>
  </form>
  {error && <div className="error">{error}</div>}
</div>
```

### Step 2: Query by Code (Not URL)

**Remove URL-based quiz loading, use code-based:**

```javascript
// OLD (URL-based):
// const { quizId } = useParams();
// const { data } = await supabase.from("quizzes").eq("id", quizId).single();

// NEW (Code-based):
const { data } = await supabase
  .from("quizzes")
  .select("*")
  .eq("share_code", code)
  .single();
```

### Step 3: Handle Code Format

**Make code input uppercase and clean:**

```javascript
// Auto-uppercase and remove spaces
const cleanCode = quizCode.trim().toUpperCase().replace(/\s/g, "");
```

### Step 4: Error Handling

**Show helpful errors:**

```javascript
if (!quiz) {
  setError("Quiz code not found. Please check the code and try again.");
} else if (quiz.status !== "published") {
  setError("This quiz is not available yet. Please contact the administrator.");
}
```

---

## 🔍 Database Query

**The query you need:**

```javascript
const { data: quiz, error } = await supabase
  .from("quizzes")
  .select("*")
  .eq("share_code", "ABC123")  // The code entered by participant
  .single();
```

**Make sure:**
- `share_code` column exists (already added in migration)
- RLS policy allows reading quizzes
- Code is case-insensitive or always uppercase

---

## ✅ Checklist

- [ ] Replace link input with code input field
- [ ] Add code submission handler
- [ ] Query Supabase by `share_code` instead of `id`
- [ ] Handle uppercase/lowercase codes
- [ ] Show error if code not found
- [ ] Check quiz is published before allowing access
- [ ] Test with a real code from admin app

---

## 🎨 UI Suggestions

**Code Input Design:**
- Large, centered input
- Uppercase font (font-mono)
- Wide letter spacing
- Clear "Enter Code" label
- Big "Start Quiz" button

**Example:**
```
┌─────────────────────────┐
│   Enter Quiz Code       │
│                         │
│   ┌───────────────┐    │
│   │   ABC123      │    │
│   └───────────────┘    │
│                         │
│   [  Start Quiz  ]      │
└─────────────────────────┘
```

---

## 🚀 Quick Implementation

**Minimal code needed:**

1. **Input field** for code
2. **Submit handler** that queries by `share_code`
3. **Error handling** for invalid codes
4. **Navigation** to quiz once found

That's it! The participant enters the code, you query by code, and load the quiz.

