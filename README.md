# World Cup 2026 Prediction Game

> A full-stack web app for a friend group to predict match results and group-stage winners during the 2026 FIFA World Cup. Points, live leaderboard, bragging rights.

---

## What it does

- Players log in and submit predictions for every World Cup 2026 match
- Points awarded for correct result, correct score, and correct group-stage advancement
- Live leaderboard updates as actual match results come in
- Predictions lock at kickoff — no post-hoc edits

Built for a 12-15 person friend group during the tournament.

---

## Tech stack

- **Frontend:** React
- **Backend / DB:** Supabase (Postgres + Auth)
- **Hosting:** Vercel
- **Match results:** Pulled from a third-party football API (Football-Data.org)

---

## Why I built it

My friends and I wanted a prediction game for the 2026 World Cup. Every existing app had ads, paywalls, or wouldn't let us customize the scoring. So I built one that does exactly what we needed and nothing we didn't.

Along the way I learned:
- Designing a Postgres schema that enforces prediction lockout at kickoff time (database-level, not just frontend validation)
- Working with Supabase Auth + Row Level Security so users can only edit their own predictions
- Shipping a small full-stack app end-to-end: schema design, API wiring, frontend, deployment

---

## Setup (to run your own copy)

```bash
git clone https://github.com/MohanadddAmrr/wc-predict.git
cd wc-predict

npm install

# Copy environment variables and fill in your own Supabase credentials
cp .env.example .env.local

npm run dev
```

You'll also need a Supabase project with the schema matching this app, and an API key for the football results service.

---

## License

MIT
