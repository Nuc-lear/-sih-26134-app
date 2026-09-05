"""Skill Gap Service Layer.
Coordinates gap analysis between student skills and target role requirements.
"""
from typing import Dict, List
from app.engines.gap_analyzer import analyze_skill_gaps
from app.models.schemas import SkillGapResult, SkillInput, RoleResponse
from app.core.dataset import get_role_by_slug


def compute_gaps_for_role(
    role_slug: str,
    student_skills: List[SkillInput],
) -> List[SkillGapResult]:
    """Retrieves target role and calculates skill gaps deterministically."""
    role = get_role_by_slug(role_slug)
    if not role:
        raise ValueError(f"Role '{role_slug}' not found in controlled dataset")

    skill_dict: Dict[str, int] = {s.name: s.proficiency_level for s in student_skills}
    return analyze_skill_gaps(student_skills=skill_dict, role_skills=role.skills)
