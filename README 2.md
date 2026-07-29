# Weather Almanac

A field-almanac styled weather forecaster. Search any city and get current
conditions, a live sun-position arc, a wind compass, an hourly ticker, and a
7-day forecast log — all powered by the free [Open-Meteo](https://open-meteo.com/)
API (no API key required).

![stack](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![stack](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![stack](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss&logoColor=white)

## Features

- 🔎 City search with live geocoding autocomplete
- 🌡️ Current temperature, "feels like", humidity, wind speed & direction
- 🌅 Sun-position arc showing sunrise/sunset progress in real time
- 🧭 Animated wind compass
- ⏱️ Next-8-hours ticker with precipitation chance
- 📖 7-day forecast log
- 🌗 Sky gradient responds to real weather conditions and day/night
- °C / °F toggle
- No API key, no backend — everything runs client-side

## Tech Stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/) for the dev server / build
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [lucide-react](https://lucide.dev/) for icons
- [Open-Meteo](https://open-meteo.com/) for geocoding + forecast data

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- npm (comes with Node.js)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/weather-almanac.git
cd weather-almanac
npm install
```

### Run locally

```bash
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

The production-ready files will be in the `dist/` folder, which you can
deploy to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.).

## Deploying to GitHub Pages

1. Install the gh-pages helper: `npm install --save-dev gh-pages`
2. Add to `package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/weather-almanac",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run `npm run deploy`.

## Project Structure

```
weather-almanac/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx      # React entry point
    ├── App.jsx        # Weather Almanac component (main app logic + UI)
    └── index.css      # Tailwind directives
```

## Data Source

Weather and geocoding data are provided by [Open-Meteo](https://open-meteo.com/),
a free, open-source weather API that requires no API key for non-commercial use.
See their [terms](https://open-meteo.com/en/terms) for details.

## License

MIT — feel free to use, modify, and share.
