// ============================================================
// Human Bingo — single source of truth for all prompts.
//
// Edit prompt wording / pools HERE ONLY. Both the web app
// (src/App.tsx) and the printable page (src/print.ts) import
// from this file, so a change here updates both.
// ============================================================

export const BOARD_SIZE = 16

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// "Name starts with…" only draws from these letters, with A weighted heaviest.
export const NAME_LETTERS = ['A', 'A', 'A', 'M', 'J', 'K', 'C', 'R', 'L', 'E', 'B', 'S', 'D']

// Answer pools for the fill-in-the-blank prompts.
const handedness = ['left handed', 'right handed', 'ambidextrous']
const lecture_time = ['Morning', 'Afternoon', 'Evening']
const pineapple = ['likes', 'dislikes']
const study_year = ['1st', '2nd', '3rd', '4th+']
const bachelors = ['Engineering', 'Computer Science', 'Science']
const commute = ['car', 'bus', 'train', 'walking']
const study_pref = ['alone', 'with friends', 'in a library', 'at home', 'with music']
const visited = ['Auckland', 'Wellington', 'Queenstown', 'Rotorua', 'Christchurch', 'Dunedin', 'Hamilton']
const fitness = ['gym workouts', 'running', 'team sports', 'yoga']
const weather = ['hot', 'cold', 'rainy']
const drinks = ['coffee', 'tea', 'energy drinks']
const free_time = ['gaming', 'reading', 'watching movies', 'playing sports', 'doing arts and crafts']
const pets = ['dog', 'cat', 'fish', 'bird', 'brother', 'sister']
const food = ['pizza', 'sushi', 'burgers', 'salad', 'pasta']

// Each generator returns one bingo prompt. Add / remove / reword here.
const generators: Array<() => string> = [
  () => `Find someone who is ${pick(handedness)}`,
  () => 'Find someone who can speak multiple languages',
  () => `Find someone whose name starts with ${pick(NAME_LETTERS)}`,
  () => `Find someone who prefers ${pick(lecture_time)} lectures`,
  () => `Find someone who ${pick(pineapple)} pineapple on pizza`,
  () => `Find someone in their ${pick(study_year)} year of study`,
  () => `Find someone studying a Bachelor of ${pick(bachelors)}`,
  () => `Find someone who commutes by ${pick(commute)}`,
  () => `Find someone who prefers studying ${pick(study_pref)}`,
  () => `Find someone who has visited ${pick(visited)}`,
  () => `Find someone who participates in ${pick(fitness)}`,
  () => `Find someone who prefers ${pick(weather)} weather`,
  () => `Find someone who drinks ${pick(drinks)}`,
  () => `Find someone who spends free time ${pick(free_time)}`,
  () => `Find someone who has a ${pick(pets)}`,
  () => `Find someone who likes ${pick(food)}`,
  () => 'Find someone who is a morning person',
  () => 'Find someone who enjoys cooking',
  () => 'Find someone who can roller skate',
  () => 'Find someone who likes board games',
]

// Build one randomized board of BOARD_SIZE unique prompts.
export function generateItems(): string[] {
  const out = new Set<string>()
  let attempts = 0
  while (out.size < BOARD_SIZE && attempts < 1000) { attempts++; out.add(pick(generators)()) }
  const result = Array.from(out)
  while (result.length < BOARD_SIZE) result.push(`Find someone interesting #${result.length + 1}`)
  return result.slice(0, BOARD_SIZE)
}
