import { useState } from 'react'
import './App.css'

const items: string[] = [
  'Find someone whose name starts with A',
  'Find someone who is ambidextrous',
  'Find someone who prefers Morning lectures',
  'Find someone who has a Dog',
  'Find someone who prefers Mild weather',
  'Find someone studying a Bachelor of Computer Science',
  'Find someone who spends free time Playing sports',
  'Find someone who prefers Snowy weather',
  'Find someone who can speak multiple languages',
  'Find someone studying Digital Services',
  'Find someone studying Mechanical Engineering',
  'Find someone who prefers Visual learning',
  'Find someone who has visited Australia',
  'Find someone studying Mechatronics Engineering',
  'Find someone who prefers studying With friends',
  'Find someone who participates in Gym workouts fitness activities',
  'Find someone who commutes by Bike',
  'Find someone who drinks Doesn’t drink coffee',
  'Find someone who is left handed',
  'Find someone in their 2nd year of study',
  'Find someone studying Architectural Engineering',
  'Find someone who has a Fish',
  'Find someone in their 1st year of study',
  'Find someone who drinks Black coffee',
  'Find someone who likes pineapple on pizza',
]

function App() {
  const [names, setNames] = useState<Array<string | null>>(Array(items.length).fill(null))

  const rows: JSX.Element[] = []
  for (let r = 0; r < 5; r++) {
    const cols: JSX.Element[] = []
    for (let c = 0; c < 5; c++) {
      const idx = r * 5 + c
      const filled = !!names[idx]
      cols.push(
        <td
          key={c}
          className={filled ? 'completed' : ''}
          onClick={() => {
            const current = names[idx] ?? ''
            const input = window.prompt('Enter name for this square:', current)
            if (input === null) return
            const trimmed = input.trim()
            if (trimmed === '') return
            setNames(prev => {
              const next = [...prev]
              next[idx] = trimmed
              return next
            })
          }}
          style={{ cursor: 'pointer' }}
        >
          <div>{items[idx] ?? ''}</div>
          {filled && <div className="cell-name">— {names[idx]}</div>}
        </td>
      )
    }
    rows.push(<tr key={r}>{cols}</tr>)
  }

  const found = names
    .map((n, i) => (n ? { name: n, item: items[i] } : null))
    .filter(Boolean) as Array<{ name: string; item: string }>

  return (
    <div>
      <h1>Human Bingo</h1>
      <table>
        <tbody>{rows}</tbody>
      </table>

      <h2>Completed Squares</h2>
      {found.length === 0 ? (
        <p>No completed squares yet.</p>
      ) : (
        <ul>
          {found.map((f, i) => (
            <li key={i}>{f.name} — {f.item}</li>
          ))}
        </ul>
      )}

    </div>
  )
}

export default App
