"""Recommendation & Full Audit Service Layer.
Coordinates priority ranking, action items, and composite audit snapshots.
"""
from typing import Dict, List
from app.models.schemas import (
    SkillInput,
    RoleResponse,
    PriorityResult,
    RecommendationItem,
    FullAuditReport,
)
from app.engines.priority_engine import calculate_priorities, generate_recommendations
from app.engines.gap_analyzer import analyze_skill_gaps
from app.engines.role_matcher import calculate_role_match, resolve_education_factor
from app.services.matching_service import match_student_against_all_roles
from app.core.dataset import get_role_by_slug, get_controlled_roles


def compute_priorities_for_role(
    role_slug: str,
    student_skills: List[SkillInput],
) -> List[PriorityResult]:
    """Calculates prioritized skill gaps for a specific role."""
    role = get_role_by_slug(role_slug)
    if not role:
        raise ValueError(f"Role '{role_slug}' not found in controlled dataset")

    skill_dict: Dict[str, int] = {s.name: s.proficiency_level for s in student_skills}
    gaps = analyze_skill_gaps(student_skills=skill_dict, role_skills=role.skills)
    role_map = {s.name.lower(): s for s in role.skills}

    return calculate_priorities(
        gaps=gaps,
        role_skills_map=role_map,
        industry_demand=role.industry_demand,
    )


def generate_full_audit(
    student_id: str,
    student_name: str,
    degree_field: str,
    target_role_slug: str,
    student_skills: List[SkillInput],
) -> FullAuditReport:
    """Generates complete intelligence payload for a student targeting a role."""
    target_role = get_role_by_slug(target_role_slug)
    if not target_role:
        all_roles = get_controlled_roles()
        target_role = all_roles[0]

    all_roles = get_controlled_roles()
    role_matches = match_student_against_all_roles(
        student_skills=student_skills,
        degree_field=degree_field,
        roles=all_roles,
    )

    skill_dict: Dict[str, int] = {s.name: s.proficiency_level for s in student_skills}
    gaps = analyze_skill_gaps(student_skills=skill_dict, role_skills=target_role.skills)
    role_map = {s.name.lower(): s for s in target_role.skills}

    priorities = calculate_priorities(
        gaps=gaps,
        role_skills_map=role_map,
        industry_demand=target_role.industry_demand,
    )

    recommendations = generate_recommendations(priorities)

    # Calculate overall readiness score against target role
    target_match = next((m for m in role_matches if m.role_slug == target_role.slug), None)
    readiness_score = target_match.final_score if target_match else 0.0

    return FullAuditReport(
        student_id=student_id,
        student_name=student_name,
        degree_field=degree_field,
        target_role=target_role,
        role_matches=role_matches,
        skill_gaps=gaps,
        priorities=priorities,
        recommendations=recommendations,
        readiness_score=readiness_score,
    )
