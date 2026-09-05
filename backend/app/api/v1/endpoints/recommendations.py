"""Priority & Full Audit Intelligence Endpoints."""
from typing import List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app.models.schemas import (
    AnalysisPrioritiesRequest,
    PriorityResult,
    FullAuditReport,
    SkillInput,
)
from app.services.recommendation_service import (
    compute_priorities_for_role,
    generate_full_audit,
)

router = APIRouter(prefix="/analysis", tags=["Deterministic Analysis"])


class FullAuditRequest(BaseModel):
    student_id: str = "demo-aarav-sharma"
    student_name: str = "Aarav Sharma"
    degree_field: str = "Computer Science"
    target_role_slug: str = "ai-ml-engineer"
    student_skills: List[SkillInput] = Field(default_factory=list)


@router.post("/prioritize", response_model=List[PriorityResult], summary="Calculate mathematical priorities for a role")
def run_priorities(req: AnalysisPrioritiesRequest):
    """Calculates prioritized gaps ordered by mathematically calculated leverage."""
    try:
        return compute_priorities_for_role(
            role_slug=req.role_slug,
            student_skills=req.student_skills,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/full-audit", response_model=FullAuditReport, summary="Generate full deterministic intelligence report")
def run_full_audit(req: FullAuditRequest):
    """Generates the master audit payload including matches across all roles,
    gap breakdowns, mathematical priorities, and structured recommendations.
    """
    return generate_full_audit(
        student_id=req.student_id,
        student_name=req.student_name,
        degree_field=req.degree_field,
        target_role_slug=req.target_role_slug,
        student_skills=req.student_skills,
    )
