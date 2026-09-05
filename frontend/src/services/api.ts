/**
 * HTTP API client for backend communication.
 * Communicates with the FastAPI server running on /api/v1 (proxied via Vite).
 */
import {
  Role,
  StudentProfile,
  StudentCreateInput,
  RoleMatchResult,
  SkillGapResult,
  PriorityResult,
  FullAuditReport,
  SkillInput,
  JobExtractResponse,
  NarrationResponse,
  LinkedInAnalyzeRequest,
  LinkedInAnalyzeResponse,
  RolePredictionResponse,
  ProfileScreenshotEvaluateRequest,
  ProfileScreenshotEvaluateResponse,
  CareerJourneyGuideRequest,
  CareerJourneyGuideResponse,
} from '../types';

const API_BASE = '/api/v1';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body.detail) {
        errorDetail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
      }
    } catch {
      // ignore JSON parse failure
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

export const api = {
  // Roles
  async getRoles(): Promise<Role[]> {
    const res = await fetch(`${API_BASE}/roles`);
    return handleResponse<Role[]>(res);
  },

  async getRole(slug: string): Promise<Role> {
    const res = await fetch(`${API_BASE}/roles/${slug}`);
    return handleResponse<Role>(res);
  },

  // Student & Demo Profile
  async getDemoAarav(): Promise<StudentProfile> {
    const res = await fetch(`${API_BASE}/demo/aarav`);
    return handleResponse<StudentProfile>(res);
  },

  async getDemoSunny(): Promise<StudentProfile> {
    const res = await fetch(`${API_BASE}/demo/aarav`);
    return handleResponse<StudentProfile>(res);
  },

  async getDemoSuny(): Promise<StudentProfile> {
    const res = await fetch(`${API_BASE}/demo/aarav`);
    return handleResponse<StudentProfile>(res);
  },

  async saveStudent(student: StudentCreateInput): Promise<StudentProfile> {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    return handleResponse<StudentProfile>(res);
  },

  // Deterministic Analysis Engines
  async matchRoles(skills: SkillInput[], degreeField: string): Promise<RoleMatchResult[]> {
    const res = await fetch(`${API_BASE}/analysis/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_skills: skills, degree_field: degreeField }),
    });
    return handleResponse<RoleMatchResult[]>(res);
  },

  async analyzeGaps(roleSlug: string, skills: SkillInput[]): Promise<SkillGapResult[]> {
    const res = await fetch(`${API_BASE}/analysis/gap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_slug: roleSlug, student_skills: skills }),
    });
    return handleResponse<SkillGapResult[]>(res);
  },

  async getPriorities(roleSlug: string, skills: SkillInput[]): Promise<PriorityResult[]> {
    const res = await fetch(`${API_BASE}/analysis/prioritize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_slug: roleSlug, student_skills: skills }),
    });
    return handleResponse<PriorityResult[]>(res);
  },

  async getFullAudit(params: {
    studentId: string;
    studentName: string;
    degreeField: string;
    targetRoleSlug: string;
    skills: SkillInput[];
  }): Promise<FullAuditReport> {
    const res = await fetch(`${API_BASE}/analysis/full-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: params.studentId,
        student_name: params.studentName,
        degree_field: params.degreeField,
        target_role_slug: params.targetRoleSlug,
        student_skills: params.skills,
      }),
    });
    return handleResponse<FullAuditReport>(res);
  },

  // LLM Pure Text Services
  async extractJobSkills(rawText: string): Promise<JobExtractResponse> {
    const res = await fetch(`${API_BASE}/industry/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw_text: rawText }),
    });
    return handleResponse<JobExtractResponse>(res);
  },

  async narrateReport(payload: {
    student_name: string;
    degree_field: string;
    target_role_title: string;
    match_score: number;
    readiness_score: number;
    top_strengths: string[];
    top_gaps: string[];
    top_priorities: string[];
  }): Promise<NarrationResponse> {
    const res = await fetch(`${API_BASE}/reports/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<NarrationResponse>(res);
  },

  async analyzeLinkedInProfile(payload: LinkedInAnalyzeRequest): Promise<LinkedInAnalyzeResponse> {
    const res = await fetch(`${API_BASE}/industry/linkedin-analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<LinkedInAnalyzeResponse>(res);
  },

  async predictTopRoles(payload: {
    skills: SkillInput[];
    degreeField: string;
    studentName?: string;
    apiKey?: string;
  }): Promise<RolePredictionResponse> {
    const res = await fetch(`${API_BASE}/industry/predict-roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skills: payload.skills,
        degree_field: payload.degreeField,
        student_name: payload.studentName || 'Candidate',
        api_key: payload.apiKey || undefined,
      }),
    });
    return handleResponse<RolePredictionResponse>(res);
  },

  async evaluateProfileScreenshot(payload: ProfileScreenshotEvaluateRequest): Promise<ProfileScreenshotEvaluateResponse> {
    const res = await fetch(`${API_BASE}/industry/evaluate-profile-screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<ProfileScreenshotEvaluateResponse>(res);
  },

  async getCareerJourney(payload: CareerJourneyGuideRequest): Promise<CareerJourneyGuideResponse> {
    const res = await fetch(`${API_BASE}/industry/career-journey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<CareerJourneyGuideResponse>(res);
  },
};

