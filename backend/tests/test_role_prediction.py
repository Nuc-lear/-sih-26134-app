"""Tests for dynamic market role prediction."""
import pytest
from app.models.schemas import RolePredictionRequest, SkillInput
from app.services.llm_service import llm_service
from app.core.dataset import get_role_by_slug

@pytest.mark.anyio
async def test_predict_roles_returns_top_10():
    req = RolePredictionRequest(
        student_name="Aarav Sharma",
        degree_field="Computer Science",
        skills=[
            SkillInput(name="Python", proficiency_level=70),
            SkillInput(name="SQL", proficiency_level=60),
            SkillInput(name="Machine Learning", proficiency_level=30),
            SkillInput(name="Linear Algebra", proficiency_level=55),
        ],
    )
    res = await llm_service.predict_top_10_market_roles(req)
    assert len(res.predicted_roles) == 10

    first_role = res.predicted_roles[0]
    assert first_role.title
    assert first_role.slug
    assert first_role.industry_demand >= 1.0
    assert len(first_role.benchmark_skills) > 0
    assert first_role.fit_level in ["High Fit", "Strong Potential", "Emerging Fit"]
    assert len(first_role.why_match) > 0

    registered = get_role_by_slug(first_role.slug)
    assert registered is not None
    assert registered.title == first_role.title

@pytest.mark.anyio
async def test_predict_roles_frontend_focus():
    req = RolePredictionRequest(
        student_name="Priya Patel",
        degree_field="Information Technology",
        skills=[
            SkillInput(name="React", proficiency_level=80),
            SkillInput(name="JavaScript", proficiency_level=85),
            SkillInput(name="TypeScript", proficiency_level=75),
            SkillInput(name="HTML", proficiency_level=90),
            SkillInput(name="CSS", proficiency_level=85),
        ],
    )
    res = await llm_service.predict_top_10_market_roles(req)
    assert len(res.predicted_roles) == 10
    top_slugs = [r.slug for r in res.predicted_roles[:3]]
    assert "frontend-developer" in top_slugs or "full-stack-engineer" in top_slugs


@pytest.mark.anyio
async def test_predict_single_skill_react():
    """Candidate with only 1 frontend skill: React. Must rank frontend roles first with positive fit."""
    req = RolePredictionRequest(
        student_name="Candidate",
        degree_field="Computer Science",
        skills=[
            SkillInput(name="React", proficiency_level=70),
        ],
    )
    res = await llm_service.predict_top_10_market_roles(req)
    assert len(res.predicted_roles) == 10
    top_role = res.predicted_roles[0]
    assert top_role.slug in ["frontend-developer", "full-stack-engineer", "mobile-app-developer"]
    assert top_role.match_percentage > 20.0  # Must NOT be 0%
    assert "React" in top_role.why_match


@pytest.mark.anyio
async def test_predict_single_skill_docker():
    """Candidate with only 1 devops skill: Docker. Must rank Cloud & DevOps at top."""
    req = RolePredictionRequest(
        student_name="DevOps Candidate",
        degree_field="Information Technology",
        skills=[
            SkillInput(name="Docker", proficiency_level=75),
        ],
    )
    res = await llm_service.predict_top_10_market_roles(req)
    assert len(res.predicted_roles) == 10
    top_role = res.predicted_roles[0]
    assert top_role.slug == "cloud-devops-engineer"
    assert top_role.match_percentage > 20.0  # Must NOT be 0%
    assert "Docker" in top_role.why_match or "synergy" in top_role.why_match.lower()

