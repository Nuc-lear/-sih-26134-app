"""Deterministic Skill Gap Analyzer Engine.
Calculates individual skill deficits and classifies them into standardized tiers.
AI is strictly forbidden from altering or determining gap metrics.
"""
from typing import Dict, List
from app.models.schemas import RoleSkillSchema, SkillGapResult
from app.core.constants import (
    GAP_DEVELOPING_THRESHOLD,
    GAP_MAJOR_THRESHOLD,
    TIER_STRONG,
    TIER_DEVELOPING,
    TIER_MAJOR,
    TIER_CRITICAL,
)


def analyze_skill_gaps(
    student_skills: Dict[str, int],
    role_skills: List[RoleSkillSchema],
) -> List[SkillGapResult]:
    """Calculates skill gaps against benchmark requirements.

    Formula:
      Gap = max(0, Required_Level - Student_Level)

    Tiers:
      Strong:       student_level >= required_level (gap == 0)
      Developing:   0 < gap <= 20
      Major Gap:    20 < gap <= 50
      Critical Gap: gap > 50
    """
    student_skills_normalized = {k.strip().lower(): v for k, v in student_skills.items()}
    results: List[SkillGapResult] = []

    for r_skill in role_skills:
        req_level = r_skill.required_level
        lookup_name = r_skill.name.strip().lower()
        student_level = student_skills_normalized.get(lookup_name, 0)

        # Gap calculation
        gap = max(0, req_level - student_level)

        # Tier classification
        if student_level >= req_level or gap == 0:
            tier = TIER_STRONG
        elif gap <= GAP_DEVELOPING_THRESHOLD:
            tier = TIER_DEVELOPING
        elif gap <= GAP_MAJOR_THRESHOLD:
            tier = TIER_MAJOR
        else:
            tier = TIER_CRITICAL

        formula_breakdown = (
            f"Gap = max(0, Required ({req_level}) - Current ({student_level})) = {gap} pts [{tier}]"
        )

        results.append(
            SkillGapResult(
                skill_name=r_skill.name,
                student_level=student_level,
                required_level=req_level,
                gap=gap,
                tier=tier,
                category=r_skill.category,
                formula_breakdown=formula_breakdown,
            )
        )

    # Sort so the biggest gaps appear first, but preserving logical order
    results.sort(key=lambda x: x.gap, reverse=True)
    return results
