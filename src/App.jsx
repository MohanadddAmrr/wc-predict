import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from './supabase'

// ── Country code mapping for flag images ──
const COUNTRY_CODES = {
  'Mexico': 'mx', 'South Africa': 'za', 'South Korea': 'kr', 'Czechia': 'cz',
  'Canada': 'ca', 'Bosnia & Herzegovina': 'ba', 'USA': 'us', 'Paraguay': 'py',
  'Brazil': 'br', 'Morocco': 'ma', 'Qatar': 'qa', 'Switzerland': 'ch',
  'Australia': 'au', 'Türkiye': 'tr', 'Haiti': 'ht', 'Scotland': 'gb-sct',
  'Germany': 'de', 'Curaçao': 'cw', 'Ivory Coast': 'ci', 'Ecuador': 'ec',
  'Netherlands': 'nl', 'Japan': 'jp', 'Sweden': 'se', 'Tunisia': 'tn',
  'Spain': 'es', 'Cape Verde': 'cv', 'Belgium': 'be', 'Egypt': 'eg',
  'Saudi Arabia': 'sa', 'Uruguay': 'uy', 'Iran': 'ir', 'New Zealand': 'nz',
  'France': 'fr', 'Senegal': 'sn', 'Norway': 'no', 'Uzbekistan': 'uz', 'Iraq': 'iq',
  'Argentina': 'ar', 'Algeria': 'dz', 'Austria': 'at', 'Jordan': 'jo',
  'Portugal': 'pt', 'Colombia': 'co', 'England': 'gb-eng', 'Croatia': 'hr',
  'DR Congo': 'cd', 'Ghana': 'gh', 'Nigeria': 'ng', 'Peru': 'pe', 'Panama': 'pa',
}

const ALL_TEAMS = Object.keys(COUNTRY_CODES).sort()

function FlagImg({ team, size = 28 }) {
  const code = COUNTRY_CODES[team]
  if (!code) return <div style={{ width: size, height: size * 0.75, background: '#333', borderRadius: 3 }} />
  return (
    <img
      src={`https://flagcdn.com/w80/${code}.png`}
      alt={team}
      style={{
        width: size, height: size * 0.75, objectFit: 'cover', borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    />
  )
}

// ── Helpers ──

function getLocalDate() {
  return new Date().toISOString().split('T')[0]
}

function formatMatchDate(utcString) {
  const d = new Date(utcString)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatKickoff(utcString) {
  const d = new Date(utcString)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function isLocked(kickoffUtc) {
  return new Date() >= new Date(kickoffUtc)
}

function calcPoints(pred, result) {
  if (!pred || !result || !result.is_final) return null
  if (pred.home_score === result.home_score && pred.away_score === result.away_score) return 3
  const pO = pred.home_score > pred.away_score ? 'H' : pred.home_score < pred.away_score ? 'A' : 'D'
  const rO = result.home_score > result.away_score ? 'H' : result.home_score < result.away_score ? 'A' : 'D'
  return pO === rO ? 1 : 0
}

function groupMatchesByDate(matches) {
  const groups = {}
  matches.forEach(m => {
    const localDate = new Date(m.kickoff_utc).toLocaleDateString('en-CA')
    if (!groups[localDate]) groups[localDate] = []
    groups[localDate].push(m)
  })
  return groups
}

function calcStreak(predictions, results, userId, matches) {
  const sorted = matches
    .filter(m => {
      const r = results[m.id]
      const p = (predictions[m.id] || []).find(pr => pr.user_id === userId)
      return r && r.is_final && p
    })
    .sort((a, b) => new Date(a.kickoff_utc) - new Date(b.kickoff_utc))

  let streak = 0
  for (let i = sorted.length - 1; i >= 0; i--) {
    const m = sorted[i]
    const p = (predictions[m.id] || []).find(pr => pr.user_id === userId)
    const r = results[m.id]
    const pts = calcPoints(p, r)
    if (pts > 0) streak++
    else break
  }
  return streak
}

function getCountdown(kickoffUtc) {
  const diff = new Date(kickoffUtc) - new Date()
  if (diff <= 0) return null
  const days = Math.floor(diff / 86400000)
  const hrs = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  if (days > 0) return `${days}d ${hrs}h ${mins}m`
  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`
  return `${mins}m ${secs}s`
}

const STAGE_LABELS = {
  group: 'Group Stage', round_of_32: 'Round of 32', round_of_16: 'Round of 16',
  quarter: 'Quarter-Final', semi: 'Semi-Final', third_place: '3rd Place', final: 'Final',
}

// ── Theme ──
const themes = {
  dark: {
    '--bg-primary': '#0f0f14', '--bg-card': '#1c1c28', '--bg-input': '#12121a',
    '--border': '#252535', '--accent': '#6366f1', '--accent-light': '#818cf8',
    '--green': '#10b981', '--amber': '#f59e0b', '--red': '#ef4444',
    '--text-primary': '#ffffff', '--text-secondary': '#aaaaaa', '--text-muted': '#666666',
  },
  light: {
    '--bg-primary': '#f0f1f5', '--bg-card': '#ffffff', '--bg-input': '#f5f5f8',
    '--border': '#dfe1e8', '--accent': '#4f46e5', '--accent-light': '#6366f1',
    '--green': '#059669', '--amber': '#d97706', '--red': '#dc2626',
    '--text-primary': '#111827', '--text-secondary': '#6b7280', '--text-muted': '#9ca3af',
  }
}

function applyTheme(mode) {
  const vars = themes[mode]
  Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v))
}

// ── Tournament Winner Picker Modal ──

function WinnerPickerModal({ onPick }) {
  const [search, setSearch] = useState('')
  const filtered = ALL_TEAMS.filter(t => t.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={ms.modalOverlay}>
      <div style={ms.modalCard}>
        <h2 style={ms.modalTitle}>Pick the World Cup Winner</h2>
        <p style={ms.modalSub}>This is locked once you choose. If your team wins, you get +5 bonus points.</p>
        <input
          style={ms.modalSearch}
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
        />
        <div style={ms.modalList}>
          {filtered.map(team => (
            <button
              key={team}
              style={ms.modalTeamBtn}
              onClick={() => {
                if (confirm(`Lock in ${team} as your World Cup winner pick? This cannot be changed.`)) {
                  onPick(team)
                }
              }}
            >
              <FlagImg team={team} size={24} />
              <span>{team}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Countdown Hook ──
function useCountdown(kickoffUtc) {
  const [cd, setCd] = useState(getCountdown(kickoffUtc))
  useEffect(() => {
    if (!getCountdown(kickoffUtc)) { setCd(null); return }
    const iv = setInterval(() => {
      const val = getCountdown(kickoffUtc)
      setCd(val)
      if (!val) clearInterval(iv)
    }, 1000)
    return () => clearInterval(iv)
  }, [kickoffUtc])
  return cd
}

// ── Auth Screen ──

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({
          email, password, options: { data: { display_name: displayName } }
        })
        if (err) throw err
        onAuth(data.user)
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
        onAuth(data.user)
      }
    } catch (err) { setError(err.message) }
    setLoading(false)
  }

  return (
    <div style={s.authScreen}>
      <div style={s.authCard}>
        <h1 style={s.authTitle}>WC 2026</h1>
        <p style={s.authSub}>PREDICTION GAME</p>
        <div style={s.authToggle}>
          <button onClick={() => setMode('login')} style={{ ...s.authToggleBtn, ...(mode === 'login' ? s.authToggleActive : {}) }}>Login</button>
          <button onClick={() => setMode('signup')} style={{ ...s.authToggleBtn, ...(mode === 'signup' ? s.authToggleActive : {}) }}>Sign Up</button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && <input style={s.authInput} type="text" placeholder="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} required />}
          <input style={s.authInput} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={s.authInput} type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
          {error && <p style={s.authError}>{error}</p>}
          <button type="submit" style={s.authBtn} disabled={loading}>{loading ? 'Loading...' : mode === 'login' ? 'Log In' : 'Create Account'}</button>
        </form>
      </div>
    </div>
  )
}

// ── Match Card ──

function MatchCard({ match, myPrediction, allPredictions, result, onPredict, currentUserId, profiles }) {
  const locked = isLocked(match.kickoff_utc)
  const pts = myPrediction ? calcPoints(myPrediction, result) : null
  const [homeVal, setHomeVal] = useState(myPrediction?.home_score?.toString() ?? '')
  const [awayVal, setAwayVal] = useState(myPrediction?.away_score?.toString() ?? '')
  const countdown = useCountdown(match.kickoff_utc)

  useEffect(() => {
    setHomeVal(myPrediction?.home_score?.toString() ?? '')
    setAwayVal(myPrediction?.away_score?.toString() ?? '')
  }, [myPrediction])

  const handleChange = (side, value) => {
    const v = value.replace(/\D/g, '').slice(0, 2)
    if (side === 'home') setHomeVal(v); else setAwayVal(v)
  }

  const handleBlur = () => {
    if (homeVal !== '' && awayVal !== '') onPredict(match.id, parseInt(homeVal), parseInt(awayVal))
  }

  const otherPreds = allPredictions.filter(p => p.user_id !== currentUserId)

  return (
    <div style={s.matchCard}>
      <div style={s.matchHeader}>
        <span style={{
          ...s.stageBadge,
          background: match.stage === 'group' ? 'var(--accent)' : match.stage === 'final' ? '#d4af37' : '#8b5cf6'
        }}>
          {match.stage === 'group' ? `Group ${match.group_name}` : STAGE_LABELS[match.stage]}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={s.venue}>{match.venue}</span>
          {locked && <span style={s.lockBadge}>LOCKED</span>}
        </div>
      </div>

      <div style={s.matchTeams}>
        <div style={s.teamSide}>
          <FlagImg team={match.home_team} size={36} />
          <span style={s.teamName}>{match.home_team}</span>
        </div>

        {result?.is_final ? (
          <div style={s.scoreFinal}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={s.scoreNum}>{result.home_score}</span>
              <span style={{ color: 'var(--text-muted)' }}>-</span>
              <span style={s.scoreNum}>{result.away_score}</span>
            </div>
            <span style={s.ftBadge}>FT</span>
          </div>
        ) : (
          <div style={s.kickoffTime}>
            {countdown ? (
              <span style={s.countdownText}>{countdown}</span>
            ) : (
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{formatKickoff(match.kickoff_utc)}</span>
            )}
            {match.is_tbd && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>TBD</span>}
          </div>
        )}

        <div style={{ ...s.teamSide, alignItems: 'flex-end' }}>
          <FlagImg team={match.away_team} size={36} />
          <span style={s.teamName}>{match.away_team}</span>
        </div>
      </div>

      {!match.is_tbd && (
        <div style={s.predSection}>
          <span style={s.predLabel}>{locked ? 'YOUR PREDICTION' : 'ENTER YOUR PREDICTION'}</span>
          <div style={s.predRow}>
            <input style={{ ...s.predInput, ...(locked ? s.predInputLocked : {}) }} type="text" inputMode="numeric" maxLength={2} value={homeVal} onChange={e => handleChange('home', e.target.value)} onBlur={handleBlur} disabled={locked} placeholder="-" />
            <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 18 }}>:</span>
            <input style={{ ...s.predInput, ...(locked ? s.predInputLocked : {}) }} type="text" inputMode="numeric" maxLength={2} value={awayVal} onChange={e => handleChange('away', e.target.value)} onBlur={handleBlur} disabled={locked} placeholder="-" />
          </div>
          {pts !== null && (
            <div style={{ ...s.ptsBadge, background: pts === 3 ? 'var(--green)' : pts === 1 ? 'var(--amber)' : 'var(--red)' }}>
              {pts === 3 ? 'EXACT SCORE  +3' : pts === 1 ? 'CORRECT  +1' : 'WRONG  0'}
            </div>
          )}
        </div>
      )}

      {/* Others' predictions — ONLY visible after match locks */}
      {locked && otherPreds.length > 0 && (
        <div style={s.othersSection}>
          {otherPreds.map(p => {
            const oPts = calcPoints(p, result)
            const name = profiles[p.user_id] || 'Unknown'
            return (
              <div key={p.user_id} style={s.otherRow}>
                <span style={s.otherName}>{name}</span>
                <span style={s.otherPred}>{p.home_score} - {p.away_score}</span>
                {oPts !== null && (
                  <span style={{ ...s.otherPts, color: oPts === 3 ? 'var(--green)' : oPts === 1 ? 'var(--amber)' : 'var(--red)' }}>+{oPts}</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Admin Panel ──

function AdminPanel({ matches, results, onSaveResult }) {
  const [editing, setEditing] = useState({})
  const handleChange = (matchId, side, value) => {
    const v = value.replace(/\D/g, '').slice(0, 2)
    setEditing(prev => ({ ...prev, [matchId]: { ...prev[matchId], [side]: v } }))
  }
  const handleSave = async (matchId) => {
    const edit = editing[matchId]
    if (!edit || edit.home === undefined || edit.away === undefined) return
    await onSaveResult(matchId, parseInt(edit.home), parseInt(edit.away))
  }

  return (
    <div style={s.adminSection}>
      <h3 style={{ color: 'var(--text-primary)', fontSize: 13, marginBottom: 12, fontWeight: 600, letterSpacing: 0.5 }}>ENTER RESULTS</h3>
      {matches.map(m => {
        const existing = results[m.id]
        const edit = editing[m.id] || { home: existing?.home_score?.toString() ?? '', away: existing?.away_score?.toString() ?? '' }
        return (
          <div key={m.id} style={s.adminRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
              <FlagImg team={m.home_team} size={18} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.home_team} vs {m.away_team}</span>
              <FlagImg team={m.away_team} size={18} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input style={s.adminInput} type="text" inputMode="numeric" maxLength={2} value={edit.home} onChange={e => handleChange(m.id, 'home', e.target.value)} />
              <span style={{ color: 'var(--text-muted)' }}>:</span>
              <input style={s.adminInput} type="text" inputMode="numeric" maxLength={2} value={edit.away} onChange={e => handleChange(m.id, 'away', e.target.value)} />
              <button onClick={() => handleSave(m.id)} style={s.adminSaveBtn}>Save</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main App ──

export default function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [matches, setMatches] = useState([])
  const [predictions, setPredictions] = useState({})
  const [results, setResults] = useState({})
  const [leaderboard, setLeaderboard] = useState([])
  const [profiles, setProfiles] = useState({})
  const [winnerPick, setWinnerPick] = useState(undefined) // undefined=loading, null=not picked, string=picked
  const [allWinnerPicks, setAllWinnerPicks] = useState({})
  const [selectedDate, setSelectedDate] = useState(getLocalDate())
  const [tab, setTab] = useState('matches')
  const [showAdmin, setShowAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(() => localStorage.getItem('wc-theme') || 'dark')
  const [refreshing, setRefreshing] = useState(false)

  // Pull to refresh
  const containerRef = useRef(null)
  const touchStartY = useRef(0)

  useEffect(() => { applyTheme(theme) }, [theme])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('wc-theme', next)
  }

  // ── Auth ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthChecked(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    fetchAll()
    requestNotificationPermission()
  }, [user])

  // ── Notification permission ──
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  // ── Check for unpredicted matches every 30 min ──
  useEffect(() => {
    if (!user || !matches.length) return
    const check = () => {
      const today = getLocalDate()
      const todayMatches = matches.filter(m => {
        const d = new Date(m.kickoff_utc).toLocaleDateString('en-CA')
        return d === today && !isLocked(m.kickoff_utc) && !m.is_tbd
      })
      const unpredicted = todayMatches.filter(m => {
        const myPred = (predictions[m.id] || []).find(p => p.user_id === user.id)
        return !myPred
      })
      if (unpredicted.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('WC 2026 Predictions', {
          body: `You have ${unpredicted.length} match${unpredicted.length > 1 ? 'es' : ''} to predict today!`,
          icon: 'https://flagcdn.com/w80/un.png',
        })
      }
    }
    const timeout = setTimeout(check, 5000)
    const interval = setInterval(check, 1800000)
    return () => { clearTimeout(timeout); clearInterval(interval) }
  }, [user, matches, predictions])

  const fetchAll = async () => {
    setLoading(true)
    await Promise.all([fetchProfile(), fetchMatches(), fetchProfiles(), fetchLeaderboard(), fetchWinnerPicks()])
    setLoading(false)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchMatches(), fetchProfiles(), fetchLeaderboard(), fetchWinnerPicks()])
    setRefreshing(false)
  }

  // Pull to refresh handlers
  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY }
  const handleTouchEnd = async (e) => {
    const delta = e.changedTouches[0].clientY - touchStartY.current
    const el = containerRef.current
    if (delta > 100 && el && el.scrollTop <= 0) {
      await handleRefresh()
    }
  }

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) setProfile(data)
  }

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('id, display_name')
    if (data) {
      const map = {}
      data.forEach(p => { map[p.id] = p.display_name })
      setProfiles(map)
    }
  }

  const fetchMatches = async () => {
    const { data: matchData } = await supabase.from('matches').select('*').order('kickoff_utc', { ascending: true })
    if (matchData) {
      setMatches(matchData)
      const { data: predData } = await supabase.from('predictions').select('*')
      if (predData) {
        const predMap = {}
        predData.forEach(p => { if (!predMap[p.match_id]) predMap[p.match_id] = []; predMap[p.match_id].push(p) })
        setPredictions(predMap)
      }
      const { data: resData } = await supabase.from('results').select('*')
      if (resData) {
        const resMap = {}
        resData.forEach(r => { resMap[r.match_id] = r })
        setResults(resMap)
      }
    }
  }

  const fetchLeaderboard = async () => {
    const { data } = await supabase.from('leaderboard').select('*')
    if (data) setLeaderboard(data)
  }

  const fetchWinnerPicks = async () => {
    const { data } = await supabase.from('tournament_winner_picks').select('*')
    if (data) {
      const map = {}
      data.forEach(p => { map[p.user_id] = p.team_name })
      setAllWinnerPicks(map)
      setWinnerPick(map[user.id] || null)
    } else {
      setWinnerPick(null)
    }
  }

  const handlePickWinner = async (team) => {
    const { error } = await supabase.from('tournament_winner_picks').insert({ user_id: user.id, team_name: team })
    if (error) { alert('Failed to save pick: ' + error.message); return }
    setWinnerPick(team)
    setAllWinnerPicks(prev => ({ ...prev, [user.id]: team }))
  }

  const handlePredict = async (matchId, homeScore, awayScore) => {
    const { error } = await supabase.from('predictions').upsert({
      user_id: user.id, match_id: matchId, home_score: homeScore, away_score: awayScore,
    }, { onConflict: 'user_id,match_id' })
    if (error) {
      if (error.message.includes('row-level security')) alert('Predictions are locked - this match has already started!')
      else console.error(error)
      return
    }
    setPredictions(prev => {
      const existing = (prev[matchId] || []).filter(p => p.user_id !== user.id)
      return { ...prev, [matchId]: [...existing, { user_id: user.id, match_id: matchId, home_score: homeScore, away_score: awayScore }] }
    })
  }

  const handleSaveResult = async (matchId, homeScore, awayScore) => {
    const { error } = await supabase.from('results').upsert({
      match_id: matchId, home_score: homeScore, away_score: awayScore, is_final: true,
    }, { onConflict: 'match_id' })
    if (error) { alert('Failed: ' + error.message); return }
    setResults(prev => ({ ...prev, [matchId]: { match_id: matchId, home_score: homeScore, away_score: awayScore, is_final: true } }))
    fetchLeaderboard()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null); setProfile(null)
  }

  // ── Render ──

  if (!authChecked) return <div style={s.loading}><p style={{ color: 'var(--text-secondary)' }}>Loading...</p></div>
  if (!user) return <AuthScreen onAuth={setUser} />
  if (loading) return <div style={s.loading}><p style={{ color: 'var(--text-secondary)' }}>Loading matches...</p></div>

  // Show winner picker modal if user hasn't picked yet
  if (winnerPick === null) return <WinnerPickerModal onPick={handlePickWinner} />

  const matchesByDate = groupMatchesByDate(matches)
  const allDates = Object.keys(matchesByDate).sort()
  const todayMatches = matchesByDate[selectedDate] || []
  const today = getLocalDate()
  const streak = calcStreak(predictions, results, user.id, matches)

  return (
    <div style={s.container} ref={containerRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Pull to refresh indicator */}
      {refreshing && <div style={s.refreshBar}>Refreshing...</div>}

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.headerTitle}>WC 2026</h1>
          <p style={s.headerSub}>{profile?.display_name || user.email}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={toggleTheme} style={s.themeBtn}>{theme === 'dark' ? 'Light' : 'Dark'}</button>
          <button onClick={handleLogout} style={s.logoutBtn}>Log Out</button>
        </div>
      </div>

      {/* Streak + Winner Pick bar */}
      <div style={s.statsBar}>
        <div style={s.statItem}>
          <span style={s.statValue}>{streak}</span>
          <span style={s.statLabel}>STREAK</span>
        </div>
        <div style={{ width: 1, height: 28, background: 'var(--border)' }} />
        <div style={s.statItem}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FlagImg team={winnerPick} size={20} />
            <span style={{ ...s.statValue, fontSize: 13 }}>{winnerPick}</span>
          </div>
          <span style={s.statLabel}>YOUR WINNER PICK</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {['matches', 'leaderboard'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}>
            {t === 'matches' ? 'Matches' : 'Leaderboard'}
          </button>
        ))}
      </div>

      {tab === 'matches' ? (
        <>
          <div style={s.datePicker}>
            {allDates.map(d => {
              const isToday = d === today
              const isSelected = d === selectedDate
              const dd = new Date(d + 'T12:00:00')
              return (
                <button key={d} onClick={() => setSelectedDate(d)} style={{ ...s.dateBtn, ...(isSelected ? s.dateBtnActive : {}), ...(isToday && !isSelected ? s.dateBtnToday : {}) }}>
                  <span style={{ fontSize: 10, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.5 }}>{dd.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{dd.getDate()}</span>
                  <span style={{ fontSize: 9, opacity: 0.6, textTransform: 'uppercase' }}>{dd.toLocaleDateString('en-US', { month: 'short' })}</span>
                </button>
              )
            })}
          </div>

          {/* Today quick-jump */}
          {selectedDate !== today && allDates.includes(today) && (
            <div style={{ textAlign: 'center', padding: '0 16px 8px' }}>
              <button onClick={() => setSelectedDate(today)} style={s.todayJump}>Jump to Today</button>
            </div>
          )}

          <h2 style={s.dateTitle}>{formatMatchDate(selectedDate + 'T12:00:00')}</h2>

          <div style={s.matchList}>
            {todayMatches.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40, fontSize: 14 }}>No matches on this day</p>}
            {todayMatches.map(match => (
              <MatchCard key={match.id} match={match}
                myPrediction={(predictions[match.id] || []).find(p => p.user_id === user.id)}
                allPredictions={predictions[match.id] || []}
                result={results[match.id]} onPredict={handlePredict}
                currentUserId={user.id} profiles={profiles}
              />
            ))}
          </div>

          {profile?.is_admin && (
            <div style={{ padding: '16px' }}>
              <button onClick={() => setShowAdmin(!showAdmin)} style={s.adminToggle}>{showAdmin ? 'Hide Results Panel' : 'Enter Results (Admin)'}</button>
              {showAdmin && <AdminPanel matches={todayMatches} results={results} onSaveResult={handleSaveResult} />}
            </div>
          )}

          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <button onClick={handleRefresh} style={s.refreshBtn}>{refreshing ? 'Refreshing...' : 'Refresh Data'}</button>
          </div>
        </>
      ) : (
        <div style={s.lbContainer}>
          <div style={s.lbHeader}>
            <h2 style={s.lbTitle}>Leaderboard</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 4 }}>
              Correct = 1pt  /  Exact = 3pts  /  Winner pick = +5 bonus
            </p>
          </div>
          {leaderboard.map((p, i) => {
            const pStreak = calcStreak(predictions, results, p.user_id, matches)
            const wpick = allWinnerPicks[p.user_id]
            return (
              <div key={p.user_id} style={{ ...s.lbRow, ...(i === 0 && p.total_points > 0 ? s.lbFirst : {}), ...(p.user_id === user.id ? { borderLeft: '3px solid var(--accent-light)' } : {}) }}>
                <div style={s.lbRank}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <span style={s.lbName}>{p.display_name}</span>
                  <span style={s.lbDetail}>
                    {p.exact_scores} exact / {p.correct_results} correct / {pStreak} streak
                  </span>
                  {wpick && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                      <FlagImg team={wpick} size={14} />
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Winner pick: {wpick}</span>
                    </div>
                  )}
                </div>
                <div style={s.lbPoints}>{p.total_points}</div>
              </div>
            )
          })}
          <button onClick={fetchLeaderboard} style={{ ...s.logoutBtn, margin: '20px auto', display: 'block' }}>Refresh</button>
        </div>
      )}
    </div>
  )
}

// ── Styles ──
const s = {
  loading: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' },
  container: { minHeight: '100vh', background: 'var(--bg-primary)', maxWidth: 480, margin: '0 auto', paddingBottom: 40, overflowY: 'auto' },
  refreshBar: { textAlign: 'center', padding: '8px', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 600 },
  authScreen: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #0f0f14 0%, #1a1a2e 100%)', padding: 20 },
  authCard: { background: 'var(--bg-card)', borderRadius: 16, padding: '44px 28px', textAlign: 'center', maxWidth: 360, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '1px solid var(--border)' },
  authTitle: { fontSize: 32, fontWeight: 800, letterSpacing: -1, margin: 0, color: 'var(--text-primary)' },
  authSub: { color: 'var(--accent-light)', fontSize: 12, marginTop: 4, marginBottom: 28, fontWeight: 600, letterSpacing: 3 },
  authToggle: { display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg-input)', borderRadius: 10, padding: 4 },
  authToggleBtn: { flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 },
  authToggleActive: { background: 'var(--accent)', color: '#fff' },
  authInput: { width: '100%', padding: '14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', marginBottom: 10, boxSizing: 'border-box' },
  authError: { color: 'var(--red)', fontSize: 13, marginBottom: 8 },
  authBtn: { width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', color: '#fff', fontSize: 14, fontWeight: 700, marginTop: 4 },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 8px', position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 10 },
  headerTitle: { fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: -0.5, color: 'var(--text-primary)' },
  headerSub: { color: 'var(--text-secondary)', fontSize: 12, margin: 0, fontWeight: 500 },
  logoutBtn: { padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 },
  themeBtn: { padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 },
  statsBar: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '10px 16px', margin: '0 16px 4px', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  statValue: { fontSize: 18, fontWeight: 800, color: 'var(--accent-light)' },
  statLabel: { fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 1.5 },
  tabs: { display: 'flex', gap: 4, padding: '8px 16px' },
  tab: { flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: 'var(--bg-card)', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', letterSpacing: 0.3 },
  tabActive: { background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', color: '#fff' },
  datePicker: { display: 'flex', gap: 6, padding: '12px 16px', overflowX: 'auto', scrollbarWidth: 'none' },
  dateBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 10px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)', minWidth: 48, flexShrink: 0 },
  dateBtnActive: { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' },
  dateBtnToday: { borderColor: 'var(--accent-light)' },
  todayJump: { background: 'none', border: '1px solid var(--accent)', color: 'var(--accent-light)', padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600 },
  dateTitle: { fontSize: 15, fontWeight: 700, padding: '4px 16px 8px', margin: 0, letterSpacing: 0.3, color: 'var(--text-primary)' },
  matchList: { padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 },
  matchCard: { background: 'var(--bg-card)', borderRadius: 14, padding: 16, border: '1px solid var(--border)' },
  matchHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  stageBadge: { color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 6, letterSpacing: 0.5, textTransform: 'uppercase' },
  venue: { color: 'var(--text-muted)', fontSize: 11, fontWeight: 500 },
  lockBadge: { fontSize: 9, fontWeight: 700, color: 'var(--red)', letterSpacing: 1, border: '1px solid rgba(239,68,68,0.3)', padding: '2px 6px', borderRadius: 4 },
  matchTeams: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  teamSide: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, flex: 1 },
  teamName: { color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 },
  scoreFinal: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  scoreNum: { fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' },
  ftBadge: { background: 'var(--green)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, letterSpacing: 1 },
  kickoffTime: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  countdownText: { fontSize: 13, fontWeight: 700, color: 'var(--amber)', fontVariantNumeric: 'tabular-nums' },
  predSection: { background: 'var(--bg-input)', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  predLabel: { color: 'var(--text-muted)', fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' },
  predRow: { display: 'flex', alignItems: 'center', gap: 10 },
  predInput: { width: 52, height: 48, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 22, fontWeight: 700, textAlign: 'center', outline: 'none' },
  predInputLocked: { opacity: 0.5, cursor: 'not-allowed' },
  ptsBadge: { padding: '5px 14px', borderRadius: 6, color: '#fff', fontSize: 11, fontWeight: 700, marginTop: 2, letterSpacing: 0.5 },
  othersSection: { marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 8 },
  otherRow: { display: 'flex', alignItems: 'center', padding: '5px 0', gap: 8 },
  otherName: { color: 'var(--text-secondary)', fontSize: 12, flex: 1, fontWeight: 500 },
  otherPred: { color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 },
  otherPts: { fontSize: 13, fontWeight: 700, width: 24, textAlign: 'right' },
  adminToggle: { background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 12, padding: '8px 16px', borderRadius: 8, fontWeight: 500 },
  adminSection: { background: 'var(--bg-card)', borderRadius: 12, padding: 14, marginTop: 10, border: '1px solid var(--border)' },
  adminRow: { display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--bg-input)', gap: 8 },
  adminInput: { width: 38, height: 34, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 16, fontWeight: 700, textAlign: 'center', outline: 'none' },
  adminSaveBtn: { padding: '6px 12px', borderRadius: 6, border: 'none', background: 'var(--green)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 0.5 },
  refreshBtn: { background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 600 },
  lbContainer: { padding: '0 16px' },
  lbHeader: { marginBottom: 16, textAlign: 'center' },
  lbTitle: { fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.5, color: 'var(--text-primary)' },
  lbRow: { display: 'flex', alignItems: 'center', padding: '14px 16px', background: 'var(--bg-card)', borderRadius: 12, marginBottom: 8, gap: 14, border: '1px solid var(--border)' },
  lbFirst: { background: 'linear-gradient(135deg, var(--bg-card), #2d2b4e)', borderColor: 'var(--accent)' },
  lbRank: { color: 'var(--text-secondary)', fontSize: 14, fontWeight: 700, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-input)', borderRadius: 8 },
  lbName: { color: 'var(--text-primary)', fontSize: 14, fontWeight: 700, display: 'block' },
  lbDetail: { color: 'var(--text-muted)', fontSize: 11, fontWeight: 500 },
  lbPoints: { color: 'var(--accent-light)', fontSize: 28, fontWeight: 800 },
}

// ── Modal styles ──
const ms = {
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 },
  modalCard: { background: 'var(--bg-card)', borderRadius: 16, padding: '28px 24px', maxWidth: 380, width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' },
  modalTitle: { fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--text-primary)', textAlign: 'center' },
  modalSub: { fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center', margin: '8px 0 16px', lineHeight: 1.5 },
  modalSearch: { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', marginBottom: 12, boxSizing: 'border-box' },
  modalList: { overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 },
  modalTeamBtn: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'left', width: '100%' },
}

