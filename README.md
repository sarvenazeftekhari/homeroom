# HomeRoom 🏠

### 🌐 Live App: [https://homeroom-gilt.vercel.app/](https://homeroom-gilt.vercel.app/)

---

## What is HomeRoom?

HomeRoom is a gamified assignment tracker that makes getting school work done fun and competitive. Students can create an account, join or create classes, track their assignments, and earn XP points based on how well and how quickly they complete their work.

The better your grade and the earlier you submit, the more XP you earn. Each class has its own leaderboard so you can see how you rank against your classmates. You can also spend your XP in the Point Shop on boosters and power-ups to gain an edge — or sabotage your rivals 😈

---

## Features

- **Account creation & login** — real authentication powered by Firebase
- **Classes** — join or create classes, each with their own leaderboard and assignments
- **Assignments** — add assignments, mark them as submitted, enter your grade, and watch your XP calculate automatically
- **XP System** — points are calculated based on your grade, how early you submitted, and the difficulty of the assignment
- **Leaderboard** — per-class rankings showing XP, average grade, and level
- **Point Shop** — spend your XP on boosters like XP Multiplier, Deadline Shield, Sabotage, and more
- **Friends** — see what your friends are up to and their recent activity
- **Profile** — set your name and have it show up across the app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Authentication | Firebase Auth |
| Database | Firebase Firestore |
| Hosting | Vercel |

---

## Getting Started

### What you need to install first

**Mac:**
1. Open Terminal (Command + Space, type Terminal)
2. Check for Node.js: `node --version` — if not found, download from [https://nodejs.org](https://nodejs.org) (LTS version)
3. Check for Git: `git --version` — if not found, run `xcode-select --install`

**Windows:**
1. Open Command Prompt (Windows key, type `cmd`)
2. Check for Node.js: `node --version` — if not found, download from [https://nodejs.org](https://nodejs.org) (LTS version)
3. Check for Git: `git --version` — if not found, download from [https://git-scm.com/download/win](https://git-scm.com/download/win)

**Linux:**
```bash
sudo apt update
sudo apt install nodejs npm git
```

---

### Setting up the project (do this once)

**1. Clone the repo:**
```bash
cd ~/Desktop
git clone https://github.com/sarvenazeftekhari/homeroom.git
cd homeroom
```

**2. Install dependencies:**
```bash
npm install
```

**3. Set up your Firebase environment variables:**

Create a file called `.env` in the root of the project and ask a teammate for the values. It should look like this:
```
VITE_FIREBASE_API_KEY=your_value
VITE_FIREBASE_AUTH_DOMAIN=your_value
VITE_FIREBASE_PROJECT_ID=your_value
VITE_FIREBASE_STORAGE_BUCKET=your_value
VITE_FIREBASE_MESSAGING_SENDER_ID=your_value
VITE_FIREBASE_APP_ID=your_value
```

> ⚠️ Never commit your `.env` file to GitHub. It is already listed in `.gitignore`.

---

### Running the app locally

```bash
npm run dev
```

Then open your browser and go to: **http://localhost:5173**

The site will automatically update every time you save a file.

To stop the server: press `Control + C` in the terminal.

---

## Working with Git as a team

**Get the latest changes before you start working:**
```bash
git pull origin main
```

**Save and share your changes:**
```bash
git add .
git commit -m "describe what you changed"
git push
```

**If your push gets rejected (someone else pushed first):**
```bash
git pull origin main --no-rebase
git push
```

---

## Project Structure

```
homeroom/
├── public/               ← Static files (bird mascot, icons)
├── src/
│   ├── components/
│   │   └── Sidebar.jsx   ← Shared sidebar navigation
│   ├── pages/
│   │   ├── Login.jsx     ← Sign in / Sign up
│   │   ├── Dashboard.jsx ← Home screen
│   │   ├── Classes.jsx   ← All classes overview
│   │   ├── ClassDetail.jsx ← Per-class assignments, leaderboard, shop
│   │   ├── Friends.jsx   ← Friends list
│   │   └── Profile.jsx   ← User profile & name
│   ├── firebase.js       ← Firebase config
│   ├── App.jsx           ← Routes
│   ├── main.jsx          ← Entry point
│   └── index.css         ← Global styles
├── .env                  ← Secret keys (never commit this)
├── .gitignore
├── package.json
└── vite.config.js
```

---

## How XP is Calculated

XP is awarded when you enter your grade for a submitted assignment. The formula takes into account:

- **Grade** — higher grade = more base XP
- **Difficulty** — Easy (1x), Medium (1.5x), Hard (2x) multiplier
- **Timeliness** — submitting early earns bonus XP (up to +100 XP)

---

## Hackathon

Built at a hackathon. Powered by caffeine and competitive energy ☕
