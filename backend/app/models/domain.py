"""SQLAlchemy ORM models representing persistent domain entities."""
import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    ForeignKey,
    DateTime,
    JSON,
)
from sqlalchemy.orm import relationship
from app.database.session import Base


def generate_uuid() -> str:
    """Generate a string UUID."""
    return str(uuid.uuid4())


class StudentModel(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=True, index=True)
    full_name = Column(String, nullable=False)
    education_level = Column(String, default="Undergraduate")
    degree_field = Column(String, default="Computer Science")
    graduation_year = Column(Integer, nullable=True)
    current_year_of_study = Column(Integer, default=2)
    target_role_id = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    skills = relationship("StudentSkillModel", back_populates="student", cascade="all, delete-orphan")
    snapshots = relationship("AnalysisSnapshotModel", back_populates="student", cascade="all, delete-orphan")


class StudentSkillModel(Base):
    __tablename__ = "student_skills"

    id = Column(String, primary_key=True, default=generate_uuid)
    student_id = Column(String, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String, nullable=False, index=True)
    proficiency_level = Column(Integer, nullable=False)  # 0 to 100

    student = relationship("StudentModel", back_populates="skills")


class RoleModel(Base):
    __tablename__ = "roles"

    id = Column(String, primary_key=True, default=generate_uuid)
    slug = Column(String, unique=True, nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    industry_demand = Column(Float, nullable=False)  # 1.0 to 10.0
    created_at = Column(DateTime, default=datetime.utcnow)

    skills = relationship("RoleSkillModel", back_populates="role", cascade="all, delete-orphan")
    education_factors = relationship("RoleEducationFactorModel", back_populates="role", cascade="all, delete-orphan")


class RoleSkillModel(Base):
    __tablename__ = "role_skills"

    id = Column(String, primary_key=True, default=generate_uuid)
    role_id = Column(String, ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String, nullable=False, index=True)
    required_level = Column(Integer, nullable=False)  # 0 to 100
    weight = Column(Float, nullable=False, default=1.0)  # 1 to 10
    role_importance = Column(Float, nullable=False, default=5.0)  # 1.0 to 10.0
    category = Column(String, default="General")

    role = relationship("RoleModel", back_populates="skills")


class RoleEducationFactorModel(Base):
    __tablename__ = "role_education_factors"

    id = Column(String, primary_key=True, default=generate_uuid)
    role_id = Column(String, ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    degree_field = Column(String, nullable=False)
    factor = Column(Float, nullable=False, default=1.0)  # 0.5 to 1.0

    role = relationship("RoleModel", back_populates="education_factors")


class AnalysisSnapshotModel(Base):
    __tablename__ = "analysis_snapshots"

    id = Column(String, primary_key=True, default=generate_uuid)
    student_id = Column(String, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    role_id = Column(String, nullable=False)
    match_score = Column(Float, nullable=False)
    calculated_payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("StudentModel", back_populates="snapshots")
