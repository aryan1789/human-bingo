# Human Bingo
A mobile web app for icebreaker bingo. Each player gets a randomised 5x5 board of prompts like "Find someone who commutes by bike" or "Find someone studying Data Science".
Walk around, talk to people, tap a square when you find a match, and enter their name. Fill the board to win.

Built with React + Vite, deployed on Vercel.

## How it works
Each device generates its own randomised board on first load and saves it to a cookie, so the same person sees the same card if they refresh. Names written into squares are also persisted per device.
When the board is complete, confetti drops and a win screen appears.

## Running locally
```
cd human-bingo
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Deploying
The project is connected to Vercel. Push to master and it deploys automatically. 

### You can also run:
```
npm run build
```
and host the dist/ folder anywhere that serves static files.

## Project structure
src/
  App.tsx   — all game logic and UI
  App.css   — styles

Everything lives in those two files. No backend, no database, no external dependencies beyond React.

## Customising the prompts
Open App.tsx and edit the generators array inside generateItems(). Each entry is a function that returns a prompt string. The game picks 25 unique ones at random per player.
