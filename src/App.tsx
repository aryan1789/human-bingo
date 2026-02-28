import './App.css'

// Edit this array to change the 4x4 bingo boxes.
const items: string[] = [
  'Find someone whose name starts with A',
  'Find someone who is ambidextrous',
  'Find someone who prefers morning lectures',
  'Find someone who has a Dog',
  'Find someone who prefers mild weather',
  'Find someone studying a Bachelor of Computer Science',
  'Find someone who spends free time Playing sports',
  'Find someone who prefers Snowy weather',
  'Find someone who can speak multiple languages',
  'Find someone studying Digital Services',
  'Find someone studying Mechanical Engineering',
  'Find someone who prefers Visual learning',
'Find someone who has visited Australia',
'Find someone studying Mechatronics Engineering',
'Find someone who prefers studying with friends',
'Find someone who participates in Gym workouts fitness activities',
'Find someone who commutes by Bike',
'Find someone who doesn\'t drink coffee',
'Find someone who is left handed',
'Find someone in their 2nd year of study',
'Find someone studying Architectural Engineering',
'Find someone who has a pet Fish',
'Find someone in their 1st year of study',
'Find someone who drinks Black coffee',
'Find someone who likes pineapple on pizza',
]

function App() {
  const rows: JSX.Element[] = []
  for (let r = 0; r < 5; r++) {
    const cols: JSX.Element[] = []
    for (let c = 0; c < 5; c++) {
      const idx = r * 5 + c
      cols.push(<td key={c}>{items[idx] ?? ''}</td>)
    }
    rows.push(<tr key={r}>{cols}</tr>)
  }

  return (
    <div>
      <table>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}

export default App
