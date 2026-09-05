"""System-wide scoring constants and deterministic threshold definitions.
All thresholds defined in docs/scoring.md are strictly centralized here.
"""

# Skill Gap Classification Thresholds
GAP_STRONG_THRESHOLD = 0       # student_level >= required_level (gap == 0)
GAP_DEVELOPING_THRESHOLD = 20   # 0 < gap <= 20
GAP_MAJOR_THRESHOLD = 50       # 20 < gap <= 50
# Anything with gap > 50 is Critical Gap

TIER_STRONG = "Strong"
TIER_DEVELOPING = "Developing"
TIER_MAJOR = "Major Gap"
TIER_CRITICAL = "Critical Gap"

# Priority Score Thresholds: (Gap / 100) * Demand(1-10) * Importance(1-10)
PRIORITY_CRITICAL_THRESHOLD = 6.0
PRIORITY_HIGH_THRESHOLD = 4.0
PRIORITY_MEDIUM_THRESHOLD = 2.0

PRIORITY_CRITICAL = "Critical"
PRIORITY_HIGH = "High"
PRIORITY_MEDIUM = "Medium"
PRIORITY_LOW = "Low"

# Default Education Factors by Academic Background
DEFAULT_EDUCATION_FACTORS = {
    "Computer Science": 1.0,
    "Information Technology": 1.0,
    "Software Engineering": 1.0,
    "Data Science": 1.0,
    "Artificial Intelligence": 1.0,
    "Mathematics and Computing": 0.95,
    "Statistics": 0.95,
    "Electronics and Communication": 0.90,
    "Electrical Engineering": 0.85,
    "Mechanical Engineering": 0.80,
    "Civil Engineering": 0.80,
    "Other STEM": 0.80,
    "Non-STEM": 0.70,
}
