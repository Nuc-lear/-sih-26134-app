"""Strict Pydantic v2 schemas for request validation and response serialization.
Strict typing is enforced across all domain entities (no any types).
"""
from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field, ConfigDict


# ==========================================
# Skill & Student Schemas
# ==========================================

class SkillInput(BaseModel):
    name: str = Field(..., description="Canonical name of the skill, e.g. Python, React")
    proficiency_level: int = Field(..., ge=0, le=100, description="Proficiency score from 0 to 100")


class StudentBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    education_level: str = Field("Undergraduate", description="Degree type: Undergraduate, Postgraduate, etc.")
    degree_field: str = Field("Computer Science", description="Major/Field of study, e.g. Computer Science, Mechanical")
    graduation_year: Optional[int] = Field(None, ge=2020, le=2035)
    current_year_of_study: int = Field(2, ge=1, le=5)
    linkedin_url: Optional[str] = Field(None, description="LinkedIn profile URL")


class StudentCreate(StudentBase):
    skills: List[SkillInput] = Field(default_factory=list)


class StudentResponse(StudentBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    skills: List[SkillInput]
    created_at: datetime


# ==========================================
# Role Schemas (Controlled Industry Dataset)
# ==========================================

class RoleSkillSchema(BaseModel):
    name: str
    required_level: int = Field(..., ge=0, le=100)
    weight: float = Field(..., ge=1.0, le=10.0)
    role_importance: float = Field(..., ge=1.0, le=10.0)
    category: str = "General"


class RoleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    slug: str
    title: str
    description: str
    industry_demand: float = Field(..., ge=1.0, le=10.0)
    skills: List[RoleSkillSchema]
    education_factors: Dict[str, float] = Field(default_factory=dict)


# ==========================================
# Deterministic Engine Result Schemas
# ==========================================

class SkillGapResult(BaseModel):
    skill_name: str
    student_level: int
    required_level: int
    gap: int = Field(..., ge=0, le=100)
    tier: str = Field(..., description="Strong | Developing | Major Gap | Critical Gap")
    category: str = "General"
    formula_breakdown: str = Field(..., description="max(0, required_level - student_level)")


class RoleMatchResult(BaseModel):
    role_id: str
    role_slug: str
    role_title: str
    skill_match_score: float = Field(..., ge=0.0, le=100.0)
    education_factor: float = Field(..., ge=0.5, le=1.0)
    final_score: float = Field(..., ge=0.0, le=100.0)
    formula_breakdown: str


class PriorityResult(BaseModel):
    skill_name: str
    gap: int
    industry_demand: float
    role_importance: float
    priority_score: float
    priority_tier: str = Field(..., description="Critical | High | Medium | Low")
    formula_breakdown: str
    why_text: str


class RecommendationItem(BaseModel):
    skill_name: str
    priority_tier: str
    priority_score: float
    gap: int
    action_type: str = Field(..., description="Hands-on Project | Coursework | System Design | Practice")
    suggested_milestone: str
    estimated_hours: int
    why_text: str


class FullAuditReport(BaseModel):
    student_id: str
    student_name: str
    degree_field: str
    target_role: RoleResponse
    role_matches: List[RoleMatchResult]
    skill_gaps: List[SkillGapResult]
    priorities: List[PriorityResult]
    recommendations: List[RecommendationItem]
    readiness_score: float
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    executive_narration: Optional[str] = None


# ==========================================
# Analysis Requests
# ==========================================

class AnalysisMatchRequest(BaseModel):
    student_skills: List[SkillInput]
    degree_field: str = "Computer Science"


class AnalysisGapRequest(BaseModel):
    role_slug: str
    student_skills: List[SkillInput]


class AnalysisPrioritiesRequest(BaseModel):
    role_slug: str
    student_skills: List[SkillInput]


# ==========================================
# LLM Pure Language Service Schemas
# ==========================================

class JobExtractRequest(BaseModel):
    raw_text: str = Field(..., min_length=10, description="Raw job description pasted by student")


class ExtractedSkill(BaseModel):
    name: str
    normalized_name: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    category: str = "General"


class JobExtractResponse(BaseModel):
    raw_skills_count: int
    extracted_skills: List[ExtractedSkill]


class NarrationRequest(BaseModel):
    student_name: str
    degree_field: str
    target_role_title: str
    match_score: float
    readiness_score: float
    top_strengths: List[str]
    top_gaps: List[str]
    top_priorities: List[str]


class NarrationResponse(BaseModel):
    executive_summary: str
    strengths: str
    bottlenecks: str
    roadmap: List[str]
    closing_note: str


# ==========================================
# LinkedIn Profile Intelligence Schemas
# ==========================================

class EvaluatedSkillItem(BaseModel):
    name: str
    normalized_name: str
    proficiency_level: int = Field(..., ge=0, le=100, description="Auto-evaluated proficiency score from 0 to 100")
    confidence: float = Field(0.85, ge=0.0, le=1.0)
    category: str = "Technical"
    rationale: Optional[str] = Field(None, description="Reason for proficiency calibration")


class SkillMatrixSummary(BaseModel):
    headline: str
    tier: str
    primary_domain: str
    summary_narrative: str
    strengths: List[str] = Field(default_factory=list)


class LinkedInAnalyzeRequest(BaseModel):
    linkedin_url: Optional[str] = Field(None, description="LinkedIn profile URL (optional)")
    profile_text: str = Field("", description="Raw LinkedIn headline, about section, or experience text")
    target_role_slug: Optional[str] = Field("ai-ml-engineer", description="Target role slug for alignment diagnostic")


class LinkedInAnalyzeResponse(BaseModel):
    profile_strength: str = Field(..., description="e.g. All-Star, Strong Technical, Developing")
    headline_analysis: str = Field(..., description="Actionable critique of the professional headline")
    keyword_suggestions: List[str] = Field(default_factory=list, description="Recommended keywords for target domain")
    optimization_tips: List[str] = Field(default_factory=list, description="Concrete profile improvement tips")
    extracted_skills: List[ExtractedSkill] = Field(default_factory=list, description="Detected skills from profile narrative")
    evaluated_skills: List[EvaluatedSkillItem] = Field(default_factory=list, description="Auto-evaluated skills with 0-100 scores")
    skill_matrix_summary: Optional[SkillMatrixSummary] = Field(None, description="Summarized skill matrix overview")


# ==========================================
# AI Dynamic Market Role Prediction Schemas
# ==========================================

class PredictedMarketRole(BaseModel):
    id: str
    slug: str
    title: str
    description: str
    industry_demand: float = Field(..., ge=1.0, le=10.0)
    fit_level: str = Field(..., description="High Fit | Strong Potential | Emerging Fit")
    match_percentage: float = Field(..., ge=0.0, le=100.0)
    core_skills: List[str] = Field(default_factory=list)
    market_outlook: str
    why_match: str
    benchmark_skills: List[RoleSkillSchema] = Field(default_factory=list)
    education_factors: Dict[str, float] = Field(default_factory=dict)


class RolePredictionRequest(BaseModel):
    student_name: str = "Candidate"
    degree_field: str = "Computer Science"
    skills: List[SkillInput] = Field(default_factory=list)
    api_key: Optional[str] = Field(None, description="Optional runtime Gemini API key override")


class RolePredictionResponse(BaseModel):
    predicted_roles: List[PredictedMarketRole] = Field(..., description="Top 10 predicted market roles")
    market_timestamp: str = Field(..., description="Timestamp of market analysis")
    total_candidates_analyzed: int = 10
    ai_engine_used: str = Field("Intelligent Semantic Engine", description="Name of the AI engine that produced the prediction")


# ========================================================
# AI Profile & Screenshot Evaluation Schemas (Step 2)
# ========================================================

class ProfileScreenshotEvaluateRequest(BaseModel):
    image_data: Optional[str] = Field(None, description="Base64 encoded profile screenshot (LinkedIn, LeetCode, GitHub)")
    profile_type: Optional[str] = Field("auto", description="'auto' | 'leetcode' | 'github' | 'linkedin'")
    profile_text: Optional[str] = Field("", description="Optional raw text, bio, or handle")
    target_role_slug: Optional[str] = Field("ai-ml-engineer", description="Target role slug for alignment calibration")
    api_key: Optional[str] = Field(None, description="Optional Gemini API key override")


class ProfileScreenshotEvaluateResponse(BaseModel):
    detected_platform: str = Field(..., description="e.g. LeetCode, GitHub, LinkedIn, Developer Portfolio")
    candidate_summary: str = Field(..., description="e.g. LeetCode Knight · 420+ Problems Solved")
    profile_highlights: List[str] = Field(default_factory=list, description="Key extracted proof-points")
    evaluated_skills: List[EvaluatedSkillItem] = Field(default_factory=list, description="Ranked skills with calibrated 0-100 scores")
    skill_matrix_summary: Optional[SkillMatrixSummary] = Field(None, description="Overview narrative of candidate abilities")
    ai_engine_used: str = Field("Gemini 2.0 Flash Vision", description="Active AI engine")


# ========================================================
# AI Target Career Journey Guide Schemas (Step 3)
# ========================================================

class JourneyPhase(BaseModel):
    phase_name: str = Field(..., description="e.g. Phase 1: Foundation Gap Sprint (Weeks 1-4)")
    focus_objective: str = Field(..., description="Primary learning and build goal for this phase")
    target_skills: List[str] = Field(default_factory=list, description="Skills to acquire or elevate")
    milestone_project: str = Field(..., description="Concrete project deliverable proving readiness")
    action_items: List[str] = Field(default_factory=list, description="Step-by-step checklist tasks")


class CareerJourneyGuideRequest(BaseModel):
    student_name: str = "Candidate"
    degree_field: str = "Computer Science"
    target_role_title: str
    target_role_slug: str
    current_skills: List[SkillInput] = Field(default_factory=list)
    api_key: Optional[str] = Field(None, description="Optional Gemini API key override")


class CareerJourneyGuideResponse(BaseModel):
    target_role_title: str
    current_baseline_summary: str
    readiness_trajectory: str
    phases: List[JourneyPhase]
    capstone_recommendation: str
    interview_readiness_checklist: List[str]
    ai_engine_used: str



