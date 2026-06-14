-- ============================================
-- World Cup 2026 — Match Seed Data
-- All times in UTC. Run after schema.
-- ============================================

-- Make the first user who signs up an admin
-- (Run this AFTER your first signup, replacing the email)
-- UPDATE profiles SET is_admin = true WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL' LIMIT 1);

-- ── GROUP STAGE: Match Day 1 ──

-- June 11
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-A-01', 'group', 'A', 'Mexico', 'South Africa', '🇲🇽', '🇿🇦', 'Mexico City', '2026-06-11 19:00:00+00'),
('GS-A-02', 'group', 'A', 'South Korea', 'Czechia', '🇰🇷', '🇨🇿', 'Guadalajara', '2026-06-12 01:00:00+00');

-- June 12
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-B-01', 'group', 'B', 'Canada', 'Bosnia & Herzegovina', '🇨🇦', '🇧🇦', 'Toronto', '2026-06-12 19:00:00+00'),
('GS-D-01', 'group', 'D', 'USA', 'Paraguay', '🇺🇸', '🇵🇾', 'Los Angeles', '2026-06-12 22:00:00+00');

-- June 13
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-C-01', 'group', 'C', 'Brazil', 'Morocco', '🇧🇷', '🇲🇦', 'New Jersey', '2026-06-13 22:00:00+00'),
('GS-B-02', 'group', 'B', 'Qatar', 'Switzerland', '🇶🇦', '🇨🇭', 'San Francisco', '2026-06-14 01:00:00+00'),
('GS-D-02', 'group', 'D', 'Australia', 'Türkiye', '🇦🇺', '🇹🇷', 'Vancouver', '2026-06-14 01:00:00+00'),
('GS-C-02', 'group', 'C', 'Haiti', 'Scotland', '🇭🇹', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Boston', '2026-06-14 01:00:00+00');

-- June 14
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-E-01', 'group', 'E', 'Germany', 'Curaçao', '🇩🇪', '🇨🇼', 'Houston', '2026-06-14 17:00:00+00'),
('GS-E-02', 'group', 'E', 'Ivory Coast', 'Ecuador', '🇨🇮', '🇪🇨', 'Philadelphia', '2026-06-14 20:00:00+00'),
('GS-F-01', 'group', 'F', 'Netherlands', 'Japan', '🇳🇱', '🇯🇵', 'Dallas', '2026-06-14 23:00:00+00'),
('GS-F-02', 'group', 'F', 'Sweden', 'Tunisia', '🇸🇪', '🇹🇳', 'Monterrey', '2026-06-15 02:00:00+00');

-- June 15
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-H-01', 'group', 'H', 'Spain', 'Cape Verde', '🇪🇸', '🇨🇻', 'Atlanta', '2026-06-15 16:00:00+00'),
('GS-G-01', 'group', 'G', 'Belgium', 'Egypt', '🇧🇪', '🇪🇬', 'Seattle', '2026-06-15 19:00:00+00'),
('GS-H-02', 'group', 'H', 'Saudi Arabia', 'Uruguay', '🇸🇦', '🇺🇾', 'Miami', '2026-06-15 22:00:00+00'),
('GS-G-02', 'group', 'G', 'Iran', 'New Zealand', '🇮🇷', '🇳🇿', 'Los Angeles', '2026-06-16 01:00:00+00');

-- June 16
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-I-01', 'group', 'I', 'France', 'Senegal', '🇫🇷', '🇸🇳', 'New Jersey', '2026-06-16 19:00:00+00'),
('GS-I-02', 'group', 'I', 'Norway', 'Uzbekistan', '🇳🇴', '🇺🇿', 'Boston', '2026-06-16 22:00:00+00'),
('GS-J-01', 'group', 'J', 'Argentina', 'Algeria', '🇦🇷', '🇩🇿', 'Kansas City', '2026-06-17 01:00:00+00'),
('GS-J-02', 'group', 'J', 'Austria', 'Jordan', '🇦🇹', '🇯🇴', 'San Francisco', '2026-06-17 01:00:00+00');

-- June 17
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-K-01', 'group', 'K', 'Portugal', 'Colombia', '🇵🇹', '🇨🇴', 'Houston', '2026-06-17 17:00:00+00'),
('GS-L-01', 'group', 'L', 'England', 'Croatia', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇭🇷', 'Miami', '2026-06-17 20:00:00+00'),
('GS-L-02', 'group', 'L', 'Ghana', 'Panama', '🇬🇭', '🇵🇦', 'Atlanta', '2026-06-17 23:00:00+00'),
('GS-K-02', 'group', 'K', 'Nigeria', 'Peru', '🇳🇬', '🇵🇪', 'Dallas', '2026-06-17 23:00:00+00');

-- ── GROUP STAGE: Match Day 2 ──

-- June 18
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-A-03', 'group', 'A', 'Czechia', 'South Africa', '🇨🇿', '🇿🇦', 'Atlanta', '2026-06-18 16:00:00+00'),
('GS-A-04', 'group', 'A', 'Mexico', 'South Korea', '🇲🇽', '🇰🇷', 'Los Angeles', '2026-06-18 22:00:00+00'),
('GS-D-03', 'group', 'D', 'Paraguay', 'Australia', '🇵🇾', '🇦🇺', 'Dallas', '2026-06-18 22:00:00+00'),
('GS-B-03', 'group', 'B', 'Switzerland', 'Canada', '🇨🇭', '🇨🇦', 'Kansas City', '2026-06-19 01:00:00+00');

-- June 19
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-C-03', 'group', 'C', 'Morocco', 'Haiti', '🇲🇦', '🇭🇹', 'Philadelphia', '2026-06-19 17:00:00+00'),
('GS-C-04', 'group', 'C', 'Scotland', 'Brazil', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🇧🇷', 'Los Angeles', '2026-06-19 23:00:00+00'),
('GS-D-04', 'group', 'D', 'Türkiye', 'USA', '🇹🇷', '🇺🇸', 'New Jersey', '2026-06-19 23:00:00+00'),
('GS-B-04', 'group', 'B', 'Bosnia & Herzegovina', 'Qatar', '🇧🇦', '🇶🇦', 'Houston', '2026-06-19 23:00:00+00');

-- June 20
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-F-03', 'group', 'F', 'Netherlands', 'Sweden', '🇳🇱', '🇸🇪', 'Houston', '2026-06-20 17:00:00+00'),
('GS-E-03', 'group', 'E', 'Ecuador', 'Germany', '🇪🇨', '🇩🇪', 'Dallas', '2026-06-20 23:00:00+00'),
('GS-E-04', 'group', 'E', 'Curaçao', 'Ivory Coast', '🇨🇼', '🇨🇮', 'Seattle', '2026-06-20 23:00:00+00'),
('GS-F-04', 'group', 'F', 'Tunisia', 'Japan', '🇹🇳', '🇯🇵', 'Boston', '2026-06-20 23:00:00+00');

-- June 21
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-H-03', 'group', 'H', 'Spain', 'Saudi Arabia', '🇪🇸', '🇸🇦', 'Atlanta', '2026-06-21 16:00:00+00'),
('GS-G-03', 'group', 'G', 'Egypt', 'Iran', '🇪🇬', '🇮🇷', 'Dallas', '2026-06-21 22:00:00+00'),
('GS-H-04', 'group', 'H', 'Uruguay', 'Cape Verde', '🇺🇾', '🇨🇻', 'San Francisco', '2026-06-22 01:00:00+00'),
('GS-G-04', 'group', 'G', 'New Zealand', 'Belgium', '🇳🇿', '🇧🇪', 'Miami', '2026-06-22 01:00:00+00');

-- June 22
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-I-03', 'group', 'I', 'Senegal', 'Norway', '🇸🇳', '🇳🇴', 'New Jersey', '2026-06-22 22:00:00+00'),
('GS-I-04', 'group', 'I', 'Uzbekistan', 'France', '🇺🇿', '🇫🇷', 'Houston', '2026-06-22 22:00:00+00'),
('GS-J-03', 'group', 'J', 'Algeria', 'Austria', '🇩🇿', '🇦🇹', 'Miami', '2026-06-23 01:00:00+00'),
('GS-J-04', 'group', 'J', 'Jordan', 'Argentina', '🇯🇴', '🇦🇷', 'Philadelphia', '2026-06-23 01:00:00+00');

-- June 23
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-L-03', 'group', 'L', 'Croatia', 'Ghana', '🇭🇷', '🇬🇭', 'Kansas City', '2026-06-23 17:00:00+00'),
('GS-K-03', 'group', 'K', 'Colombia', 'Nigeria', '🇨🇴', '🇳🇬', 'Atlanta', '2026-06-23 22:00:00+00'),
('GS-K-04', 'group', 'K', 'Peru', 'Portugal', '🇵🇪', '🇵🇹', 'Los Angeles', '2026-06-23 23:00:00+00'),
('GS-L-04', 'group', 'L', 'Panama', 'England', '🇵🇦', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Seattle', '2026-06-23 23:00:00+00');

-- ── GROUP STAGE: Match Day 3 ──

-- June 24
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-A-05', 'group', 'A', 'South Africa', 'South Korea', '🇿🇦', '🇰🇷', 'Guadalajara', '2026-06-24 22:00:00+00'),
('GS-A-06', 'group', 'A', 'Czechia', 'Mexico', '🇨🇿', '🇲🇽', 'Mexico City', '2026-06-24 22:00:00+00'),
('GS-C-05', 'group', 'C', 'Morocco', 'Scotland', '🇲🇦', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Atlanta', '2026-06-25 01:00:00+00'),
('GS-C-06', 'group', 'C', 'Haiti', 'Brazil', '🇭🇹', '🇧🇷', 'Boston', '2026-06-25 01:00:00+00');

-- June 25
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-E-05', 'group', 'E', 'Ecuador', 'Curaçao', '🇪🇨', '🇨🇼', 'New Jersey', '2026-06-25 20:00:00+00'),
('GS-E-06', 'group', 'E', 'Germany', 'Ivory Coast', '🇩🇪', '🇨🇮', 'Philadelphia', '2026-06-25 20:00:00+00'),
('GS-B-05', 'group', 'B', 'Switzerland', 'Bosnia & Herzegovina', '🇨🇭', '🇧🇦', 'Toronto', '2026-06-25 22:00:00+00'),
('GS-B-06', 'group', 'B', 'Qatar', 'Canada', '🇶🇦', '🇨🇦', 'Vancouver', '2026-06-25 22:00:00+00'),
('GS-D-05', 'group', 'D', 'Paraguay', 'Türkiye', '🇵🇾', '🇹🇷', 'San Francisco', '2026-06-26 01:00:00+00'),
('GS-D-06', 'group', 'D', 'Australia', 'USA', '🇦🇺', '🇺🇸', 'Los Angeles', '2026-06-26 01:00:00+00');

-- June 26
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-F-05', 'group', 'F', 'Japan', 'Sweden', '🇯🇵', '🇸🇪', 'Houston', '2026-06-26 20:00:00+00'),
('GS-F-06', 'group', 'F', 'Tunisia', 'Netherlands', '🇹🇳', '🇳🇱', 'Dallas', '2026-06-26 20:00:00+00'),
('GS-H-05', 'group', 'H', 'Cape Verde', 'Saudi Arabia', '🇨🇻', '🇸🇦', 'Miami', '2026-06-26 22:00:00+00'),
('GS-H-06', 'group', 'H', 'Uruguay', 'Spain', '🇺🇾', '🇪🇸', 'Seattle', '2026-06-26 22:00:00+00'),
('GS-G-05', 'group', 'G', 'New Zealand', 'Egypt', '🇳🇿', '🇪🇬', 'Kansas City', '2026-06-27 01:00:00+00'),
('GS-G-06', 'group', 'G', 'Belgium', 'Iran', '🇧🇪', '🇮🇷', 'Atlanta', '2026-06-27 01:00:00+00');

-- June 27
INSERT INTO matches (match_code, stage, group_name, home_team, away_team, home_flag, away_flag, venue, kickoff_utc) VALUES
('GS-I-05', 'group', 'I', 'Uzbekistan', 'Senegal', '🇺🇿', '🇸🇳', 'Philadelphia', '2026-06-27 20:00:00+00'),
('GS-I-06', 'group', 'I', 'France', 'Norway', '🇫🇷', '🇳🇴', 'Houston', '2026-06-27 20:00:00+00'),
('GS-K-05', 'group', 'K', 'Peru', 'Colombia', '🇵🇪', '🇨🇴', 'Dallas', '2026-06-27 22:00:00+00'),
('GS-K-06', 'group', 'K', 'Portugal', 'Nigeria', '🇵🇹', '🇳🇬', 'Los Angeles', '2026-06-27 22:00:00+00'),
('GS-L-05', 'group', 'L', 'Ghana', 'Panama', '🇬🇭', '🇵🇦', 'Atlanta', '2026-06-28 01:00:00+00'),
('GS-L-06', 'group', 'L', 'England', 'Croatia', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇭🇷', 'New Jersey', '2026-06-28 01:00:00+00'),
('GS-J-05', 'group', 'J', 'Jordan', 'Algeria', '🇯🇴', '🇩🇿', 'San Francisco', '2026-06-28 01:00:00+00'),
('GS-J-06', 'group', 'J', 'Argentina', 'Austria', '🇦🇷', '🇦🇹', 'Miami', '2026-06-28 01:00:00+00');

-- ── KNOCKOUT STAGE (TBD teams — update as groups finish) ──

-- Round of 32: June 28 – July 3
INSERT INTO matches (match_code, stage, home_team, away_team, venue, kickoff_utc, is_tbd) VALUES
('R32-01', 'round_of_32', '1st Group A', '3rd Group C/D/E', 'Mexico City', '2026-06-28 17:00:00+00', true),
('R32-02', 'round_of_32', '2nd Group C', '2nd Group D', 'Vancouver', '2026-06-28 20:00:00+00', true),
('R32-03', 'round_of_32', '1st Group B', '3rd Group E/F/G/I/J', 'Toronto', '2026-06-28 23:00:00+00', true),
('R32-04', 'round_of_32', '1st Group C', '2nd Group A', 'Boston', '2026-06-29 02:00:00+00', true),
('R32-05', 'round_of_32', '1st Group D', '3rd Group A/B/F', 'Los Angeles', '2026-06-29 17:00:00+00', true),
('R32-06', 'round_of_32', '2nd Group B', '2nd Group A', 'Guadalajara', '2026-06-29 20:00:00+00', true),
('R32-07', 'round_of_32', '1st Group E', '3rd Group G/H/I/J/K', 'Philadelphia', '2026-06-29 23:00:00+00', true),
('R32-08', 'round_of_32', '1st Group F', '2nd Group C', 'Dallas', '2026-06-30 02:00:00+00', true),
('R32-09', 'round_of_32', '1st Group G', '3rd Group A/B/F', 'Seattle', '2026-06-30 17:00:00+00', true),
('R32-10', 'round_of_32', '2nd Group E', '2nd Group F', 'Monterrey', '2026-06-30 20:00:00+00', true),
('R32-11', 'round_of_32', '1st Group H', '3rd Group C/D/E', 'Miami', '2026-06-30 23:00:00+00', true),
('R32-12', 'round_of_32', '2nd Group G', '2nd Group H', 'Houston', '2026-07-01 02:00:00+00', true),
('R32-13', 'round_of_32', '1st Group I', '3rd Group G/H/I/J/K', 'New Jersey', '2026-07-01 17:00:00+00', true),
('R32-14', 'round_of_32', '1st Group J', '2nd Group I', 'Kansas City', '2026-07-01 20:00:00+00', true),
('R32-15', 'round_of_32', '1st Group K', '3rd Group E/F/L', 'Los Angeles', '2026-07-02 23:00:00+00', true),
('R32-16', 'round_of_32', '1st Group L', '3rd Group E/H/I/J/K', 'Atlanta', '2026-07-03 02:00:00+00', true);

-- Round of 16: July 4–7
INSERT INTO matches (match_code, stage, home_team, away_team, venue, kickoff_utc, is_tbd) VALUES
('R16-01', 'round_of_16', 'W R32-01', 'W R32-02', 'Dallas', '2026-07-04 17:00:00+00', true),
('R16-02', 'round_of_16', 'W R32-03', 'W R32-04', 'New Jersey', '2026-07-04 20:00:00+00', true),
('R16-03', 'round_of_16', 'W R32-05', 'W R32-06', 'Los Angeles', '2026-07-05 17:00:00+00', true),
('R16-04', 'round_of_16', 'W R32-07', 'W R32-08', 'Houston', '2026-07-05 20:00:00+00', true),
('R16-05', 'round_of_16', 'W R32-09', 'W R32-10', 'Philadelphia', '2026-07-06 17:00:00+00', true),
('R16-06', 'round_of_16', 'W R32-11', 'W R32-12', 'Miami', '2026-07-06 20:00:00+00', true),
('R16-07', 'round_of_16', 'W R32-13', 'W R32-14', 'Kansas City', '2026-07-07 17:00:00+00', true),
('R16-08', 'round_of_16', 'W R32-15', 'W R32-16', 'Atlanta', '2026-07-07 20:00:00+00', true);

-- Quarter Finals: July 9–11
INSERT INTO matches (match_code, stage, home_team, away_team, venue, kickoff_utc, is_tbd) VALUES
('QF-01', 'quarter', 'W R16-01', 'W R16-02', 'New Jersey', '2026-07-09 20:00:00+00', true),
('QF-02', 'quarter', 'W R16-03', 'W R16-04', 'Los Angeles', '2026-07-10 01:00:00+00', true),
('QF-03', 'quarter', 'W R16-05', 'W R16-06', 'Houston', '2026-07-10 20:00:00+00', true),
('QF-04', 'quarter', 'W R16-07', 'W R16-08', 'Dallas', '2026-07-11 01:00:00+00', true);

-- Semi Finals: July 14–15
INSERT INTO matches (match_code, stage, home_team, away_team, venue, kickoff_utc, is_tbd) VALUES
('SF-01', 'semi', 'W QF-01', 'W QF-02', 'Dallas', '2026-07-14 19:00:00+00', true),
('SF-02', 'semi', 'W QF-03', 'W QF-04', 'Atlanta', '2026-07-15 19:00:00+00', true);

-- Third Place: July 18
INSERT INTO matches (match_code, stage, home_team, away_team, venue, kickoff_utc, is_tbd) VALUES
('3RD', 'third_place', 'L SF-01', 'L SF-02', 'Miami', '2026-07-18 21:00:00+00', true);

-- Final: July 19
INSERT INTO matches (match_code, stage, home_team, away_team, venue, kickoff_utc, is_tbd) VALUES
('FINAL', 'final', 'W SF-01', 'W SF-02', 'New Jersey', '2026-07-19 19:00:00+00', true);

-- ── SEED KNOWN RESULTS ──
-- (Update match IDs after insert — these assume sequential IDs starting at 1)

INSERT INTO results (match_id, home_score, away_score, is_final)
SELECT id, 2, 0, true FROM matches WHERE match_code = 'GS-A-01';

INSERT INTO results (match_id, home_score, away_score, is_final)
SELECT id, 2, 1, true FROM matches WHERE match_code = 'GS-A-02';

INSERT INTO results (match_id, home_score, away_score, is_final)
SELECT id, 1, 1, true FROM matches WHERE match_code = 'GS-B-01';

INSERT INTO results (match_id, home_score, away_score, is_final)
SELECT id, 4, 1, true FROM matches WHERE match_code = 'GS-D-01';

INSERT INTO results (match_id, home_score, away_score, is_final)
SELECT id, 1, 1, true FROM matches WHERE match_code = 'GS-C-01';

INSERT INTO results (match_id, home_score, away_score, is_final)
SELECT id, 1, 1, true FROM matches WHERE match_code = 'GS-B-02';
