-- ============================================
-- World Cup 2026 Prediction Game — Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Profiles (linked to Supabase Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Matches
create table matches (
  id serial primary key,
  match_code text unique not null,        -- e.g., 'GS-A-01', 'R32-01', 'QF-01'
  stage text not null,                     -- 'group', 'round_of_32', 'round_of_16', 'quarter', 'semi', 'third_place', 'final'
  group_name text,                         -- 'A' through 'L', null for knockouts
  home_team text not null,
  away_team text not null,
  home_flag text,
  away_flag text,
  venue text,
  kickoff_utc timestamptz not null,
  is_tbd boolean default false,           -- true for knockout matches with unknown teams
  created_at timestamptz default now()
);

alter table matches enable row level security;

create policy "Matches are viewable by everyone"
  on matches for select using (true);

create policy "Only admins can modify matches"
  on matches for all using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- Index for fast daily queries
create index idx_matches_kickoff on matches (kickoff_utc);

-- 3. Results
create table results (
  match_id integer references matches(id) on delete cascade primary key,
  home_score integer not null,
  away_score integer not null,
  is_final boolean default false,         -- true when match is finished
  updated_at timestamptz default now()
);

alter table results enable row level security;

create policy "Results are viewable by everyone"
  on results for select using (true);

create policy "Only admins can insert results"
  on results for insert with check (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "Only admins can update results"
  on results for update using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- 4. Predictions
create table predictions (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  match_id integer references matches(id) on delete cascade not null,
  home_score integer not null,
  away_score integer not null,
  submitted_at timestamptz default now(),
  unique (user_id, match_id)
);

alter table predictions enable row level security;

-- Everyone can see predictions (for the social element)
create policy "Predictions are viewable by everyone"
  on predictions for select using (true);

-- Users can only insert their own predictions, and only BEFORE kickoff
create policy "Users can predict before kickoff"
  on predictions for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from matches
      where id = match_id
      and kickoff_utc > now()
    )
  );

-- Users can update their own predictions, only BEFORE kickoff
create policy "Users can update predictions before kickoff"
  on predictions for update using (
    auth.uid() = user_id
    and exists (
      select 1 from matches
      where id = match_id
      and kickoff_utc > now()
    )
  );

-- Users can delete their own predictions before kickoff
create policy "Users can delete predictions before kickoff"
  on predictions for delete using (
    auth.uid() = user_id
    and exists (
      select 1 from matches
      where id = match_id
      and kickoff_utc > now()
    )
  );

-- 5. Leaderboard View (computed)
create or replace view leaderboard as
select
  p.id as user_id,
  p.display_name,
  count(case when pr.id is not null and r.is_final then 1 end) as matches_predicted,
  coalesce(sum(
    case
      when not r.is_final then 0
      when pr.home_score = r.home_score and pr.away_score = r.away_score then 2
      when (
        (pr.home_score > pr.away_score and r.home_score > r.away_score) or
        (pr.home_score < pr.away_score and r.home_score < r.away_score) or
        (pr.home_score = pr.away_score and r.home_score = r.away_score)
      ) then 1
      else 0
    end
  ), 0) as total_points,
  coalesce(sum(
    case when r.is_final and pr.home_score = r.home_score and pr.away_score = r.away_score then 1 else 0 end
  ), 0) as exact_scores,
  coalesce(sum(
    case
      when not r.is_final then 0
      when pr.home_score = r.home_score and pr.away_score = r.away_score then 0  -- already counted as exact
      when (
        (pr.home_score > pr.away_score and r.home_score > r.away_score) or
        (pr.home_score < pr.away_score and r.home_score < r.away_score) or
        (pr.home_score = pr.away_score and r.home_score = r.away_score)
      ) then 1
      else 0
    end
  ), 0) as correct_results
from profiles p
left join predictions pr on pr.user_id = p.id
left join results r on r.match_id = pr.match_id
group by p.id, p.display_name
order by total_points desc, exact_scores desc;
