"""Matching Service Layer.
Orchestrates role matching against the deterministic engine.
"""
from typing import Dict, List
from app.engines.role_matcher import calculate_role_match, resolve_education_factor
from app.models.schemas import RoleMatchResult, SkillInput, RoleResponse
from app.core.dataset import get_controlled_roles


def match_student_against_all_roles(
    student_skills: List[SkillInput],
    degree_field: str = "Computer Science",
    roles: List[RoleResponse] = None,
) -> List[RoleMatchResult]:
    """Matches student skills across all roles in the controlled dataset."""
    if roles is None:
        roles = get_controlled_roles()

    skill_dict: Dict[str, int] = {s.name: s.proficiency_level for s in student_skills}
    results: List[RoleMatchResult] = []

    for role in roles:
        edu_factor = resolve_education_factor(degree_field, role.education_factors)
        match_result = calculate_role_match(
            student_skills=skill_dict,
            role_skills=role.skills,
            education_factor=edu_factor,
            role_id=role.id,
            role_slug=role.slug,
            role_title=role.title,
        )
        results.append(match_result)

    # Sort descending by final score
    results.sort(key=lambda x: x.final_score, reverse=True)
    return results
