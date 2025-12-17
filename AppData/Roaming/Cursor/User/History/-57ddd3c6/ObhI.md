# Quiz App - Participant Only

This is the participant-only version of the quiz application. It includes:
- Participant landing page
- Participant login/signup
- Participant dashboard
- Quiz taking functionality
- Results viewing

## Setup

1. Install dependencies:
```bash
bun install
# or
npm install
```

2. Set up Supabase environment variables:

   **For local development:**
   - Copy `.env.example` to `.env`
   - Get your Supabase credentials from https://supabase.com/dashboard
     - Go to your project → Settings → API
     - Copy the "Project URL" → set as `VITE_SUPABASE_URL`
     - Copy the "anon public" key → set as `VITE_SUPABASE_ANON_KEY`
   - Restart your development server after creating `.env`

   **Required environment variables:**
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

3. Run development server:
```bash
bun run dev
# or
npm run dev
```

## Deployment

This app is configured for Vercel deployment. The `vercel.json` file is included.

## Routes

- `/` - Landing page
- `/participant` - Landing page
- `/participant/login` - Login page
- `/participant/signup` - Signup page
- `/participant/dashboard` - Participant dashboard
- `/quiz/:quizId/enter` - Quiz entry page
- `/quiz/:quizId` - Quiz taking page
- `/results/:quizId` - Results page
- `/thank-you/:quizId` - Thank you page

