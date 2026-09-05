# AI-Powered Career & Skill Intelligence Platform (SIH26134)
### Team NEXMIND · Smart India Hackathon

A full-stack, enterprise-grade career and skill intelligence platform built with **FastAPI (Python)** and **React 18 + TypeScript + Vite + Tailwind CSS**.

---

## 🎯 The Core Architectural Invariant: Zero-AI Scoring
> **AI must never calculate or alter match scores, skill gaps, readiness percentages, or priorities.**
> All numerical metrics originate strictly from pure, deterministic Python functions in ackend/app/engines/.
> 
> **AI is strictly restricted to:**
> 1. Parsing unstructured job descriptions into structured JSON skills (POST /api/v1/industry/extract).
> 2. Narrating pre-computed mathematical figures in plain English without inventing numbers or statistics (POST /api/v1/reports/narrate).

---

## ⚡ 1-Click Quickstart (Windows)

### Option 1: Automatic 1-Click Launcher (Recommended)
Simply double-click:
`	ext
start.bat
`
This automatically sets execution policies, launches the FastAPI backend on http://127.0.0.1:8000, launches the React frontend on http://127.0.0.1:5173, and opens your default browser!

To stop both servers at any time, simply double-click:
`	ext
stop.bat
`

---

### Option 2: Manual Setup & Execution

#### 1. Backend Setup (FastAPI + Python)
`powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload-dir app
`
- API is live at: http://127.0.0.1:8000
- Interactive Swagger API Docs: http://127.0.0.1:8000/docs

#### 2. Frontend Setup (React + Vite + TypeScript)
`powershell
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
`
- Web Application is live at: http://127.0.0.1:5173

#### 3. Run Automated Unit Test Suite
`powershell
cd backend
.\venv\Scripts\pytest.exe -v
`
All 22 boundary mathematical engine unit tests will run and pass in under 0.5s!

---

## 📂 Repository Structure

`	ext
SIH GGV INTERNAL/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/       # REST API Endpoints (matching, gap, priorities, roles)
│   │   ├── core/                   # Configuration, constants & dataset loaders
│   │   ├── database/               # SQLAlchemy models & automatic seeders
│   │   ├── engines/                # THE CORE BRAIN (Pure Deterministic Python Functions)
│   │   │   ├── role_matcher.py     # Skill Match & Education Factor formulas
│   │   │   ├── gap_analyzer.py     # Gap delta calculation & 4-tier categorization
│   │   │   └── priority_engine.py  # Priority formula & dynamic rationale generator
│   │   ├── models/                 # Pydantic v2 schemas & SQLAlchemy domain models
│   │   └── services/               # Student persistence, matching & LLM narrator
│   ├── data/
│   │   └── seed_roles.json         # Controlled MVP industry roles & Aarav Sharma profile
│   ├── tests/                      # Pytest automated boundary test suite (22/22 passing)
│   └── requirements.txt            # Python dependencies (FastAPI, SQLAlchemy, Pydantic, etc.)
│
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable UI widgets
│   │   │   ├── CalculationModal.tsx # \"How is this calculated?\" Mathematical Inspector
│   │   │   ├── SkillGapChart.tsx   # Recharts dual-bar comparison chart
│   │   │   ├── RoleMatchCard.tsx   # Role score card with education factor multiplier
│   │   │   ├── ScoreRing.tsx       # Animated SVG circular readiness gauge
│   │   │   └── ThemeSwitcher.tsx   # 3-way theme toggle (Dark, Light, Eye Care)
│   │   ├── context/
│   │   │   ├── StudentContext.tsx  # Reactive intelligence state & live skill bumps
│   │   │   └── ThemeContext.tsx    # Multi-theme provider with localStorage persistence
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx   # Command center (Readiness, Roles, Chart, Live Bump)
│   │   │   ├── OnboardingPage.tsx  # Clean 3-step wizard with 1-click Aarav preset
│   │   │   ├── RolesPage.tsx       # 4 benchmark role requirements breakdown
│   │   │   ├── PrioritiesPage.tsx  # Full prioritized action matrix
│   │   │   ├── ReportPage.tsx      # Sandboxed AI Executive Report narrator
│   │   │   └── JobExtractorPage.tsx# Raw job description parser
│   │   ├── services/api.ts         # Strictly typed HTTP client
│   │   └── types/index.ts          # TypeScript types mirroring Pydantic schemas (0 'any')
│   ├── package.json
│   └── tailwind.config.js
│
├── docs/
│   ├── scoring.md                  # Complete mathematical formulas & boundary rules
│   ├── architecture.md             # System architecture & data flow diagrams
│   └── api.md                      # REST API endpoint specification
│
├── start.bat                       # 1-Click application launcher
├── stop.bat                        # 1-Click application stopper
├── run.ps1                         # Resilient PowerShell startup script
└── README.md                       # Master Documentation
`

---

## 🎨 Themes Supported
- 🌙 **Dark (Black)**: Default near-black slate enterprise palette (#090a0f).
- ☀️ **Light (White)**: Clean, high-contrast white theme (#f8fafc).
- 👁️ **Eye Care (Warm Sepia)**: Gentle parchment theme (#fbf7ee) designed to prevent blue light eye strain.

---

## ✏️ How to Edit & Customize in Antigravity or VS Code

### 1. Modifying Benchmark Roles or Skills
- Open ackend/data/seed_roles.json.
- Add or modify skills, benchmarks (0–100), weights (1–10), and demand scores.
- Restart the backend to auto-seed the updated dataset!

### 2. Modifying Scoring Formulas
- Open ackend/app/engines/role_matcher.py for match formulas.
- Open ackend/app/engines/gap_analyzer.py for gap threshold tiers.
- Open ackend/app/engines/priority_engine.py for priority index arithmetic.

### 3. Modifying Frontend Pages & Design
- Open rontend/src/pages/DashboardPage.tsx for the main command center.
- Open rontend/src/pages/OnboardingPage.tsx for onboarding questions.
- Open rontend/src/index.css for theme colors and custom styling.

---

## 🏆 Key Presentation Points for Judges
1. **Zero Black-Box Scoring**: Click **\"How is this calculated?\"** on any score to view the exact Python formula with real numbers plugged in.
2. **The Closing Beat (Live Skill Bump)**: On the Dashboard, open **\"Live Skill Bump (Judge Test)\"**, drag Machine Learning from 20% to 75%, and watch all 4 role scores, gap classifications, and priority indices recalculate live before your eyes!
3. **100% Offline Stability**: If internet or LLM keys are absent, deterministic fallback parsers ensure zero demo crashes during judging.
