# LiftShift — Detailed Guide

Welcome to the detailed documentation for **LiftShift**, a comprehensive workout visualizer and analytics tool. This guide covers how to use the app, its architecture, and how you can contribute by adding new features.

---

## 📖 Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [App Features & Usage](#app-features--usage)
4. [Project Architecture](#project-architecture)
5. [Development Guide](#development-guide)
6. [How to Add New Features](#how-to-add-new-features)
7. [Deployment](#deployment)

---

## 1. Introduction

LiftShift is designed to transform workout data from popular logging apps (Hevy, Strong, Lyfta) into actionable insights. It emphasizes privacy by processing all data locally in the browser.

- **Frontend:** React + TypeScript + Vite + Vike.
- **Backend:** Node.js (used as a proxy for Hevy API sync).
- **Mobile:** Capacitor (Android wrapper).

---

## 2. Getting Started

### Prerequisites
- **Node.js:** v22 or higher.
- **npm:** v9 or higher.

### Local Setup
1. **Clone the Repo:**
   ```bash
   git clone https://github.com/habibhabibkhan954-gif/LiftShift.git
   cd LiftShift
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

---

## 3. App Features & Usage

### Onboarding
When you first open the app, you'll be prompted to:
1. **Select Platform:** Choose Hevy (Sync or CSV) or Strong (CSV).
2. **Configure Profile:** Set weight unit (kg/lbs) and body type (male/female).

### Main Navigation (Tabs)
- **📊 Dashboard:** High-level overview of volume trends, workout frequency, and muscle group distribution.
- **🏋️ Exercises:** Detailed stats for every exercise, including PR history, 1RM estimates, and progression status (Getting stronger, Plateauing, etc.).
- **📅 History:** Browse your individual workout sessions with set-by-set coaching feedback.
- **🔥 Muscle Analysis:** Interactive muscle heatmaps and volume zone scoring.
- **💪 Flex:** Advanced analytics and specialized views.

### Filters
Use the **Calendar icon** in the header to filter data by:
- Specific days
- Month or Year
- Custom date ranges
- Last 7 days, 30 days, or 365 days

---

## 4. Project Architecture

### Directory Structure
```
.
├── android/             # Capacitor Android project
├── backend/             # Node.js proxy server
├── frontend/            # React application source
│   ├── app/             # Application state, navigation, and UI logic
│   ├── components/      # React components (Dashboard, History, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Vike page definitions
│   ├── public/          # Static assets
│   ├── utils/           # Utility functions
│   │   ├── analysis/    # CORE LOGIC: Analytics and math
│   │   ├── csv/         # CSV parsers for different apps
│   │   └── storage/     # Local storage and cache management
│   └── App.tsx          # Main App entry and data merging
├── vite.config.ts       # Vite configuration
└── package.json         # Root dependencies and scripts
```

### Core Data Flow
1. **Data Ingestion:** `useAppAuth` handles file processing or API sync.
2. **Parsing:** `utils/csv/` converts raw data into a normalized `WorkoutSet[]` array.
3. **Merging:** `App.tsx` merges multiple datasets (e.g., Hevy + Strong) using a fingerprint matcher to deduplicate exercise names.
4. **Analysis:** `useAppDerivedData` computes stats (exercise stats, daily summaries) from the filtered dataset using logic in `utils/analysis/`.
5. **Rendering:** Components in `components/` consume the derived data to render charts and tables.

---

## 5. Development Guide

### Scripts
- `npm run dev`: Starts the frontend and backend in watch mode.
- `npm run build`: Builds the production web app into `dist/`.
- `npx cap sync`: Syncs built assets to the Android project.

### Mobile Development (Android)
1. Build the web app: `npm run build`
2. Sync with Capacitor: `npx cap sync`
3. Open in Android Studio: `npx cap open android`
4. Build signed APK: `./gradlew assembleRelease` (inside `android/` folder).

---

## 6. How to Add New Features

### Adding a New Analysis Metric
1. Go to `frontend/utils/analysis/core/`.
2. Create a new utility function to calculate your metric from a `WorkoutSet[]`.
3. Integrate it into `useAppDerivedData` in `frontend/hooks/app/` (or state management) to make it available globally.

### Adding a New Tab/View
1. **Define the Tab:** Add your new tab to the `Tab` enum in `frontend/app/navigation/tabs.ts`.
2. **Create the Component:** Create your view in `frontend/components/yourNewView/`.
3. **Register the Tab:** Add the logic to render your component in `frontend/components/app/AppTabContent.tsx`.
4. **Update Header:** (Optional) If you need a custom icon, update `frontend/components/app/AppHeader.tsx`.

### Adding Support for a New Workout App
1. **Parser:** Create a new parser in `frontend/utils/csv/` that maps the CSV columns to the `WorkoutSet` interface.
2. **Detection:** Update `csvSemanticDetection.ts` to automatically recognize the new format.
3. **UI:** Add the option to the onboarding flow in `frontend/components/app/AddSourcePickerModal.tsx`.

---

## 7. Deployment

LiftShift uses a split deployment:
- **Frontend:** Deployed as static files (e.g., Netlify, Vercel, GitHub Pages).
- **Backend:** Deployed as a Node.js service (e.g., Render, Railway) to handle API proxying.

Ensure `VITE_BACKEND_URL` is set in your frontend environment variables to point to your deployed backend.

---

Happy coding! If you have questions, feel free to open an issue or start a discussion in the repository.
