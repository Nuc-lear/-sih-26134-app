/**
 * Strict TypeScript types mirroring backend Pydantic schemas 1:1.
 * Strictly no 'any' types permitted without detailed justification.
 */

export type GapTier = 'Strong' | 'Developing' | 'Major Gap' | 'Critical Gap';
export type PriorityTier = 'Critical' | 'High' | 'Medium' | 'Low';

export interface SkillInput {
  name: string;
  proficiency_level: number;
}

export interface StudentProfile {
  id: string;
  full_name: string;
  education_level: string;
  degree_field: string;
  graduation_year?: number;
  current_year_of_study: number;
  linkedin_url?: string;
  skills: SkillInput[];
  created_at?: string;
}

export interface StudentCreateInput {
  full_name: string;
  education_level: string;
  degree_field: string;
  graduation_year?: number;
  current_year_of_study: number;
  linkedin_url?: string;
  skills: SkillInput[];
}

export interface RoleSkill {
  name: string;
  required_level: number;
  weight: number;
  role_importance: number;
  category: string;
}

export interface Role {
  id: string;
  slug: string;
  title: string;
  description: string;
  industry_demand: number;
  skills: RoleSkill[];
  education_factors: Record<string, number>;
}

export interface SkillGapResult {
  skill_name: string;
  student_level: number;
  required_level: number;
  gap: number;
  tier: GapTier;
  category: string;
  formula_breakdown: string;
}

export interface RoleMatchResult {
  role_id: string;
  role_slug: string;
  role_title: string;
  skill_match_score: number;
  education_factor: number;
  final_score: number;
  formula_breakdown: string;
}

export interface PriorityResult {
  skill_name: string;
  gap: number;
  industry_demand: number;
  role_importance: number;
  priority_score: number;
  priority_tier: PriorityTier;
  formula_breakdown: string;
  why_text: string;
}

export interface RecommendationItem {
  skill_name: string;
  priority_tier: PriorityTier;
  priority_score: number;
  gap: number;
  action_type: string;
  suggested_milestone: string;
  estimated_hours: number;
  why_text: string;
}

export interface FullAuditReport {
  student_id: string;
  student_name: string;
  degree_field: string;
  target_role: Role;
  role_matches: RoleMatchResult[];
  skill_gaps: SkillGapResult[];
  priorities: PriorityResult[];
  recommendations: RecommendationItem[];
  readiness_score: number;
  generated_at: string;
  executive_narration?: string;
}

export interface ExtractedSkill {
  name: string;
  normalized_name: string;
  confidence: number;
  category: string;
}

export interface JobExtractResponse {
  raw_skills_count: number;
  extracted_skills: ExtractedSkill[];
}

export interface NarrationResponse {
  executive_summary: string;
  strengths: string;
  bottlenecks: string;
  roadmap: string[];
  closing_note: string;
}

export interface EvaluatedSkillItem {
  name: string;
  normalized_name: string;
  proficiency_level: number;
  confidence: number;
  category: string;
  rationale?: string;
}

export interface SkillMatrixSummary {
  headline: string;
  tier: string;
  primary_domain: string;
  summary_narrative: string;
  strengths: string[];
}

export interface LinkedInAnalyzeRequest {
  linkedin_url?: string;
  profile_text: string;
  target_role_slug?: string;
}

export interface LinkedInAnalyzeResponse {
  profile_strength: string;
  headline_analysis: string;
  keyword_suggestions: string[];
  optimization_tips: string[];
  extracted_skills: ExtractedSkill[];
  evaluated_skills?: EvaluatedSkillItem[];
  skill_matrix_summary?: SkillMatrixSummary;
}

export interface PredictedMarketRole {
  id: string;
  slug: string;
  title: string;
  description: string;
  industry_demand: number;
  fit_level: 'High Fit' | 'Strong Potential' | 'Emerging Fit';
  match_percentage: number;
  core_skills: string[];
  market_outlook: string;
  why_match: string;
  benchmark_skills: RoleSkill[];
  education_factors?: Record<string, number>;
}

export interface RolePredictionResponse {
  predicted_roles: PredictedMarketRole[];
  market_timestamp: string;
  total_candidates_analyzed: number;
}


