"""API v1 master router."""
from fastapi import APIRouter
from app.api.v1.endpoints import roles, student, matching, gap_analysis, recommendations, industry, report

api_router = APIRouter()

# Register endpoint routers
api_router.include_router(student.router)
api_router.include_router(roles.router)
api_router.include_router(matching.router)
api_router.include_router(gap_analysis.router)
api_router.include_router(recommendations.router)
api_router.include_router(industry.router)
api_router.include_router(report.router)
