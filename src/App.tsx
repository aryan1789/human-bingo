import { useState, useEffect } from 'react'
import './App.css'

// Generate 25 randomized bingo statements per user.
// Persisted to a cookie so the same user sees the same card on reload.
const ITEM_COOKIE = 'human_bingo_items_v1'

function pick<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)] }

function randomLetter() {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26))
}

function generateItems(): string[] {
  const handedness = ['left handed', 'right handed', 'ambidextrous']
  const lecture_time = ['Morning', 'Afternoon', 'Evening']
  const pineapple = ['likes', 'dislikes']
  const study_year = ['1st', '2nd', '3rd', '4th+']
  const majors = [
    'Data Science',
    'Mechatronics Engineering',
    'Mechanical Engineering',
    'Maritime',
    'Software Development',
    'Cybersecurity and Networks',
    'Digital Services',
    'Architectural Engineering',
    'Civil Construction Engineering',
    'Electrical and Electronic Engineering'
  ]
  const bachelors = ['Engineering', 'Computer Science']

  const commute = ['Car', 'Bus', 'Train', 'Bike', 'Walking', 'Other']
  const study_pref = ['Alone', 'With friends', 'In a library', 'At home', 'With music']
  const visited = ['Australia', 'Japan', 'America', 'China', 'Russia']
  const fitness = ['Gym workouts', 'Running', 'Team sports', 'Yoga', 'None']
  const weather = ['Hot', 'Cold', 'Rainy', 'Snowy', 'Mild']
  const coffee = ['Black', 'With milk', 'Iced', 'Flavored', 'Doesn\'t drink coffee']
  const learning_style = ['Hands-on', 'Visual', 'Reading/Writing', 'Discussion-based']
  const free_time = ['Gaming', 'Reading', 'Watching movies', 'Playing sports', 'Creative hobbies']
  const pets = ['Dog', 'Cat', 'Fish', 'Bird', 'No pets']
  const works = ['Remotely', 'On campus', 'Part-time', 'Internship', 'None']
  const food = ['Pizza', 'Sushi', 'Burgers', 'Salad', 'Pasta']

  const generators: Array<() => string> = [
    () => `Find someone who is ${pick(handedness)}`,
    () => 'Find someone who can speak multiple languages',
    () => `Find someone whose name starts with ${randomLetter()}`,
    () => `Find someone who prefers ${pick(lecture_time)} lectures`,
    () => `Find someone who ${pick(pineapple)} pineapple on pizza`,
    () => `Find someone in their ${pick(study_year)} year of study`,
    () => `Find someone studying ${pick(majors)}`,
    () => `Find someone studying a Bachelor of ${pick(bachelors)}`,
    () => `Find someone who commutes by ${pick(commute)}`,
    () => `Find someone who prefers studying ${pick(study_pref)}`,
    () => `Find someone who has visited ${pick(visited)}`,
    () => `Find someone who participates in ${pick(fitness)} fitness activities`,
    () => `Find someone who prefers ${pick(weather)} weather`,
    () => `Find someone who drinks ${pick(coffee)} coffee`,
    () => `Find someone who prefers ${pick(learning_style)} learning`,
    () => `Find someone who spends free time ${pick(free_time)}`,
    () => `Find someone who has a ${pick(pets)}`,
    () => 'Find someone who has a pet',
    () => `Find someone who works ${pick(works)}`,
    () => `Find someone who likes ${pick(food)}`,
    () => 'Find someone who is a morning person',
    () => 'Find someone who enjoys cooking',
    () => 'Find someone who prefers tea',
    () => 'Find someone who can roller skate',
    () => 'Find someone who likes board games'
  ]

  const out = new Set<string>()
  // Try generating until we have 25 unique items.
  let attempts = 0
  while (out.size < 25 && attempts < 1000) {
    attempts++
    const g = pick(generators)
    out.add(g())
  }

  // If we still don't have 25 unique (unlikely), fill with generic items.
  const result = Array.from(out)
  while (result.length < 25) result.push(`Find someone interesting #${result.length + 1}`)
  return result.slice(0, 25)
}

function readItemsFromCookie(): string[] | null {
  try {
    const cookie = document.cookie.split('; ').find(row => row.startsWith(`${ITEM_COOKIE}=`))
    if (!cookie) return null
    const val = decodeURIComponent(cookie.split('=')[1] || '')
    const parsed = JSON.parse(val)
    if (Array.isArray(parsed)) return parsed.map(String)
  } catch (e) {
    // ignore
  }
  return null
}

function writeItemsToCookie(items: string[]) {
  try {
    const v = encodeURIComponent(JSON.stringify(items))
    document.cookie = `${ITEM_COOKIE}=${v}; path=/; max-age=${60 * 60 * 24 * 365}`
  } catch (e) {}
}

function App() {
  const COOKIE_NAME = 'human_bingo_names'

  // Initialize items (randomized) from cookie or generate and persist.
  const [items] = useState<string[]>(() => {
    try {
      if (typeof document !== 'undefined') {
        const saved = readItemsFromCookie()
        if (saved) return saved
      }
    } catch (e) {}
    const gen = generateItems()
    try { writeItemsToCookie(gen) } catch (e) {}
    return gen
  })

  // Initialize names from cookie synchronously as before, using items.length
  const [names, setNames] = useState<Array<string | null>>(() => {
    try {
      if (typeof document !== 'undefined') {
        const cookie = document.cookie.split('; ').find(row => row.startsWith(`${COOKIE_NAME}=`))
        if (cookie) {
          const val = decodeURIComponent(cookie.split('=')[1] || '')
          const parsed = JSON.parse(val)
          if (Array.isArray(parsed)) {
            const out: Array<string | null> = Array(items.length).fill(null)
            for (let i = 0; i < Math.min(parsed.length, items.length); i++) {
              out[i] = parsed[i] === null ? null : String(parsed[i])
            }
            return out
          }
        }
      }
    } catch (e) {
      // ignore
    }
    return Array(items.length).fill(null)
  })

  // persist names whenever they change
  useEffect(() => {
    try {
      const v = encodeURIComponent(JSON.stringify(names))
      document.cookie = `${COOKIE_NAME}=${v}; path=/; max-age=${60 * 60 * 24 * 365}`
    } catch (e) {
      // ignore
    }
  }, [names])

  const handleSetName = (idx: number) => {
    const current = names[idx] ?? ''
    const input = window.prompt('Enter name for this square:', current)
    if (input === null) return
    const trimmed = input.trim()
    setNames(prev => {
      const next = [...prev]
      next[idx] = trimmed === '' ? null : trimmed
      return next
    })
  }

  return (
    <div className="container">
      <h1>Human Bingo</h1>
      

      <div className="table-wrap">
      <table className="bingo-table">
        <tbody>
          {Array.from({ length: 5 }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: 5 }).map((_, c) => {
                const idx = r * 5 + c
                return (
                  <td
                    key={c}
                    role={names[idx] ? undefined : 'button'}
                    tabIndex={names[idx] ? -1 : 0}
                    className={`cell ${names[idx] ? 'completed' : ''}`}
                    onClick={() => { if (!names[idx]) handleSetName(idx) }}
                    onKeyDown={(e) => { if (!names[idx] && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handleSetName(idx) } }}
                  >
                    <div className={`item-text ${names[idx] ? 'struck' : ''}`}>{items[idx] ?? ''}</div>
                    {names[idx] && <div className="cell-name"><strong>{names[idx]}</strong></div>}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      </div>
      
<div className="controls">
        <button
          className="reset-button"
          onClick={() => {
            if (!window.confirm('Clear all progress for this device?')) return
            setNames(Array(items.length).fill(null))
            // remove cookie
            try { document.cookie = `${COOKIE_NAME}=; path=/; max-age=0` } catch (e) { }
          }}
        >
          Reset progress
        </button>
      </div>
    </div>
  )
}

export default App
