"""Unit tests for Priority & Recommendation Engine.
Tests priority scoring formula, boundary thresholds (6.0, 4.0, 2.0), sorting, and dynamic why generation.
"""
import pytest
from app.models.schemas import RoleSkillSchema, SkillGapResult
from app.engines.priority_engine import calculate_priorities, generate_recommendations
from app.core.constants import (
    PRIORITY_CRITICAL,
    PRIORITY_HIGH,
    PRIORITY_MEDIUM,
    PRIORITY_LOW,
    TIER_MAJOR,
    TIER_CRITICAL,
    TIER_STRONG,
    TIER_DEVELOPING,
)


@pytest.fixture
def sample_role_map():
    return {
        "critical_skill": RoleSkillSchema(name="critical_skill", required_level=100, weight=10.0, role_importance=10.0),
        "high_skill": RoleSkillSchema(name="high_skill", required_level=100, weight=8.0, role_importance=8.0),
        "medium_skill": RoleSkillSchema(name="medium_skill", required_level=100, weight=5.0, role_importance=5.0),
        "low_skill": RoleSkillSchema(name="low_skill", required_level=100, weight=2.0, role_importance=2.0),
        "mastered_skill": RoleSkillSchema(name="mastered_skill", required_level=100, weight=5.0, role_importance=8.0),
    }


def test_priority_zero_gap(sample_role_map):
    """Zero gap must result in a priority score of 0.0 and Low priority tier."""
    gap_item = SkillGapResult(
        skill_name="mastered_skill",
        student_level=100,
        required_level=100,
        gap=0,
        tier=TIER_STRONG,
        formula_breakdown="",
    )
    priorities = calculate_priorities([gap_item], sample_role_map, industry_demand=10.0)
    assert priorities[0].priority_score == 0.0
    assert priorities[0].priority_tier == PRIORITY_LOW
    assert "Meets benchmark standard" in priorities[0].why_text


def test_priority_critical_boundary(sample_role_map):
    """Score >= 6.0 must classify as Critical."""
    # (60 / 100) * 2.0 * 5.0 = 6.00
    sample_role_map["critical_skill"].role_importance = 5.0
    gap_item = SkillGapResult(
        skill_name="critical_skill",
        student_level=40,
        required_level=100,
        gap=60,
        tier=TIER_CRITICAL,
        formula_breakdown="",
    )
    priorities = calculate_priorities([gap_item], sample_role_map, industry_demand=2.0)
    assert priorities[0].priority_score == 6.0
    assert priorities[0].priority_tier == PRIORITY_CRITICAL


def test_priority_high_boundary(sample_role_map):
    """Score in [4.0, 6.0) must classify as High."""
    # (40 / 100) * 2.0 * 5.0 = 4.00
    sample_role_map["critical_skill"].role_importance = 5.0
    gap_item = SkillGapResult(
        skill_name="critical_skill",
        student_level=60,
        required_level=100,
        gap=40,
        tier=TIER_MAJOR,
        formula_breakdown="",
    )
    priorities = calculate_priorities([gap_item], sample_role_map, industry_demand=2.0)
    assert priorities[0].priority_score == 4.0
    assert priorities[0].priority_tier == PRIORITY_HIGH

    # Score just under 6.0: (59 / 100) * 2.0 * 5.0 = 5.90 -> High
    gap_item_59 = SkillGapResult(
        skill_name="critical_skill",
        student_level=41,
        required_level=100,
        gap=59,
        tier=TIER_CRITICAL,
        formula_breakdown="",
    )
    priorities_59 = calculate_priorities([gap_item_59], sample_role_map, industry_demand=2.0)
    assert priorities_59[0].priority_score == 5.90
    assert priorities_59[0].priority_tier == PRIORITY_HIGH


def test_priority_medium_boundary(sample_role_map):
    """Score in [2.0, 4.0) must classify as Medium."""
    # (20 / 100) * 2.0 * 5.0 = 2.00
    sample_role_map["critical_skill"].role_importance = 5.0
    gap_item = SkillGapResult(
        skill_name="critical_skill",
        student_level=80,
        required_level=100,
        gap=20,
        tier=TIER_DEVELOPING,
        formula_breakdown="",
    )
    priorities = calculate_priorities([gap_item], sample_role_map, industry_demand=2.0)
    assert priorities[0].priority_score == 2.0
    assert priorities[0].priority_tier == PRIORITY_MEDIUM

    # Score 3.90: (39 / 100) * 2.0 * 5.0 = 3.90 -> Medium
    gap_item_39 = SkillGapResult(
        skill_name="critical_skill",
        student_level=61,
        required_level=100,
        gap=39,
        tier=TIER_MAJOR,
        formula_breakdown="",
    )
    priorities_39 = calculate_priorities([gap_item_39], sample_role_map, industry_demand=2.0)
    assert priorities_39[0].priority_score == 3.90
    assert priorities_39[0].priority_tier == PRIORITY_MEDIUM


def test_priority_low_boundary(sample_role_map):
    """Score < 2.0 must classify as Low."""
    # (15 / 100) * 2.0 * 5.0 = 1.50 -> Low
    sample_role_map["critical_skill"].role_importance = 5.0
    gap_item = SkillGapResult(
        skill_name="critical_skill",
        student_level=85,
        required_level=100,
        gap=15,
        tier=TIER_DEVELOPING,
        formula_breakdown="",
    )
    priorities = calculate_priorities([gap_item], sample_role_map, industry_demand=2.0)
    assert priorities[0].priority_score == 1.50
    assert priorities[0].priority_tier == PRIORITY_LOW


def test_priority_sorting_order(sample_role_map):
    """Results must sort in strict descending order by priority score."""
    gaps = [
        SkillGapResult(skill_name="low_skill", student_level=80, required_level=100, gap=20, tier=TIER_DEVELOPING, formula_breakdown=""),
        SkillGapResult(skill_name="critical_skill", student_level=40, required_level=100, gap=60, tier=TIER_CRITICAL, formula_breakdown=""),
        SkillGapResult(skill_name="medium_skill", student_level=50, required_level=100, gap=50, tier=TIER_MAJOR, formula_breakdown=""),
    ]
    priorities = calculate_priorities(gaps, sample_role_map, industry_demand=9.0)

    # critical_skill: (60/100) * 9.0 * 10.0 = 54.00
    # medium_skill: (50/100) * 9.0 * 5.0 = 22.50
    # low_skill: (20/100) * 9.0 * 2.0 = 3.60
    assert priorities[0].skill_name == "critical_skill"
    assert priorities[1].skill_name == "medium_skill"
    assert priorities[2].skill_name == "low_skill"


def test_dynamic_why_generation(sample_role_map):
    """Verifies that the 'why' explanation dynamically incorporates actual numbers."""
    gap_item = SkillGapResult(
        skill_name="critical_skill",
        student_level=30,
        required_level=100,
        gap=70,
        tier=TIER_CRITICAL,
        formula_breakdown="",
    )
    priorities = calculate_priorities([gap_item], sample_role_map, industry_demand=8.5)
    why = priorities[0].why_text

    # Expected score: (70/100) * 8.5 * 10.0 = 59.50
    assert "Critical priority (59.50)" in why
    assert "Gap of 70 pts" in why
    assert "Role Importance: 10.0/10" in why
    assert "Market Demand: 8.5/10" in why


def test_generate_recommendations(sample_role_map):
    """Verifies that recommendations ignore zero gaps and assign tiered interventions."""
    gaps = [
        SkillGapResult(skill_name="mastered_skill", student_level=100, required_level=100, gap=0, tier=TIER_STRONG, formula_breakdown=""),
        SkillGapResult(skill_name="critical_skill", student_level=30, required_level=100, gap=70, tier=TIER_CRITICAL, formula_breakdown=""),
        SkillGapResult(skill_name="high_skill", student_level=70, required_level=100, gap=30, tier=TIER_MAJOR, formula_breakdown=""),
    ]
    priorities = calculate_priorities(gaps, sample_role_map, industry_demand=9.0)
    recs = generate_recommendations(priorities)

    # Mastered skill (gap=0) should be excluded
    assert len(recs) == 2
    assert recs[0].skill_name == "critical_skill"
    assert recs[0].action_type == "Hands-on Project & Foundation"
    assert recs[0].estimated_hours == 140  # 70 * 2.0

    assert recs[1].skill_name == "high_skill"
    assert recs[1].action_type == "Deep Dive & System Architecture"
    assert recs[1].estimated_hours == 45   # 30 * 1.5
