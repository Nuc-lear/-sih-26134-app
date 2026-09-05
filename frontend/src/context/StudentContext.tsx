import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StudentProfile, FullAuditReport, SkillInput, StudentCreateInput } from '../types';
import { api } from '../services/api';

interface StudentContextType {
  student: StudentProfile | null;
  targetRoleSlug: string;
  auditReport: FullAuditReport | null;
  isLoading: boolean;
  error: string | null;
  loadDemoAarav: () => Promise<void>;
  saveStudentProfile: (input: StudentCreateInput, targetRole?: string) => Promise<void>;
  setTargetRole: (roleSlug: string) => Promise<void>;
  updateSkillLevel: (skillName: string, newLevel: number) => Promise<void>;
  recalculateAudit: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const STORAGE_KEY_STUDENT = 'nexmind_student_profile';
const STORAGE_KEY_ROLE = 'nexmind_target_role';

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STUDENT);
    return saved ? JSON.parse(saved) : null;
  });

  const [targetRoleSlug, setTargetRoleSlug] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_ROLE) || 'ai-ml-engineer';
  });

  const [auditReport, setAuditReport] = useState<FullAuditReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronize state with localStorage
  useEffect(() => {
    if (student) {
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(student));
    }
  }, [student]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ROLE, targetRoleSlug);
  }, [targetRoleSlug]);

  // Compute Full Audit when student or targetRoleSlug changes
  const runAudit = useCallback(async (currentStudent: StudentProfile, currentRoleSlug: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const report = await api.getFullAudit({
        studentId: currentStudent.id,
        studentName: currentStudent.full_name,
        degreeField: currentStudent.degree_field,
        targetRoleSlug: currentRoleSlug,
        skills: currentStudent.skills,
      });
      setAuditReport(report);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to calculate intelligence report.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Recalculate manually
  const recalculateAudit = useCallback(async () => {
    if (student) {
      await runAudit(student, targetRoleSlug);
    }
  }, [student, targetRoleSlug, runAudit]);

  // Load Aarav Sharma Demo Profile
  const loadDemoAarav = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const demo = await api.getDemoAarav();
      setStudent(demo);
      const defaultRole = 'ai-ml-engineer';
      setTargetRoleSlug(defaultRole);
      await runAudit(demo, defaultRole);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load demo profile.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [runAudit]);

  // Save/Create a student profile
  const saveStudentProfile = useCallback(
    async (input: StudentCreateInput, selectedRole?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const saved = await api.saveStudent(input);
        setStudent(saved);
        const role = selectedRole || targetRoleSlug;
        if (selectedRole) {
          setTargetRoleSlug(selectedRole);
        }
        await runAudit(saved, role);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save student profile.';
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [targetRoleSlug, runAudit]
  );

  // Switch target role
  const setTargetRole = useCallback(
    async (roleSlug: string) => {
      setTargetRoleSlug(roleSlug);
      if (student) {
        await runAudit(student, roleSlug);
      }
    },
    [student, runAudit]
  );

  // Live Skill Bump / Slider Adjustment (Closing beat of demo!)
  const updateSkillLevel = useCallback(
    async (skillName: string, newLevel: number) => {
      if (!student) return;

      const normalizedName = skillName.trim().toLowerCase();
      let found = false;

      const updatedSkills: SkillInput[] = student.skills.map((s) => {
        if (s.name.trim().toLowerCase() === normalizedName) {
          found = true;
          return { ...s, proficiency_level: Math.max(0, Math.min(100, newLevel)) };
        }
        return s;
      });

      if (!found) {
        updatedSkills.push({
          name: skillName.trim(),
          proficiency_level: Math.max(0, Math.min(100, newLevel)),
        });
      }

      const updatedStudent: StudentProfile = {
        ...student,
        skills: updatedSkills,
      };

      setStudent(updatedStudent);
      await runAudit(updatedStudent, targetRoleSlug);
    },
    [student, targetRoleSlug, runAudit]
  );

  // Auto-run initial audit if student was loaded from localStorage
  useEffect(() => {
    if (student && !auditReport && !isLoading) {
      runAudit(student, targetRoleSlug);
    }
  }, []);

  return (
    <StudentContext.Provider
      value={{
        student,
        targetRoleSlug,
        auditReport,
        isLoading,
        error,
        loadDemoAarav,
        saveStudentProfile,
        setTargetRole,
        updateSkillLevel,
        recalculateAudit,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = (): StudentContextType => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
