# World Cup 2026 Prediction Game

> A full-stack web app for a friend group to predict match results and group-stage winners during the 2026 FIFA World Cup. Points, live leaderboard, bragging rights.

---

## What it does

- Users log in and submit predictions for every World Cup 2026 match
- Points awarded for correct result, correct score, and correct group-stage advancement
- Live leaderboard updates as actual match results come in
- Everyone sees everyone's predictions after a match locks (no post-hoc edits)

Built for a friend group of [N] people during the tournament.

---

## Tech stack

- **Frontend:** React, [Tailwind CSS or whatever styling you used]
- **Backend / DB:** Supabase (Postgres + Auth + Row Level Security)
- **Hosting:** Netlify
- **Auth:** Supabase magic-link email login

---

## Why I built it

My friends and I wanted a prediction game for the 2026 World Cup, but every existing app had either ads, paywalls, or wouldn't let us customize the scoring. So I built one.

Along the way I learned:
- How to design Postgres schemas with Row Level Security so users can't modify each other's predictions
- How to lock predictions by match kickoff time (database-level enforcement, not just frontend validation)
- How to deploy a real-time-ish leaderboard without rebuilding the world on every page load

---

## Architecture notes

- Predictions table has a trigger that rejects writes after the match's kickoff timestamp (prevents cheating via API)
- Match results populated from [source: manual admin UI / external API, whichever you used]
- Scoring runs in a Postgres function so recomputing the leaderboard is a single call

---

## Setup (if you want to run it locally)

```bash
git clone https://github.com/MohanadddAmrr/wc-predict.git
cd wc-predict

npm install

# Set up your own Supabase project and copy the URL + anon key
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

npm run dev
```

You'll also need to run the SQL migrations in `/supabase/migrations` against your Supabase instance.

---

## Status

Shipped and running for the 2026 World Cup. ~[N] active users (my friend group).

---

## License

MIT
