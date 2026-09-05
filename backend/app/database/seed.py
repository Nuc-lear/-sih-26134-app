"""Database Seeding Script.
Populates the database with the 4 Controlled Industry Dataset roles and Sunny Ranjan benchmark student.
Ensures idempotency (safe to run multiple times without duplicating rows).
"""
import json
import logging
from sqlalchemy.orm import Session
from app.database.session import SessionLocal, engine, Base
from app.models.domain import (
    RoleModel,
    RoleSkillModel,
    RoleEducationFactorModel,
    StudentModel,
    StudentSkillModel,
)
from app.core.dataset import load_seed_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed")


def seed_database(db: Session) -> None:
    """Inserts or updates the 4 canonical roles and the demo student profile."""
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    data = load_seed_data()

    logger.info("Seeding Controlled Industry Dataset — MVP...")

    # 1. Seed Roles
    for r in data.get("roles", []):
        role_slug = r["slug"]
        role = db.query(RoleModel).filter(RoleModel.slug == role_slug).first()

        if not role:
            role = RoleModel(
                id=r["id"],
                slug=role_slug,
                title=r["title"],
                description=r["description"],
                industry_demand=r["industry_demand"],
            )
            db.add(role)
            db.flush()
            logger.info(f"Created role: {role.title}")
        else:
            role.title = r["title"]
            role.description = r["description"]
            role.industry_demand = r["industry_demand"]
            # Clear existing skills and education factors for clean refresh
            db.query(RoleSkillModel).filter(RoleSkillModel.role_id == role.id).delete()
            db.query(RoleEducationFactorModel).filter(RoleEducationFactorModel.role_id == role.id).delete()
            db.flush()
            logger.info(f"Updated role: {role.title}")

        # Add role skills
        for s in r.get("skills", []):
            role_skill = RoleSkillModel(
                role_id=role.id,
                skill_name=s["name"],
                required_level=s["required_level"],
                weight=s["weight"],
                role_importance=s["role_importance"],
                category=s.get("category", "General"),
            )
            db.add(role_skill)

        # Add education factors
        for deg, factor in r.get("education_factors", {}).items():
            edu_factor = RoleEducationFactorModel(
                role_id=role.id,
                degree_field=deg,
                factor=factor,
            )
            db.add(edu_factor)

    # 2. Seed Demo Student (Sunny Ranjan)
    demo = data.get("demo_student", {})
    if demo:
        student = db.query(StudentModel).filter(StudentModel.id == demo["id"]).first()
        if not student:
            student = StudentModel(
                id=demo["id"],
                full_name=demo["full_name"],
                education_level=demo["education_level"],
                degree_field=demo["degree_field"],
                graduation_year=demo["graduation_year"],
                current_year_of_study=demo["current_year_of_study"],
                linkedin_url=demo.get("linkedin_url"),
            )
            db.add(student)
            db.flush()
            logger.info(f"Created demo student: {student.full_name}")
        else:
            student.full_name = demo["full_name"]
            student.education_level = demo["education_level"]
            student.degree_field = demo["degree_field"]
            student.graduation_year = demo["graduation_year"]
            student.current_year_of_study = demo["current_year_of_study"]
            student.linkedin_url = demo.get("linkedin_url")
            db.query(StudentSkillModel).filter(StudentSkillModel.student_id == student.id).delete()
            db.flush()
            logger.info(f"Updated demo student: {student.full_name}")

        for skill_name, proficiency in demo.get("skills", {}).items():
            st_skill = StudentSkillModel(
                student_id=student.id,
                skill_name=skill_name,
                proficiency_level=proficiency,
            )
            db.add(st_skill)

    db.commit()
    logger.info("Controlled dataset seeding complete.")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
