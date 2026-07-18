import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { generateItems, BOARD_SIZE } from './prompts'

const ITEM_COOKIE = 'human_bingo_items_v1'

function readItemsFromCookie(): string[] | null {
  try {
    const cookie = document.cookie.split('; ').find(row => row.startsWith(`${ITEM_COOKIE}=`))
    if (!cookie) return null
    const parsed = JSON.parse(decodeURIComponent(cookie.split('=')[1] || ''))
    if (Array.isArray(parsed)) return parsed.map(String)
  } catch (e) {}
  return null
}

function writeItemsToCookie(items: string[]) {
  try {
    document.cookie = `${ITEM_COOKIE}=${encodeURIComponent(JSON.stringify(items))}; path=/; max-age=${60 * 60 * 24 * 365}`
  } catch (e) {}
}

interface Particle {
  id: number; x: number; y: number; vx: number; vy: number
  rot: number; rotV: number; color: string; shape: 'rect' | 'circle'
  size: number; opacity: number
}

const CONFETTI_COLORS = ['#f97316','#eab308','#22c55e','#3b82f6','#a855f7','#ec4899','#06b6d4','#ef4444']

function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])
  useEffect(() => {
    if (!active) { setParticles([]); return }
    const initial: Particle[] = Array.from({ length: 90 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: -10,
      vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3,
      rot: Math.random() * 360, rotV: (Math.random() - 0.5) * 10,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      size: 8 + Math.random() * 10, opacity: 1,
    }))
    setParticles(initial)
    let frame: number
    const animate = () => {
      setParticles(prev => prev
        .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, rot: p.rot + p.rotV, vy: p.vy + 0.07,
          opacity: p.y > 85 ? Math.max(0, p.opacity - 0.03) : p.opacity }))
        .filter(p => p.opacity > 0 && p.y < 115)
      )
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [active])
  if (!particles.length) return null
  return (
    <div className="confetti-container" aria-hidden="true">
      {particles.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.shape === 'rect' ? p.size * 0.45 : p.size,
          borderRadius: p.shape === 'circle' ? '50%' : '2px',
          background: p.color, transform: `rotate(${p.rot}deg)`, opacity: p.opacity,
        }} />
      ))}
    </div>
  )
}

function isBoardComplete(names: Array<string | null>): boolean {
  return names.length === 16 && names.every(n => n !== null && n.trim() !== '')
}

function App() {
  const COOKIE_NAME = 'human_bingo_names'

  const [items] = useState<string[]>(() => {
    try {
      if (typeof document !== 'undefined') {
        const saved = readItemsFromCookie()
        if (saved) return saved.slice(0, BOARD_SIZE)
      }
    } catch (e) {}
    const gen = generateItems()
    try { writeItemsToCookie(gen) } catch (e) {}
    return gen
  })

  const [names, setNames] = useState<Array<string | null>>(() => {
    try {
      if (typeof document !== 'undefined') {
        const cookie = document.cookie.split('; ').find(row => row.startsWith(`${COOKIE_NAME}=`))
        if (cookie) {
          const parsed = JSON.parse(decodeURIComponent(cookie.split('=')[1] || ''))
          if (Array.isArray(parsed)) {
            const out: Array<string | null> = Array(items.length).fill(null)
            for (let i = 0; i < Math.min(parsed.length, items.length); i++) {
              out[i] = parsed[i] === null ? null : String(parsed[i])
            }
            return out
          }
        }
      }
    } catch (e) {}
    return Array(items.length).fill(null)
  })

  useEffect(() => {
    try {
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(names))}; path=/; max-age=${60 * 60 * 24 * 365}`
    } catch (e) {}
  }, [names])

  const [showIntro, setShowIntro] = useState(true)
  const [showWin, setShowWin] = useState(false)
  const [confettiActive, setConfettiActive] = useState(false)
  const [winDismissed, setWinDismissed] = useState(false)

  const completedCount = names.filter(n => n !== null && n.trim() !== '').length

  useEffect(() => {
    if (isBoardComplete(names) && !showWin && !winDismissed) {
      setShowWin(true)
      setConfettiActive(true)
      setTimeout(() => setConfettiActive(false), 5000)
    }
    // reset dismissed flag if board becomes incomplete again
    if (!isBoardComplete(names) && winDismissed) setWinDismissed(false)
  }, [names, showWin, winDismissed])

  // Any cell can be clicked — filled cells open in edit mode
  const handleSetName = useCallback((idx: number) => {
    const current = names[idx] ?? ''
    const input = window.prompt('Enter name for this square:', current)
    if (input === null) return
    const trimmed = input.trim()
    setNames(prev => {
      const next = [...prev]
      next[idx] = trimmed === '' ? null : trimmed
      return next
    })
  }, [names])

  return (
    <div className="container">
      <Confetti active={confettiActive} />

      <header className="app-header">
        <h1 className="app-title">Human Bingo</h1>
        <div className="progress-wrap">
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${(completedCount / 16) * 100}%` }} />
          </div>
          <span className="progress-label">{completedCount} / 16</span>
        </div>
      </header>

      {showIntro && (
        <div className="instructions-banner">
          <p className="instructions-text">
            <strong>How to play:</strong> Chat with people around you. When someone matches a square, tap it and enter their name. Tap a filled square again to edit the name. Fill the whole board to win!
          </p>
          <button className="instructions-close" aria-label="Dismiss instructions" onClick={() => setShowIntro(false)}>✕</button>
        </div>
      )}

      {showWin && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="win-title">
          <div className="modal win-modal">
            <div className="win-emoji">🎉</div>
            <h2 id="win-title">Board Complete!</h2>
            <p>You've connected with everyone. Incredible work!</p>
            <button className="modal-dismiss-btn" onClick={() => { setShowWin(false); setWinDismissed(true); }}>View my board</button>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <div className="bingo-grid" role="grid" aria-label="Human Bingo">
          {items.map((item, idx) => (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              className={`cell ${names[idx] ? 'completed' : ''}`}
              onClick={() => handleSetName(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault(); handleSetName(idx)
                }
              }}
              data-index={idx}
              aria-label={names[idx] ? `${item} — ${names[idx]} (tap to edit)` : item}
            >
              <div className={`item-text ${names[idx] ? 'struck' : ''}`}>{item ?? ''}</div>
              {names[idx] && <div className="cell-name">{names[idx]}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="controls">
        <button
          className="reset-button"
          onClick={() => {
            if (!window.confirm('Clear all progress for this device?')) return
            setNames(Array(items.length).fill(null))
            setShowWin(false)
            try { document.cookie = `${COOKIE_NAME}=; path=/; max-age=0` } catch (e) {}
          }}
        >
          Reset progress
        </button>
      </div>
    </div>
  )
}

export default App
