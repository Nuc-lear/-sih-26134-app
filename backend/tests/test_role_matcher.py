"""Unit tests for Role Matcher Engine.
Tests all mathematical boundary conditions, capping mechanics, and education multipliers.
"""
import pytest
from app.models.schemas import RoleSkillSchema
from app.engines.role_matcher import calculate_role_match, resolve_education_factor


@pytest.fixture
def sample_role_skills():
    return [
        RoleSkillSchema(name="Python", required_level=80, weight=10.0, role_importance=9.0, category="Programming"),
        RoleSkillSchema(name="SQL", required_level=70, weight=8.0, role_importance=8.0, category="Databases"),
        RoleSkillSchema(name="Git", required_level=50, weight=4.0, role_importance=7.0, category="Tools"),
    ]


def test_perfect_match(sample_role_skills):
    """Student meeting or exceeding every benchmark must score exactly 100.0%."""
    student_skills = {"Python": 80, "SQL": 70, "Git": 50}
    result = calculate_role_match(student_skills, sample_role_skills, education_factor=1.0)
    assert result.skill_match_score == 100.0
    assert result.final_score == 100.0


def test_zero_skills(sample_role_skills):
    """Student with zero skills or empty repertoire must score exactly 0.0%."""
    result = calculate_role_match({}, sample_role_skills, education_factor=1.0)
    assert result.skill_match_score == 0.0
    assert result.final_score == 0.0

    all_zero = {"Python": 0, "SQL": 0, "Git": 0}
    result_zeros = calculate_role_match(all_zero, sample_role_skills, education_factor=1.0)
    assert result_zeros.skill_match_score == 0.0
    assert result_zeros.final_score == 0.0


def test_overqualification_capping():
    """Points in excess of required level must NOT compensate for deficits in other skills.
    Skill 1: req 50, wt 1. Student has 100. Capped at 50.
    Skill 2: req 50, wt 1. Student has 0.
    Total denominator: 100. Total numerator: 50. Match: 50.0%.
    """
    role = [
        RoleSkillSchema(name="Python", required_level=50, weight=1.0, role_importance=5.0),
        RoleSkillSchema(name="SQL", required_level=50, weight=1.0, role_importance=5.0),
    ]
    student = {"Python": 100, "SQL": 0}
    result = calculate_role_match(student, role, education_factor=1.0)
    assert result.skill_match_score == 50.0
    assert result.final_score == 50.0


def test_education_factor_multipliers(sample_role_skills):
    """Final Score must equal Skill Match Score multiplied by Education Factor."""
    student_skills = {"Python": 80, "SQL": 70, "Git": 50}  # 100% skill match
    
    cs_match = calculate_role_match(student_skills, sample_role_skills, education_factor=1.0)
    assert cs_match.final_score == 100.0

    allied_match = calculate_role_match(student_skills, sample_role_skills, education_factor=0.9)
    assert allied_match.final_score == 90.0

    stem_match = calculate_role_match(student_skills, sample_role_skills, education_factor=0.8)
    assert stem_match.final_score == 80.0

    nonstem_match = calculate_role_match(student_skills, sample_role_skills, education_factor=0.7)
    assert nonstem_match.final_score == 70.0


def test_weighted_influence():
    """Higher-weighted skills must impact the score more heavily than lower-weighted skills."""
    role = [
        RoleSkillSchema(name="HighWeight", required_level=100, weight=10.0, role_importance=10.0),
        RoleSkillSchema(name="LowWeight", required_level=100, weight=1.0, role_importance=1.0),
    ]
    # Denominator = 100*10 + 100*1 = 1100
    # Case A: Master HighWeight, zero LowWeight -> 1000/1100 = 90.91%
    result_a = calculate_role_match({"HighWeight": 100, "LowWeight": 0}, role, education_factor=1.0)
    assert result_a.skill_match_score == 90.91

    # Case B: Zero HighWeight, master LowWeight -> 100/1100 = 9.09%
    result_b = calculate_role_match({"HighWeight": 0, "LowWeight": 100}, role, education_factor=1.0)
    assert result_b.skill_match_score == 9.09


def test_empty_role_skills():
    """Role with no skills configured returns 0.0% without division-by-zero errors."""
    result = calculate_role_match({"Python": 80}, [], education_factor=1.0)
    assert result.skill_match_score == 0.0
    assert result.final_score == 0.0


def test_case_and_whitespace_normalization(sample_role_skills):
    """Case and leading/trailing whitespace variations in skill names must match accurately."""
    student_skills = {"  python  ": 80, "sql": 70, "GIT": 50}
    result = calculate_role_match(student_skills, sample_role_skills, education_factor=1.0)
    assert result.skill_match_score == 100.0


def test_resolve_education_factor():
    """Verifies standard fallback and explicit role-level education factors."""
    custom_factors = {"Aeronautical": 0.88}
    assert resolve_education_factor("Aeronautical", custom_factors) == 0.88
    assert resolve_education_factor("Computer Science") == 1.0
    assert resolve_education_factor("Non-Existent Degree") == 0.80
