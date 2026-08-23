<div align="center">
  <img width="1200" height="475" alt="FADE High Fashion Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# FADE — Friends Appreciating Dress Elegantly

> **Elevated aesthetics, calibrated for you.**  
> An elite, moody, and editorial high-fashion personal styling platform.

---

FADE is a private couturier showroom and styling sanctuary designed for the avant-garde. Bypassing mass-market fashion algorithms and the noise of social media trends, FADE offers a quiet, highly calibrated space to analyze garment drapes, silhouette proportions, and subcultural aesthetics. 

Through the integration of state-of-the-art multimodal AI and intimate, invite-only styling collectives (called **Ateliers**), FADE allows users to curate a digital wardrobe twin, receive scientific fashion diagnostics, and collaborate in real-time with their personal styling circle.

---

## 🖤 The Scientific Styling Framework

FADE integrates six fundamental scientific design and morphological styling frameworks directly into its core AI model (`gemini-1.5-pro` via the [Google GenAI SDK](file:///home/franz/Documents/FADE/server/services/gemini.ts)):

1. **Morphological Geometry:** Evaluates visual proportion balance according to the user's specific body shape (e.g., *Hourglass, Pear, Apple, Rectangle, Inverted Triangle, Spoon, Diamond, Trapezoid, Oval*). It checks if structural volume is correctly distributed.
2. **Chromatographic Profiling:** Analyzes color harmony based on the user's seasonal color profile (e.g., *Soft Autumn, Deep Winter, Light Spring*) and skin undertone (*Warm, Cool, Neutral*). It specifically audits the "Portrait Zone" (collar, neckline, face-framing areas) and flags colors to avoid.
3. **Occasion Alignment:** Calibrates outfit formality, silhouette rigidity, and fabric structures against specific occasion requirements (e.g., *Corporate Pitch, Casual Brunch, High-Fashion Gala, Film Set, Date Night*).
4. **Fabric & Textile Performance:** Checks drape appropriateness, GSM fabric weight, and flags synthetics in formal contexts.
5. **Somatotype Alignment:** Checks if a garment's architecture suits the user's physical build (*Ectomorph, Mesomorph, Endomorph*).
6. **Aesthetic Subculture Calibration:** Checks alignment with strict genre rules of defined subcultures: *Techwear, Dark Academia, Y2K, Classic Menswear, Minimalist, Avant-Garde, and Streetwear*.

---

## 💎 Core Capabilities & Features

* **Multimodal AI Stylist Studio:** Upload high-resolution look imagery in the [StudioScreen](file:///home/franz/Documents/FADE/src/components/StudioScreen.tsx) and get instant, detailed metrics on silhouette fit, color harmony, occasion match, and fabric appropriateness, coupled with highly actionable improvements.
* **Peer-Review Circles ("Ateliers"):** Form styling squads in the [FriendsScreen](file:///home/franz/Documents/FADE/src/components/FriendsScreen.tsx), generate exclusive invite tokens, and review your friends' outfit cards using dual feedback tags:
  * 🌟 **Appreciate:** Double-down on things done exceptionally well.
  * 📈 **Elevate:** Provide constructive, high-precision recommendations.
* **Real-time WebSockets:** Receive instant notifications when a circle member submits an outfit or post reviews. Authenticated securely via JWT.
* **Smart Wardrobe Analytics:** Track purchase prices, category weights, and usage telemetry. The wardrobe calculates a live **Cost-per-Wear (CPW)** dynamically halving every time a garment is logged, as visualized in the [AnalyticsScreen](file:///home/franz/Documents/FADE/src/components/AnalyticsScreen.tsx).
* **Moody, Editorial Styling System:** Built on a premium, dark-mode design system using rich, curated HSL colors: `background-ink` (`#002a32`), `surface-raised` (`#001a20`), `brand-red` (`#ed254e`), and `primary-glow` (`#ffb3b6`), paired with elegant editorial typography.

---

## 🛠️ Architecture & Tech Stack

FADE is architected as a decoupled client-server monorepo:

### Frontend
* **Core:** React 19, TypeScript, Vite 6
* **Styles:** Tailwind CSS v4 (using CSS variables, `@theme` token definitions, and premium glassmorphism filters)
* **Motion:** [Motion](https://motion.dev/) (Framer Motion) driving custom page animations, laser scan overlays, and layout slides
* **Entry Point:** [App.tsx](file:///home/franz/Documents/FADE/src/App.tsx) & [main.tsx](file:///home/franz/Documents/FADE/src/main.tsx)

### Backend
* **Runtime:** Node.js + Express
* **Database:** PostgreSQL (utilizing standard pooling via `pg`)
* **Real-Time Layer:** WebSockets via the `ws` library
* **Authentication:** JWT-based access & refresh token protocols
* **Services:** Google GenAI SDK (`@google/genai` v2.4.0) calling `gemini-1.5-pro` in JSON output mode
* **Entry Point:** [index.ts](file:///home/franz/Documents/FADE/server/index.ts)

---

## 🚀 Getting Started

### 📋 Prerequisites
* **Node.js** (v18+)
* **PostgreSQL** running locally (or via Docker)

### 1. Database Setup
Ensure PostgreSQL is running. By default, FADE looks for a database matching the settings in your env file:
* **Host:** `localhost`
* **Port:** `5435` (configurable)
* **Database:** `fade`

The database schema will automatically initialize on server boot using [schema.sql](file:///home/franz/Documents/FADE/server/db/schema.sql).

### 2. Environment Variables Configuration
Create a `.env` file in the root directory:
```bash
# Server configuration
PORT=3001
JWT_SECRET=YOUR_SECURE_JWT_SECRET
JWT_REFRESH_SECRET=YOUR_SECURE_JWT_REFRESH_SECRET

# Database configuration
DB_HOST=localhost
DB_PORT=5435
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=fade

# Gemini API Key (Acquire from Google AI Studio)
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Running the Application

* **Start the Backend Server (Express + WebSockets):**
  ```bash
  npm run server
  ```
* **Start the Frontend Development Server (Vite):**
  ```bash
  npm run dev
  ```
  Open your browser to `http://localhost:3000`. Use the autofill invitation passcode `FD-992-XKL` to bypass the showroom gate and start onboarding your aesthetic profile.

---

## 🧪 Integration & Boundary Testing

FADE features a comprehensive integration suite in [test-client.ts](file:///home/franz/Documents/FADE/server/test-client.ts) that spins up an isolated testing server, seeds initial datasets, and validates the entire application flow:

* Token validation & invite-gated registration.
* Style profile telemetry and database writes.
* Multimodal `gemini-1.5-pro` API parsing and scoring.
* WS connections and circle broadcast propagation.
* Wardrobe inventory additions and Cost-per-Wear math.
* Strict tenant-isolation security boundaries (e.g. validating that unauthorized circles/items return `403 Forbidden`).

To execute the suite:
```bash
npm run test:backend
```

---

## 📂 File Architecture

* `/src` — React 19 Frontend
  * [App.tsx](file:///home/franz/Documents/FADE/src/App.tsx) — Navigation, screen transitions, global state
  * `/components` — Showroom, setup panels, studio, analytics cards
  * [index.css](file:///home/franz/Documents/FADE/src/index.css) — Custom fonts (EB Garamond, Hanken Grotesk) and theme design system
* `/server` — Express + Node.js Backend
  * [db.ts](file:///home/franz/Documents/FADE/server/db.ts) — PostgreSQL setup and initialization
  * [index.ts](file:///home/franz/Documents/FADE/server/index.ts) — API routers & server bootstrapping
  * `/services` — Multimodal [gemini.ts](file:///home/franz/Documents/FADE/server/services/gemini.ts) & WebSockets [realtime.ts](file:///home/franz/Documents/FADE/server/services/realtime.ts)
  * `/db` — [schema.sql](file:///home/franz/Documents/FADE/server/db/schema.sql) defining the PostgreSQL structures
  * [test-client.ts](file:///home/franz/Documents/FADE/server/test-client.ts) — Full integration test pipeline
