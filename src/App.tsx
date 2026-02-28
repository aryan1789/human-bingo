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

      <table className="bingo-table">
        <tbody>
          {Array.from({ length: 5 }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: 5 }).map((_, c) => {
                const idx = r * 5 + c
                return (
                  <td
                    key={c}
                    role="button"
                    tabIndex={0}
                    className={`cell ${names[idx] ? 'completed' : ''}`}
                    onClick={() => handleSetName(idx)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSetName(idx) } }}
                  >
                    <div className="item-text">{items[idx] ?? ''}</div>
                    {names[idx] && <div className="cell-name">{names[idx]}</div>}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      

    </div>
  )
}

export default App
