"""Report narration endpoints."""
from fastapi import APIRouter
from app.models.schemas import NarrationRequest, NarrationResponse
from app.services.llm_service import llm_service

router = APIRouter(prefix="/reports", tags=["AI Executive Narration"])


@router.post("/narrate", response_model=NarrationResponse, summary="Narrate pre-computed intelligence metrics")
async def narrate_audit_report(req: NarrationRequest):
    """Generates an executive narrative explaining pre-computed metrics.
    Zero-Scoring Invariant: The LLM only narrates existing numbers and never invents scores.
    """
    return await llm_service.narrate_report(req)
