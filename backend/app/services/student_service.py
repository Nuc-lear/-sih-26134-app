"""Student Service Layer.
Handles database persistence and retrieval for student profiles.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.domain import StudentModel, StudentSkillModel
from app.models.schemas import StudentCreate, StudentResponse, SkillInput


def create_or_update_student(db: Session, student_in: StudentCreate) -> StudentResponse:
    """Upserts student profile and associated skill proficiencies in database."""
    # Find existing student with the same full name or create new
    student = db.query(StudentModel).filter(StudentModel.full_name == student_in.full_name).first()
    
    if not student:
        student = StudentModel(
            full_name=student_in.full_name,
            education_level=student_in.education_level,
            degree_field=student_in.degree_field,
            graduation_year=student_in.graduation_year,
            current_year_of_study=student_in.current_year_of_study,
            linkedin_url=student_in.linkedin_url,
        )
        db.add(student)
        db.flush()
    else:
        student.education_level = student_in.education_level
        student.degree_field = student_in.degree_field
        student.graduation_year = student_in.graduation_year
        student.current_year_of_study = student_in.current_year_of_study
        student.linkedin_url = student_in.linkedin_url
        # Remove old skills to replace with new
        db.query(StudentSkillModel).filter(StudentSkillModel.student_id == student.id).delete()
        db.flush()

    # Add new skills
    for s in student_in.skills:
        skill_entry = StudentSkillModel(
            student_id=student.id,
            skill_name=s.name,
            proficiency_level=s.proficiency_level,
        )
        db.add(skill_entry)

    db.commit()
    db.refresh(student)

    skills_output = [
        SkillInput(name=s.skill_name, proficiency_level=s.proficiency_level)
        for s in student.skills
    ]

    return StudentResponse(
        id=student.id,
        full_name=student.full_name,
        education_level=student.education_level,
        degree_field=student.degree_field,
        graduation_year=student.graduation_year,
        current_year_of_study=student.current_year_of_study,
        linkedin_url=student.linkedin_url,
        skills=skills_output,
        created_at=student.created_at,
    )


def get_student_by_id(db: Session, student_id: str) -> Optional[StudentResponse]:
    """Retrieves student profile from database by ID."""
    student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if not student:
        return None

    skills_output = [
        SkillInput(name=s.skill_name, proficiency_level=s.proficiency_level)
        for s in student.skills
    ]

    return StudentResponse(
        id=student.id,
        full_name=student.full_name,
        education_level=student.education_level,
        degree_field=student.degree_field,
        graduation_year=student.graduation_year,
        current_year_of_study=student.current_year_of_study,
        linkedin_url=student.linkedin_url,
        skills=skills_output,
        created_at=student.created_at,
    )
