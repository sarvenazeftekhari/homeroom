# HomeRoom 🏠

A gamified assignment tracker that makes getting school work done fun and competitive.

---

## What you need to install first

Before anything else, you need two things on your computer: **Node.js** and **Git**. Here's how to get them depending on your system.

### Mac

1. Open **Terminal** (press Command + Space, type Terminal, hit Enter)
2. Check if you already have Node.js:
   ```bash
   node --version
   ```
   If you see a version number like `v20.0.0` you're good. If you see `command not found`, go to **https://nodejs.org**, download the **LTS** version, and install it.

3. Check if you already have Git:
   ```bash
   git --version
   ```
   If you see `command not found`, run this:
   ```bash
   xcode-select --install
   ```
   A popup will appear — click Install and wait for it to finish.

### Windows

1. Open **Command Prompt** (press the Windows key, type `cmd`, hit Enter)
2. Check if you already have Node.js:
   ```bash
   node --version
   ```
   If you see `command not found`, go to **https://nodejs.org**, download the **LTS** version, and install it.

3. Check if you already have Git:
   ```bash
   git --version
   ```
   If you see `command not found`, go to **https://git-scm.com/download/win**, download Git for Windows, and install it with all the default settings.

### Linux

```bash
sudo apt update
sudo apt install nodejs npm git
```

---

## How to get the project on your computer (only do this once)

1. Open Terminal (Mac/Linux) or Command Prompt (Windows)

2. Navigate to where you want to put the project, for example your Desktop:
   ```bash
   cd ~/Desktop
   ```

3. Clone the repo (this downloads all the code):
   ```bash
   git clone https://github.com/sarvenazeftekhari/homeroom.git
   ```

4. Go into the project folder:
   ```bash
   cd homeroom
   ```

5. Install all the dependencies (the building blocks the app needs):
   ```bash
   npm install
   ```
   This only needs to be done **once** after cloning.

---

## How to run the website locally

Every time you want to work on or view the app, do this:

1. Open Terminal and go to the project folder:
   ```bash
   cd ~/Desktop/homeroom
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and go to:
   ```
   http://localhost:5173
   ```

You should see the HomeRoom login page. The site will automatically update in the browser every time you save a file — no need to refresh manually.

To **stop the server**, press `Control + C` in the terminal.

---

## How to get the latest changes from your teammates

Before you start working each day, always pull the latest code so you're up to date:

```bash
git pull origin main
```

---

## How to save and share your own changes

After making changes to the code, save them to GitHub with these 3 commands:

```bash
git add .
git commit -m "describe what you changed here"
git push
```

When it asks for your GitHub password, use your **personal access token** (not your real password). See a teammate if you need help setting this up.

---

## Branching (working without breaking each other's code)

Each person should work on their own branch:

```bash
git checkout -b yourname/feature-name
```

For example:
```bash
git checkout -b neil/leaderboard
```

When you're done and want to merge into main:
```bash
git checkout main
git merge yourname/feature-name
git push
```

---

## Project structure

```
homeroom/
├── public/           ← Static files (icons, images)
├── src/
│   ├── components/   ← Reusable pieces (Sidebar, etc.)
│   ├── pages/        ← Full pages (Login, Dashboard, Classes, etc.)
│   ├── App.jsx       ← Routes / page navigation
│   ├── main.jsx      ← Entry point (don't touch)
│   └── index.css     ← Global styles
├── index.html
├── package.json
└── vite.config.js
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Database | Firebase (coming soon) |
| Hosting | Vercel (coming soon) |

---

## Team

- Sarvenaz Eftekhari
- Neil
