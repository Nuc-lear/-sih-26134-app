"""Student and Demo Profile Endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.schemas import StudentCreate, StudentResponse
from app.services.student_service import create_or_update_student, get_student_by_id
from app.core.dataset import get_demo_aarav_profile

router = APIRouter(tags=["Students & Demo"])


@router.get("/demo/aarav", response_model=StudentResponse, summary="Get Aarav Sharma demo benchmark profile")
def get_aarav_demo():
    """Returns the pre-seeded benchmark student profile for Aarav Sharma (B.Tech CS, 2nd year).
    Allows instant testing without registration or manual typing.
    """
    return get_demo_aarav_profile()


@router.post("/students", response_model=StudentResponse, status_code=status.HTTP_201_CREATED, summary="Create or update student profile")
def create_student(student_in: StudentCreate, db: Session = Depends(get_db)):
    """Persists student profile and skill matrix."""
    return create_or_update_student(db, student_in)


@router.get("/students/{student_id}", response_model=StudentResponse, summary="Get student profile by ID")
def get_student(student_id: str, db: Session = Depends(get_db)):
    """Retrieves an existing student record."""
    student = get_student_by_id(db, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID '{student_id}' not found.",
        )
    return student
