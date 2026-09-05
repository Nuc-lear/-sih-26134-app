"""Unit tests for Skill Gap Analyzer Engine.
Tests all boundary values (gap=0, gap=20, gap=50, gap>50) and tier classifications.
"""
import pytest
from app.models.schemas import RoleSkillSchema
from app.engines.gap_analyzer import analyze_skill_gaps
from app.core.constants import TIER_STRONG, TIER_DEVELOPING, TIER_MAJOR, TIER_CRITICAL


def test_gap_zero_and_over_proficiency():
    """When student meets or exceeds required proficiency, gap must be 0 and tier must be Strong."""
    role = [
        RoleSkillSchema(name="ExactMatch", required_level=80, weight=1.0, role_importance=8.0),
        RoleSkillSchema(name="ExceededSkill", required_level=70, weight=1.0, role_importance=8.0),
    ]
    student = {"ExactMatch": 80, "ExceededSkill": 95}
    gaps = analyze_skill_gaps(student, role)

    gap_map = {g.skill_name: g for g in gaps}
    assert gap_map["ExactMatch"].gap == 0
    assert gap_map["ExactMatch"].tier == TIER_STRONG

    assert gap_map["ExceededSkill"].gap == 0
    assert gap_map["ExceededSkill"].tier == TIER_STRONG


def test_gap_developing_boundaries():
    """Gap in range (0, 20] must classify as Developing."""
    role = [
        RoleSkillSchema(name="GapMin", required_level=80, weight=1.0, role_importance=5.0),   # gap = 1
        RoleSkillSchema(name="GapBoundary20", required_level=80, weight=1.0, role_importance=5.0), # gap = 20
    ]
    student = {"GapMin": 79, "GapBoundary20": 60}
    gaps = analyze_skill_gaps(student, role)

    gap_map = {g.skill_name: g for g in gaps}
    assert gap_map["GapMin"].gap == 1
    assert gap_map["GapMin"].tier == TIER_DEVELOPING

    assert gap_map["GapBoundary20"].gap == 20
    assert gap_map["GapBoundary20"].tier == TIER_DEVELOPING


def test_gap_major_boundaries():
    """Gap in range (20, 50] must classify as Major Gap."""
    role = [
        RoleSkillSchema(name="GapBoundary21", required_level=80, weight=1.0, role_importance=5.0), # gap = 21
        RoleSkillSchema(name="GapBoundary50", required_level=80, weight=1.0, role_importance=5.0), # gap = 50
    ]
    student = {"GapBoundary21": 59, "GapBoundary50": 30}
    gaps = analyze_skill_gaps(student, role)

    gap_map = {g.skill_name: g for g in gaps}
    assert gap_map["GapBoundary21"].gap == 21
    assert gap_map["GapBoundary21"].tier == TIER_MAJOR

    assert gap_map["GapBoundary50"].gap == 50
    assert gap_map["GapBoundary50"].tier == TIER_MAJOR


def test_gap_critical_boundaries():
    """Gap > 50 must classify as Critical Gap."""
    role = [
        RoleSkillSchema(name="GapBoundary51", required_level=80, weight=1.0, role_importance=5.0), # gap = 51
        RoleSkillSchema(name="UnlearnedSkill", required_level=100, weight=1.0, role_importance=5.0), # gap = 100
    ]
    student = {"GapBoundary51": 29, "UnlearnedSkill": 0}
    gaps = analyze_skill_gaps(student, role)

    gap_map = {g.skill_name: g for g in gaps}
    assert gap_map["GapBoundary51"].gap == 51
    assert gap_map["GapBoundary51"].tier == TIER_CRITICAL

    assert gap_map["UnlearnedSkill"].gap == 100
    assert gap_map["UnlearnedSkill"].tier == TIER_CRITICAL


def test_gap_sorting_order():
    """Results must be ordered by gap descending."""
    role = [
        RoleSkillSchema(name="SmallGap", required_level=50, weight=1.0, role_importance=5.0), # gap = 10
        RoleSkillSchema(name="ZeroGap", required_level=50, weight=1.0, role_importance=5.0),  # gap = 0
        RoleSkillSchema(name="HugeGap", required_level=80, weight=1.0, role_importance=5.0),  # gap = 60
    ]
    student = {"SmallGap": 40, "ZeroGap": 60, "HugeGap": 20}
    gaps = analyze_skill_gaps(student, role)

    assert gaps[0].skill_name == "HugeGap"
    assert gaps[1].skill_name == "SmallGap"
    assert gaps[2].skill_name == "ZeroGap"


def test_formula_explanation_populated():
    """Formula explanation string must contain actual values."""
    role = [RoleSkillSchema(name="Python", required_level=80, weight=1.0, role_importance=5.0)]
    student = {"Python": 50}
    gaps = analyze_skill_gaps(student, role)

    assert "max(0, Required (80) - Current (50)) = 30 pts [Major Gap]" in gaps[0].formula_breakdown
