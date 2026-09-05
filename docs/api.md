# API Specification: REST Endpoints

All endpoints are prefixed with `/api/v1` and communicate via JSON with strict Pydantic v2 schemas.

---

## 1. System & Roles

### `GET /api/v1/health`
- **Description**: Returns engine health and version info.
- **Response**: `200 OK`
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "engines": {
    "role_matcher": "online",
    "gap_analyzer": "online",
    "priority_engine": "online"
  }
}
```

### `GET /api/v1/roles`
- **Description**: Returns the 4 controlled industry roles with base demand and skill summaries.

### `GET /api/v1/roles/{slug}`
- **Description**: Returns complete benchmark requirements for a specific role.

---

## 2. Student & Demo Management

### `GET /api/v1/demo/aarav`
- **Description**: Returns the pre-seeded benchmark student profile (Aarav Sharma, B.Tech CS 2nd year).

### `POST /api/v1/students`
- **Description**: Upserts a student profile and skill matrix.

---

## 3. Deterministic Analysis Engine

### `POST /api/v1/analysis/match`
- **Description**: Computes deterministic match percentages across all roles.

### `POST /api/v1/analysis/gap`
- **Description**: Computes skill gaps against a target role and categorizes them into tiers.

### `POST /api/v1/analysis/prioritize`
- **Description**: Mathematically calculates priority scores and dynamically generates "why" rationales.

### `POST /api/v1/analysis/full-audit`
- **Description**: Composite endpoint returning complete match, gap, and priority analysis including mathematical formulas for the transparency affordances.

---

## 4. LLM Service (Pure Text-Only)

### `POST /api/v1/industry/extract`
- **Description**: Parses raw job description text into validated JSON skills list.

### `POST /api/v1/reports/narrate`
- **Description**: Produces an executive summary narrating strictly existing pre-computed numbers.
