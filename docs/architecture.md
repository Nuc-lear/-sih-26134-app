# System Architecture: AI-Powered Career & Skill Intelligence Platform
## SIH26134 · Team NEXMIND

---

## 1. High-Level Modular Monolith Architecture

The system is designed as a strict, clean **modular monolith**. Microservices, distributed message brokers (Kafka/RabbitMQ), and vector databases are deliberately prohibited to ensure sub-millisecond execution, zero distributed failure states, and absolute scoring determinism.

```
+-----------------------------------------------------------------------+
|                           FRONTEND (React)                            |
|  Vite + TypeScript + Tailwind CSS + Lucide + Recharts + TanStack Query |
+-----------------------------------┬-----------------------------------+
                                    | HTTP / JSON
                                    v
+-----------------------------------------------------------------------+
|                            BACKEND (FastAPI)                          |
|                                                                       |
|  [ API Layer: /api/v1/endpoints/ ]                                    |
|         │                                                             |
|         ├──> [ Services Layer ]                                       |
|         │          │                                                  |
|         │          ├──> [ Deterministic Engines ] (Pure Python)       |
|         │          │         ├── role_matcher.py                      |
|         │          │         ├── gap_analyzer.py                      |
|         │          │         └── priority_engine.py                   |
|         │          │                                                  |
|         │          └──> [ LLM Service ] (Text JSON Parsing & Narration|
|         │                     * strictly zero scoring authority *     |
|         │                                                             |
|         └──> [ Database Layer ] (SQLAlchemy 2.0 / PostgreSQL)         |
+-----------------------------------------------------------------------+
```

---

## 2. Invariant Rules of the Intelligence Platform

1. **Deterministic Scoring**: 
   - No LLM call may ever compute, adjust, or rank a match score, gap, or priority.
   - All numbers originate from pure functions in `backend/app/engines/`.
2. **LLM Sandboxing**:
   - `llm_service.py` is invoked only for:
     1. Extraction: Turning raw job description text into validated JSON skills (`POST /api/v1/industry/extract`).
     2. Narration: Turning pre-computed numerical analysis into an executive summary and milestone roadmap (`POST /api/v1/reports/narrate`).
3. **Database Portability**:
   - Primary target: PostgreSQL via Supabase.
   - Local fallback: SQLite for zero-config local development and offline judge evaluation.
