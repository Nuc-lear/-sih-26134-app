"""Deterministic Role Matching Engine.
Calculates weighted skill alignment and applies deterministic education factors.
AI is strictly forbidden from altering or determining scores.
"""
from typing import Dict, List, Optional
from app.models.schemas import RoleSkillSchema, RoleMatchResult
from app.core.constants import DEFAULT_EDUCATION_FACTORS


def calculate_role_match(
    student_skills: Dict[str, int],
    role_skills: List[RoleSkillSchema],
    education_factor: float = 1.0,
    role_id: str = "",
    role_slug: str = "",
    role_title: str = "",
) -> RoleMatchResult:
    """Calculates deterministic skill match score and final score.

    Formula:
      Skill Match Score = Σ(min(student_level, required_level) × weight) / Σ(required_level × weight) × 100
      Final Score = Skill Match Score × Education Factor
    """
    if not role_skills:
        return RoleMatchResult(
            role_id=role_id,
            role_slug=role_slug,
            role_title=role_title,
            skill_match_score=0.0,
            education_factor=education_factor,
            final_score=0.0,
            formula_breakdown="No skills specified for role; match score = 0.0%",
        )

    # Clean and normalize skill names for case-insensitive lookup
    student_skills_normalized = {k.strip().lower(): v for k, v in student_skills.items()}

    total_required_weighted = 0.0
    total_achieved_weighted = 0.0

    for r_skill in role_skills:
        req_level = float(r_skill.required_level)
        weight = float(r_skill.weight)
        
        # Denominator accumulator
        total_required_weighted += (req_level * weight)

        # Lookup student's current proficiency
        lookup_name = r_skill.name.strip().lower()
        student_level = float(student_skills_normalized.get(lookup_name, 0))

        # Capped contribution: student cannot get credit beyond required level
        capped_level = min(student_level, req_level)
        total_achieved_weighted += (capped_level * weight)

    if total_required_weighted == 0.0:
        skill_match_score = 0.0
    else:
        skill_match_score = (total_achieved_weighted / total_required_weighted) * 100.0

    skill_match_score = round(skill_match_score, 2)
    final_score = round(skill_match_score * education_factor, 2)

    # Ensure bounds [0.0, 100.0]
    skill_match_score = max(0.0, min(100.0, skill_match_score))
    final_score = max(0.0, min(100.0, final_score))

    formula_breakdown = (
        f"Skill Match = (Σ min(student, req)×wt) / (Σ req×wt) = "
        f"({total_achieved_weighted:.1f} / {total_required_weighted:.1f}) × 100 = {skill_match_score:.2f}%. "
        f"Final Score = {skill_match_score:.2f}% × {education_factor:.2f} (Education Factor) = {final_score:.2f}%"
    )

    return RoleMatchResult(
        role_id=role_id,
        role_slug=role_slug,
        role_title=role_title,
        skill_match_score=skill_match_score,
        education_factor=education_factor,
        final_score=final_score,
        formula_breakdown=formula_breakdown,
    )


def resolve_education_factor(
    degree_field: str,
    role_education_factors: Optional[Dict[str, float]] = None,
) -> float:
    """Determines the academic multiplier for a student's degree."""
    if role_education_factors and degree_field in role_education_factors:
        return role_education_factors[degree_field]

    return DEFAULT_EDUCATION_FACTORS.get(degree_field, 0.80)
