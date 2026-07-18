// Printable Human Bingo cards. Prompt content comes from the shared
// single source in ./prompts — do not redefine prompts here.
import { generateItems } from './prompts'
import './print.css'

function cardEl(items: string[]): HTMLElement {
  const card = document.createElement('div')
  card.className = 'card'

  const title = document.createElement('div')
  title.className = 'card-title'
  title.textContent = 'Human Bingo'
  card.appendChild(title)

  const grid = document.createElement('div')
  grid.className = 'grid'
  for (const item of items) {
    const cell = document.createElement('div')
    cell.className = 'cell'
    const text = document.createElement('div')
    text.className = 'cell-text'
    text.textContent = item
    const line = document.createElement('div')
    line.className = 'cell-line'
    cell.appendChild(text)
    cell.appendChild(line)
    grid.appendChild(cell)
  }
  card.appendChild(grid)
  return card
}

function render(count: number): void {
  const preview = document.getElementById('preview')
  if (!preview) return
  preview.innerHTML = ''
  const n = Math.max(2, Math.min(60, Math.floor(count) || 0))
  for (let i = 0; i < n; i += 2) {
    const sheet = document.createElement('div')
    sheet.className = 'sheet'
    const pair = [i, i + 1].filter((idx) => idx < n)
    pair.forEach((_, j) => {
      const slot = document.createElement('div')
      slot.className = 'slot'
      slot.appendChild(cardEl(generateItems()))
      if (j === 0 && pair.length === 2) {
        const cut = document.createElement('div')
        cut.className = 'cut-line'
        cut.setAttribute('aria-hidden', 'true')
        slot.appendChild(cut)
      }
      sheet.appendChild(slot)
    })
    preview.appendChild(sheet)
  }
}

const qtyInput = document.getElementById('qty') as HTMLInputElement | null
const regenerateBtn = document.getElementById('regenerate')
const printBtn = document.getElementById('print')

regenerateBtn?.addEventListener('click', () => render(Number(qtyInput?.value)))
printBtn?.addEventListener('click', () => window.print())
qtyInput?.addEventListener('change', () => render(Number(qtyInput.value)))

render(Number(qtyInput?.value ?? 10))
