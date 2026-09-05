"""Controlled Industry Dataset Loader.
Loads the verified MVP dataset containing the 4 canonical roles and Aarav Sharma benchmark profile.
"""
import json
import os
from typing import Dict, List, Optional
from app.models.schemas import RoleResponse, RoleSkillSchema, StudentResponse, SkillInput

# Path to seed dataset
SEED_FILE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "data",
    "seed_roles.json",
)


def load_seed_data() -> dict:
    """Reads the seed JSON file from the filesystem."""
    with open(SEED_FILE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


# In-memory registry for dynamically predicted market roles
DYNAMIC_ROLES_REGISTRY: Dict[str, RoleResponse] = {}


def register_custom_role(role: RoleResponse) -> None:
    """Registers a dynamically predicted market role into the registry."""
    DYNAMIC_ROLES_REGISTRY[role.slug.lower()] = role
    DYNAMIC_ROLES_REGISTRY[role.id.lower()] = role


def get_controlled_roles() -> List[RoleResponse]:
    """Returns all roles including seed roles and any dynamically registered market roles."""
    data = load_seed_data()
    roles: List[RoleResponse] = []
    seen_slugs = set()
    for r in data.get("roles", []):
        skills = [RoleSkillSchema(**s) for s in r.get("skills", [])]
        role = RoleResponse(
            id=r["id"],
            slug=r["slug"],
            title=r["title"],
            description=r["description"],
            industry_demand=r["industry_demand"],
            skills=skills,
            education_factors=r.get("education_factors", {}),
        )
        roles.append(role)
        seen_slugs.add(role.slug.lower())

    for _, dyn_role in DYNAMIC_ROLES_REGISTRY.items():
        if dyn_role.slug.lower() not in seen_slugs:
            roles.append(dyn_role)
            seen_slugs.add(dyn_role.slug.lower())

    return roles


def get_role_by_slug(slug_or_id: str) -> Optional[RoleResponse]:
    """Finds a role by slug or id, checking dynamic registry first, then controlled dataset."""
    key = slug_or_id.lower()
    if key in DYNAMIC_ROLES_REGISTRY:
        return DYNAMIC_ROLES_REGISTRY[key]
    roles = get_controlled_roles()
    for role in roles:
        if role.slug.lower() == key or role.id.lower() == key:
            return role
    return None


def get_demo_aarav_profile() -> StudentResponse:
    """Returns Aarav Sharma's benchmark demo student profile."""
    data = load_seed_data()
    demo = data["demo_student"]
    skills = [
        SkillInput(name=name, proficiency_level=level)
        for name, level in demo["skills"].items()
    ]
    return StudentResponse(
        id=demo["id"],
        full_name=demo["full_name"],
        education_level=demo["education_level"],
        degree_field=demo["degree_field"],
        graduation_year=demo["graduation_year"],
        current_year_of_study=demo["current_year_of_study"],
        linkedin_url=demo.get("linkedin_url"),
        skills=skills,
        created_at="2026-09-05T00:00:00Z",
    )
