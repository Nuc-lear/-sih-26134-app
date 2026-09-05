"""Deterministic Priority & Recommendation Engine.
Calculates mathematical priority indices based on skill gap, macro demand, and role importance.
Dynamically constructs transparency explanations from raw calculated values.
AI is strictly forbidden from altering or ranking priorities.
"""
from typing import Dict, List
from app.models.schemas import (
    RoleSkillSchema,
    SkillGapResult,
    PriorityResult,
    RecommendationItem,
)
from app.core.constants import (
    PRIORITY_CRITICAL_THRESHOLD,
    PRIORITY_HIGH_THRESHOLD,
    PRIORITY_MEDIUM_THRESHOLD,
    PRIORITY_CRITICAL,
    PRIORITY_HIGH,
    PRIORITY_MEDIUM,
    PRIORITY_LOW,
)


def calculate_priorities(
    gaps: List[SkillGapResult],
    role_skills_map: Dict[str, RoleSkillSchema],
    industry_demand: float,
) -> List[PriorityResult]:
    """Calculates deterministic priority scores and dynamic explanations.

    Formula:
      Priority Score = (Gap / 100) × Industry Demand (1–10) × Role Importance (1–10)

    Tiers:
      Critical: score >= 6.0
      High:     score >= 4.0
      Medium:   score >= 2.0
      Low:      score < 2.0
    """
    priorities: List[PriorityResult] = []

    for gap_item in gaps:
        skill_name = gap_item.skill_name
        gap = gap_item.gap

        # Retrieve role-specific importance
        skill_meta = role_skills_map.get(skill_name.lower())
        importance = skill_meta.role_importance if skill_meta else 5.0

        if gap == 0:
            priority_score = 0.0
            priority_tier = PRIORITY_LOW
            why_text = (
                f"Meets benchmark standard (Current: {gap_item.student_level}, Required: {gap_item.required_level}). "
                f"No gap identified; maintain existing proficiency."
            )
            formula_breakdown = (
                f"({gap}/100) × Demand ({industry_demand:.1f}) × Importance ({importance:.1f}) = 0.00 [Zero Gap]"
            )
        else:
            raw_score = (gap / 100.0) * industry_demand * importance
            priority_score = round(raw_score, 2)

            if priority_score >= PRIORITY_CRITICAL_THRESHOLD:
                priority_tier = PRIORITY_CRITICAL
            elif priority_score >= PRIORITY_HIGH_THRESHOLD:
                priority_tier = PRIORITY_HIGH
            elif priority_score >= PRIORITY_MEDIUM_THRESHOLD:
                priority_tier = PRIORITY_MEDIUM
            else:
                priority_tier = PRIORITY_LOW

            formula_breakdown = (
                f"({gap}/100) × Demand ({industry_demand:.1f}) × Importance ({importance:.1f}) = {priority_score:.2f}"
            )

            why_text = (
                f"{priority_tier} priority ({priority_score:.2f}): Gap of {gap} pts in a role-critical skill "
                f"(Role Importance: {importance:.1f}/10, Market Demand: {industry_demand:.1f}/10). "
                f"Closing this gap yields {priority_score:.2f} leverage units towards overall qualification."
            )

        priorities.append(
            PriorityResult(
                skill_name=skill_name,
                gap=gap,
                industry_demand=industry_demand,
                role_importance=importance,
                priority_score=priority_score,
                priority_tier=priority_tier,
                formula_breakdown=formula_breakdown,
                why_text=why_text,
            )
        )

    # Sort strictly by priority score descending, then by gap descending
    priorities.sort(key=lambda x: (x.priority_score, x.gap), reverse=True)
    return priorities


def generate_recommendations(
    priorities: List[PriorityResult],
) -> List[RecommendationItem]:
    """Derives structured, milestone-oriented recommendations based on deterministic priorities."""
    recommendations: List[RecommendationItem] = []

    for item in priorities:
        if item.gap == 0:
            continue

        # Determine pedagogical intervention based on gap magnitude
        if item.gap > 50:
            action_type = "Hands-on Project & Foundation"
            estimated_hours = int(item.gap * 2.0)
            suggested_milestone = (
                f"Build an end-to-end applied portfolio project focused on {item.skill_name} "
                f"to close the substantial {item.gap}-point deficit."
            )
        elif item.gap > 20:
            action_type = "Deep Dive & System Architecture"
            estimated_hours = int(item.gap * 1.5)
            suggested_milestone = (
                f"Complete focused problem sets and production design patterns in {item.skill_name} "
                f"to bridge your {item.gap}-point gap."
            )
        else:
            action_type = "Refinement & Practice"
            estimated_hours = int(item.gap * 1.0)
            suggested_milestone = (
                f"Targeted polish on advanced edge cases in {item.skill_name} "
                f"to move from developing ({item.gap} pts left) to benchmark standard."
            )

        recommendations.append(
            RecommendationItem(
                skill_name=item.skill_name,
                priority_tier=item.priority_tier,
                priority_score=item.priority_score,
                gap=item.gap,
                action_type=action_type,
                suggested_milestone=suggested_milestone,
                estimated_hours=estimated_hours,
                why_text=item.why_text,
            )
        )

    return recommendations
