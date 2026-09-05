import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Target,
  Plus,
  Code2,
  FileJson,
} from 'lucide-react';
import { api } from '../services/api';
import { ExtractedSkill } from '../types';
import { useStudent } from '../context/StudentContext';
import { LoadingState } from '../components/LoadingState';

interface RolePreset {
  slug: string;
  title: string;
  company: string;
  location: string;
  shortDesc: string;
  jd: string;
}

const ROLE_PRESETS: RolePreset[] = [
  {
    slug: 'ai-ml-engineer',
    title: 'Senior AI/ML & LLM Applications Engineer',
    company: 'NexusAI Global · San Francisco, CA (Hybrid)',
    location: '$165,000 - $210,000 · Full-time',
    shortDesc: 'PyTorch, LLMs, Transformers, RAG, Vector DBs, Python, REST APIs',
    jd: `About the Role:
We are seeking an experienced Senior AI/ML Engineer to build next-generation Generative AI workflows, autonomous agent systems, and production RAG pipelines.

Key Responsibilities:
- Design, train, and fine-tune large language models (LLMs) and diffusion neural networks using PyTorch.
- Architect high-throughput RAG (Retrieval-Augmented Generation) pipelines using vector databases (Milvus, Qdrant, Pinecone).
- Develop robust production REST APIs and gRPC microservices in Python to serve low-latency model inference.
- Apply rigorous statistical methods, Probability, and Linear Algebra for model evaluation, embeddings alignment, and prompt optimization.
- Collaborate with DevOps teams to deploy containerized ML models via Docker, Kubernetes, and automated CI/CD workflows with Git.

Requirements & Qualifications:
- 3+ years experience with Python, PyTorch, Transformers, HuggingFace, and Deep Learning architectures.
- Demonstrated hands-on experience with Machine Learning algorithms, Pandas, NumPy, and SQL data modeling.
- Solid understanding of System Design principles, caching layers, and asynchronous microservices.`,
  },
  {
    slug: 'frontend-developer',
    title: 'Lead Frontend & Web Applications Engineer',
    company: 'StripeTech Solutions · New York, NY (Remote)',
    location: '$140,000 - $180,000 · Full-time',
    shortDesc: 'React, TypeScript, JavaScript, CSS, HTML, Responsive Design, REST APIs',
    jd: `About the Role:
We are looking for a passionate Lead Frontend Engineer to build interactive, pixel-perfect web applications using modern component architectures.

Key Responsibilities:
- Craft scalable, accessible client-side UI components using React, TypeScript, and Tailwind CSS.
- Translate Figma designs into high-performance, fluid interfaces with strict Responsive Design principles.
- Manage client state management, real-time WebSocket subscriptions, and REST API data fetching.
- Maintain high code coverage with Jest and Cypress unit/integration test suites.
- Participate in Git code reviews, performance audits, and web accessibility standards (WCAG).

Requirements & Qualifications:
- Advanced mastery of JavaScript (ES6+), TypeScript, HTML, and modern CSS3 layout engines.
- Proven track record with React hooks, context, state management, and SSR frameworks like Next.js.
- Strong understanding of web performance optimization, bundle splitting, and browser rendering engines.`,
  },
  {
    slug: 'backend-developer',
    title: 'Senior Backend Systems Engineer',
    company: 'Datacore Cloud · Austin, TX (On-site)',
    location: '$150,000 - $190,000 · Full-time',
    shortDesc: 'Python, Java, SQL, REST APIs, System Design, Databases, Git',
    jd: `About the Role:
Join our core infrastructure team as a Senior Backend Systems Engineer to architect transactional distributed engines processing millions of events per second.

Key Responsibilities:
- Design scalable, fault-tolerant backend services and microservices using Python, Java, or C++.
- Architect relational PostgreSQL and MySQL database schemas, complex SQL queries, index optimization, and migration scripts.
- Develop secure, rate-limited REST APIs and GraphQL gateways for external partner integrations.
- Conduct high-level System Design for distributed lock managers, message queues, and caching clusters (Redis).
- Maintain CI/CD pipelines, automated testing, and version control using Git.

Requirements & Qualifications:
- Strong programming background in Python, Java, or C++ with deep knowledge of data structures and algorithms.
- Deep expertise in SQL relational databases, transactions (ACID), and query profiling.
- Solid grounding in System Design, microservices architecture, and API security.`,
  },
  {
    slug: 'devops-engineer',
    title: 'Senior DevOps & Cloud Infrastructure Engineer',
    company: 'CloudScale Global · Seattle, WA (Hybrid)',
    location: '$155,000 - $195,000 · Full-time',
    shortDesc: 'Docker, Kubernetes, AWS, Linux, CI/CD, Python, Git, System Design',
    jd: `About the Role:
We are hiring a Senior DevOps Engineer to automate enterprise multi-region cloud infrastructure, container orchestration, and continuous deployment pipelines.

Key Responsibilities:
- Provision Infrastructure-as-Code (IaC) using Terraform and CloudFormation across AWS cloud environments.
- Manage Kubernetes container clusters, Helm charts, ingress controllers, and Docker registries.
- Build continuous integration and deployment (CI/CD) pipelines using GitHub Actions and GitLab CI.
- Write automation scripts in Python and Bash for infrastructure monitoring and self-healing telemetry.
- Enforce Zero-Trust security policies, Linux hardening, and IAM permissions.

Requirements & Qualifications:
- Hands-on experience with Docker, Kubernetes, AWS cloud services, and Linux administration.
- Solid understanding of Git workflows, CI/CD automation, and Python/Bash scripting.`,
  },
  {
    slug: 'data-engineer',
    title: 'Senior Data & Analytics Engineer',
    company: 'FinAnalytics Inc · Chicago, IL (Remote)',
    location: '$145,000 - $185,000 · Full-time',
    shortDesc: 'Python, SQL, Spark, Data Engineering, ETL, Databases, Pandas',
    jd: `About the Role:
Looking for a Senior Data Engineer to architect real-time stream processing, data lakehouses, and high-volume ETL pipelines.

Key Responsibilities:
- Build batch and streaming data pipelines using Apache Spark, PySpark, and Kafka.
- Design analytical data warehouses (Snowflake, BigQuery) with optimized SQL star schemas.
- Implement data quality monitoring, data lineage, and automated orchestration (Airflow/Dagster).
- Manipulate financial telemetry using Python, Pandas, and NumPy for business analytics teams.

Requirements & Qualifications:
- Expert-level SQL and relational/columnar database experience.
- Deep experience with Python, Spark, ETL orchestration, and Big Data storage formats (Parquet, Delta Lake).`,
  },
  {
    slug: 'cybersecurity-analyst',
    title: 'Cybersecurity Threat & Incident Response Analyst',
    company: 'SecureNet Defense · Washington, DC (Hybrid)',
    location: '$135,000 - $175,000 · Full-time',
    shortDesc: 'Security, Networking, Linux, Python, Penetration Testing, SIEM',
    jd: `About the Role:
Protect enterprise networks from advanced persistent threats as a Cybersecurity Analyst in our Security Operations Center (SOC).

Key Responsibilities:
- Analyze real-time security alerts using SIEM tools (Splunk, Elastic Security) and network traffic analyzers (Wireshark).
- Conduct web application vulnerability scans and offensive Penetration Testing audits.
- Hard Linux operating system kernels, firewalls, and network routing protocols.
- Develop custom incident automation tools and log parsing scripts in Python and Bash.

Requirements & Qualifications:
- Demonstrated understanding of Cybersecurity frameworks, OSI networking model, and cryptography.
- Practical experience with Linux systems, network security monitoring, and penetration testing tools.`,
  },
  {
    slug: 'data-analyst',
    title: 'Senior Data Analyst & Business Intelligence Specialist',
    company: 'GrowthMetrics Inc · Boston, MA (Hybrid)',
    location: '$120,000 - $155,000 · Full-time',
    shortDesc: 'SQL, Excel, Statistics, Python, Pandas, Power BI, Data Visualization',
    jd: `About the Role:
We are hiring a Senior Data Analyst to transform complex transactional data into strategic business insights and executive dashboards.

Key Responsibilities:
- Write complex SQL analytical queries, window functions, CTEs, and cohort retention models.
- Build automated executive dashboards and reporting views in Power BI and Tableau.
- Perform exploratory statistical analysis and hypothesis testing using Python and Pandas.
- Collaborate with product and business stakeholders to present actionable recommendations.

Requirements & Qualifications:
- Advanced SQL proficiency across large relational databases.
- Hands-on experience with Data Visualization, Excel modeling, Statistics, and Python.`,
  },
  {
    slug: 'fullstack-developer',
    title: 'Full Stack Web Applications Engineer',
    company: 'VentureScale Labs · San Jose, CA (Remote)',
    location: '$145,000 - $185,000 · Full-time',
    shortDesc: 'React, TypeScript, Node.js, Python, SQL, REST APIs, Git, System Design',
    jd: `About the Role:
Join a fast-moving engineering team as a Full Stack Engineer building user-facing web products from database to UI.

Key Responsibilities:
- Build frontend interfaces using React, TypeScript, and modern CSS frameworks.
- Engineer backend REST APIs and microservices in Node.js, Express, and Python.
- Model PostgreSQL database schemas, write optimized SQL queries, and manage migrations.
- Architect modular software systems adhering to clean code standards, Git workflow, and automated testing.

Requirements & Qualifications:
- Full-stack mastery across React, TypeScript, Node.js or Python backend frameworks.
- Proficiency with SQL databases, RESTful API design, and version control using Git.`,
  },
];

export const JobExtractorPage: React.FC = () => {
  const { student, targetRoleSlug, setTargetRole, auditReport, updateSkillLevel } = useStudent();

  const currentPreset =
    ROLE_PRESETS.find((p) => p.slug === targetRoleSlug) || ROLE_PRESETS[0];

  const [rawText, setRawText] = useState<string>(currentPreset.jd);
  const [selectedPresetSlug, setSelectedPresetSlug] = useState<string>(targetRoleSlug);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedSkills, setExtractedSkills] = useState<ExtractedSkill[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_profile' | 'missing' | 'role_req'>('all');
  const [addedSkillsSuccess, setAddedSkillsSuccess] = useState<string | null>(null);
  const [showJsonView, setShowJsonView] = useState<boolean>(false);

  // Synchronize preset text when targetRoleSlug changes
  useEffect(() => {
    setSelectedPresetSlug(targetRoleSlug);
    const preset = ROLE_PRESETS.find((p) => p.slug === targetRoleSlug);
    if (preset) {
      setRawText(preset.jd);
      setExtractedSkills([]);
      setAddedSkillsSuccess(null);
    }
  }, [targetRoleSlug]);

  const handleSelectRolePreset = (preset: RolePreset) => {
    setSelectedPresetSlug(preset.slug);
    setRawText(preset.jd);
    setExtractedSkills([]);
    setAddedSkillsSuccess(null);
    setTargetRole(preset.slug);
  };

  const handleExtract = async () => {
    if (!rawText.trim()) return;
    setIsExtracting(true);
    setError(null);
    setAddedSkillsSuccess(null);
    try {
      const res = await api.extractJobSkills(rawText);
      setExtractedSkills(res.extracted_skills);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Skill extraction failed.';
      setError(msg);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddSkillToProfile = async (skillName: string) => {
    if (!student) return;
    const existing = student.skills.find(
      (s) => s.name.toLowerCase() === skillName.toLowerCase()
    );
    if (existing) return;

    await updateSkillLevel(skillName, 50);
    setAddedSkillsSuccess(`Added "${skillName}" (50% proficiency) to your profile!`);
  };

  // Target role required skill names set
  const targetRoleSkillNames = new Set(
    (auditReport?.target_role?.skills || []).map((s) => s.name.toLowerCase())
  );

  // Filter logic
  const filteredSkills = extractedSkills.filter((item) => {
    const studentHasSkill = Boolean(
      student?.skills.some((s) => s.name.toLowerCase() === item.normalized_name.toLowerCase())
    );
    const isRequiredInRole = targetRoleSkillNames.has(item.normalized_name.toLowerCase());

    if (activeFilter === 'in_profile') return studentHasSkill;
    if (activeFilter === 'missing') return !studentHasSkill;
    if (activeFilter === 'role_req') return isRequiredInRole;
    return true;
  });

  // Extraction Statistics
  const inProfileCount = extractedSkills.filter((s) =>
    student?.skills.some((sk) => sk.name.toLowerCase() === s.normalized_name.toLowerCase())
  ).length;
  const missingCount = extractedSkills.length - inProfileCount;
  const roleReqCount = extractedSkills.filter((s) =>
    targetRoleSkillNames.has(s.normalized_name.toLowerCase())
  ).length;
  const matchRate = extractedSkills.length > 0
    ? Math.round((inProfileCount / extractedSkills.length) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 space-y-3 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-surface-border text-xs text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>LLM Structured Parser Layer</span>
            <span className="text-zinc-600">|</span>
            <span className="text-accent font-mono text-[11px] font-semibold">
              Target: {auditReport?.target_role?.title || currentPreset.title}
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            Strict Schema Validated
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Job Description Skill Extractor
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Paste any unstructured job posting or select an industry benchmark below. Our AI engine extracts canonical engineering abilities with confidence scores and maps them against <span className="text-white font-medium">{student?.full_name || 'your profile'}</span>.
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="bg-surface border border-surface-border rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase font-mono tracking-wider">
            <Target className="w-4 h-4 text-accent" />
            <span>Industry Benchmark JDs ({ROLE_PRESETS.length} Roles)</span>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            Syncs with Target Role
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {ROLE_PRESETS.map((preset) => {
            const isActive = selectedPresetSlug === preset.slug;
            return (
              <button
                key={preset.slug}
                type="button"
                onClick={() => handleSelectRolePreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'border-accent bg-surface-elevated ring-2 ring-accent/30 shadow-md'
                    : 'border-surface-border bg-surface-elevated/40 hover:bg-surface-elevated hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold truncate ${isActive ? 'text-accent' : 'text-white'}`}>
                    {preset.title.split(' ')[0]} {preset.title.split(' ')[1] || ''}
                  </span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />}
                </div>
                <span className="text-[10px] text-zinc-400 block mt-1 line-clamp-1 font-mono">
                  {preset.shortDesc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-surface border border-surface-border rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <label className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-accent" />
              <span>Raw Job Posting Text ({currentPreset.title})</span>
            </label>
            <span className="text-[11px] text-zinc-400 block mt-0.5">
              {currentPreset.company} · {currentPreset.location}
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">
            {rawText.length} characters
          </span>
        </div>

        <textarea
          rows={9}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste raw job description here..."
          className="w-full bg-surface-elevated border border-surface-border rounded-xl p-4 text-xs font-mono text-zinc-200 focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-zinc-500">
            Edit text freely or test directly on preset
          </span>
          <button
            type="button"
            onClick={handleExtract}
            disabled={isExtracting || !rawText.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-zinc-950 hover:bg-accent-hover font-bold text-xs transition-all shadow-md disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isExtracting ? 'Parsing Structured JSON...' : 'Extract & Match Skills'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State during parsing */}
      {isExtracting && (
        <div className="py-8">
          <LoadingState
            message="Parsing unstructured job description..."
            submessage="Identifying canonical engineering skills and calculating normalization confidence"
          />
        </div>
      )}

      {/* Extracted Skills Section */}
      {extractedSkills.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Analytics Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-1">
              <span className="text-[11px] text-zinc-400 block font-mono">Extracted Skills</span>
              <span className="text-xl font-bold text-white font-mono">{extractedSkills.length}</span>
              <span className="text-[10px] text-zinc-500 block">Canonical terms</span>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-1">
              <span className="text-[11px] text-zinc-400 block font-mono">Skill Match Rate</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">{matchRate}%</span>
              <span className="text-[10px] text-zinc-500 block">{inProfileCount} of {extractedSkills.length} in profile</span>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-1">
              <span className="text-[11px] text-zinc-400 block font-mono">Missing Skills</span>
              <span className="text-xl font-bold text-rose-400 font-mono">{missingCount}</span>
              <span className="text-[10px] text-zinc-500 block">Gap to close</span>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-1">
              <span className="text-[11px] text-zinc-400 block font-mono">Role Required</span>
              <span className="text-xl font-bold text-accent font-mono">{roleReqCount}</span>
              <span className="text-[10px] text-zinc-500 block">Core target requirements</span>
            </div>
          </div>

          {/* Success Banner */}
          {addedSkillsSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{addedSkillsSuccess}</span>
            </div>
          )}

          {/* Controls & Filter Bar */}
          <div className="bg-surface border border-surface-border rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Normalized Skill Entities ({filteredSkills.length})
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Extracted from <strong className="text-zinc-200">{currentPreset.title}</strong>
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: `All (${extractedSkills.length})` },
                  { id: 'in_profile', label: `In Profile (${inProfileCount})` },
                  { id: 'missing', label: `Missing (${missingCount})` },
                  { id: 'role_req', label: `Role Req (${roleReqCount})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFilter(f.id as any)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      activeFilter === f.id
                        ? 'bg-accent text-zinc-950 font-bold border-accent'
                        : 'bg-surface-elevated border-surface-border text-zinc-300 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setShowJsonView(!showJsonView)}
                  className="text-xs px-2.5 py-1 rounded-lg border border-surface-border bg-surface hover:bg-surface-elevated text-zinc-400 hover:text-white inline-flex items-center gap-1 transition-colors ml-auto"
                >
                  <FileJson className="w-3.5 h-3.5" />
                  <span>{showJsonView ? 'Hide JSON' : 'JSON Payload'}</span>
                </button>
              </div>
            </div>

            {/* JSON Output Viewer */}
            {showJsonView && (
              <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-2 animate-in fade-in">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                  JSON Schema Payload (Structured Response)
                </span>
                <pre className="text-[11px] font-mono text-emerald-400 max-h-60 overflow-y-auto p-3 rounded-lg bg-surface border border-surface-border">
                  {JSON.stringify({ extracted_skills: extractedSkills }, null, 2)}
                </pre>
              </div>
            )}

            {/* Extracted Skill Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredSkills.map((item: ExtractedSkill) => {
                const studentSkill = student?.skills.find(
                  (s) => s.name.toLowerCase() === item.normalized_name.toLowerCase()
                );
                const studentHasSkill = Boolean(studentSkill);
                const isRequiredInRole = targetRoleSkillNames.has(
                  item.normalized_name.toLowerCase()
                );

                return (
                  <div
                    key={item.normalized_name}
                    className="p-3.5 bg-surface-elevated border border-surface-border rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">
                          {item.normalized_name}
                        </span>
                        {isRequiredInRole && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 font-mono font-semibold">
                            Role Req
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-surface-border text-zinc-400 font-mono">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono block">
                        Confidence: {(item.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      {studentHasSkill ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>In Profile ({studentSkill?.proficiency_level}%)</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddSkillToProfile(item.normalized_name)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-accent-hover bg-accent/10 hover:bg-accent/20 px-2.5 py-1 rounded-lg border border-accent/30 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Profile</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

