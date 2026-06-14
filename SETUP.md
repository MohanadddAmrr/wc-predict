# ⚽ World Cup 2026 Prediction Game — Setup Guide

## Architecture
```
React (Vite) → Supabase (Auth + PostgreSQL + API) → Netlify
```

No backend code needed. Supabase auto-generates a REST API from your database tables.

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → Sign up (free)
2. Click **New Project** → name it `wc-predict`
3. Set a database password (save it)
4. Choose the nearest region
5. Once created, go to **Settings → API** and copy:
   - `Project URL` (e.g. `https://xxxxx.supabase.co`)
   - `anon public` key

## Step 2: Run Database Schema

Go to **SQL Editor** in your Supabase dashboard and run `supabase-schema.sql` (included in this project). This creates:

- **profiles** — user display names
- **matches** — full World Cup schedule with kickoff times
- **predictions** — each user's predicted scores per match
- **results** — actual final scores (admin-entered or API-synced)
- **Row Level Security** — users can only edit their own predictions, and only before kickoff

## Step 3: Seed Match Data

After running the schema, run `seed-matches.sql` in the SQL Editor. This loads all 72 group stage matches + knockout stage placeholders.

## Step 4: Frontend Setup

```bash
# Clone and install
cd wc-predict
npm install

# Create .env file
cp .env.example .env
# Edit .env with your Supabase URL and anon key

# Run locally
npm run dev
```

## Step 5: Deploy to Netlify

```bash
npm run build
# Upload the `dist` folder to Netlify
# Or connect your GitHub repo for auto-deploys
```

Set environment variables in Netlify:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Step 6: Auto-Update Match Results (Optional)

Two options:

### Option A: Manual (Admin Panel)
One person in your group logs in and enters results after matches end. The app has an admin panel for this.

### Option B: Automated via API
Set up a Supabase Edge Function or a GitHub Action cron that calls the free [football-data.org](https://www.football-data.org/) API every 15 minutes and writes results to the `results` table. Free tier gives you 10 calls/minute — more than enough.

## Step 7: Knockout Matches

Knockout matches are pre-populated with placeholder teams (e.g., "Winner Group A" vs "Runner-up Group C"). When group stages end, update the `home_team` and `away_team` columns for those matches. The app handles this automatically if you use the API sync.

---

## How Scoring Works

| Outcome | Points |
|---------|--------|
| Wrong prediction | 0 |
| Correct result (winner/draw) | 1 |
| Exact score | 2 |

Predictions lock when the match kicks off — enforced at the database level via RLS policies.
