# Metronome

A responsive mechanical metronome built with vanilla JavaScript, CSS, the Web Audio API, and Vite.

## Features

- Tempo control from 40 to 208 BPM
- Measures containing 1 to 8 beats
- Strong click on the first beat of each measure
- Independent volume control with a muted state
- Animated pendulum, sliding weight, beat dial, and winding key
- Keyboard-operable native controls
- Responsive desktop and mobile layouts

## Tech stack

- HTML
- CSS
- JavaScript
- Web Audio API
- Vite
- Vitest
- Playwright

## Requirements

- Node.js

## Installation

```bash
git clone https://github.com/a-jadczak/metronome.git
cd metronome
npm install
```

Install the Chromium browser used by the test suites if it is not already available:

```bash
npx playwright install chromium
```

## Development

Start the Vite development server:

```bash
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173)

## Production build

Create a production build:

```bash
npm run build
```

The generated files are written to `dist/`. Preview that build locally with:

```bash
npm run preview
```

## Testing

| Command | Purpose |
| --- | --- |
| `npm test` | Run unit tests in watch mode |
| `npm run test:run` | Run all unit tests once in headless Chromium |
| `npm run test:ui` | Run unit tests in a visible browser |
| `npm run test:coverage` | Generate a unit-test coverage report |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:e2e:ui` | Open Playwright's interactive test UI |

Playwright starts the Vite server automatically at `http://127.0.0.1:5173`, so the development server does not need to be running before E2E tests.

## Project structure

```text
metronome/
├── public/
│   ├── favicon.png
│   └── sounds/             # Strong and light click samples
├── src/
│   ├── scripts/
│   │   ├── constant/       # Defaults, playback states, and tempo values
│   │   ├── dom/            # DOM element references
│   │   ├── metronome/      # Model, view, and controller
│   │   ├── services/       # Web Audio loading and playback
│   │   └── utils/          # Shared utilities
│   ├── styles/             # Base, layout, responsive, and component CSS
│   └── main.js             # Application entry point
├── tests/
│   ├── e2e/                # Playwright user-flow tests
│   └── unit/               # Vitest unit tests
├── index.html              # Vite HTML entry point
├── playwright.config.js
├── vite.config.js
└── vitest.config.js
```

## Architecture

The application follows a small model-view-controller structure:

- The **model** stores tempo, beats, volume, and playback state.
- The **view** renders control values, visual mechanisms, and animation state.
- The **controller** handles user input, playback transitions, and beat sequencing.
- The **audio service** loads the click samples, controls output volume, and creates audio sources.
