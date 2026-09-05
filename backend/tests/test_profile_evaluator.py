import pytest
from app.models.schemas import (
    ProfileScreenshotEvaluateRequest,
    CareerJourneyGuideRequest,
    SkillInput,
)
from app.services.llm_service import llm_service


@pytest.mark.anyio
async def test_evaluate_leetcode_profile():
    req = ProfileScreenshotEvaluateRequest(
        profile_type="leetcode",
        profile_text="Solved 350 problems in Python and C++, Knight rating 1850",
    )
    res = await llm_service.evaluate_profile_screenshot(req)
    assert "LeetCode" in res.detected_platform
    assert len(res.evaluated_skills) > 0
    skill_names = [s.name.lower() for s in res.evaluated_skills]
    assert any("python" in s for s in skill_names)
    for skill in res.evaluated_skills:
        assert 0 <= skill.proficiency_level <= 100
        assert 0.0 <= skill.confidence <= 1.0
        assert len(skill.rationale) > 5


@pytest.mark.anyio
async def test_evaluate_github_profile():
    req = ProfileScreenshotEvaluateRequest(
        profile_type="github",
        profile_text="React, TypeScript, Docker repos with 100+ commits",
    )
    res = await llm_service.evaluate_profile_screenshot(req)
    assert "GitHub" in res.detected_platform
    assert len(res.evaluated_skills) >= 4
    skill_names = [s.name.lower() for s in res.evaluated_skills]
    assert any("react" in s or "javascript" in s for s in skill_names)


@pytest.mark.anyio
async def test_evaluate_linkedin_profile():
    req = ProfileScreenshotEvaluateRequest(
        profile_type="linkedin",
        profile_text="Computer Science student with Java, Python, and SQL experience",
    )
    res = await llm_service.evaluate_profile_screenshot(req)
    assert "LinkedIn" in res.detected_platform
    assert len(res.evaluated_skills) >= 3


@pytest.mark.anyio
async def test_career_journey_guidance():
    req = CareerJourneyGuideRequest(
        student_name="Aarav Sharma",
        degree_field="Computer Science",
        target_role_title="AI / Machine Learning Engineer",
        target_role_slug="ai-ml-engineer",
        current_skills=[
            SkillInput(name="Python", proficiency_level=75),
            SkillInput(name="C++", proficiency_level=60),
            SkillInput(name="SQL", proficiency_level=50),
        ],
    )
    res = await llm_service.generate_career_journey(req)
    assert res.target_role_title == "AI / Machine Learning Engineer"
    assert len(res.phases) >= 3
    assert len(res.interview_readiness_checklist) >= 3
    assert len(res.capstone_recommendation) > 10
