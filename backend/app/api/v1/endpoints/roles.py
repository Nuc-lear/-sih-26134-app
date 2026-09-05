"""Roles API endpoints."""
from typing import List
from fastapi import APIRouter, HTTPException, status
from app.models.schemas import RoleResponse
from app.core.dataset import get_controlled_roles, get_role_by_slug

router = APIRouter(prefix="/roles", tags=["Controlled Industry Roles"])


@router.get("", response_model=List[RoleResponse], summary="List all controlled roles")
def list_roles():
    """Returns the 4 canonical roles in the Controlled Industry Dataset — MVP."""
    return get_controlled_roles()


@router.get("/{slug}", response_model=RoleResponse, summary="Get role requirements by slug or id")
def get_role(slug: str):
    """Retrieves full benchmark skills and education factors for a specific role."""
    role = get_role_by_slug(slug)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with slug '{slug}' not found in controlled dataset.",
        )
    return role
