import { useEffect, useState } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { Role, RoleSkill } from '../types';
import { useStudent } from '../context/StudentContext';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

export const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { targetRoleSlug, setTargetRole } = useStudent();

  const fetchRoles = () => {
    setIsLoading(true);
    setError(null);
    api.getRoles()
      .then((data) => {
        setRoles(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load industry roles.');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  if (isLoading) {
    return (
      <div className="py-16">
        <LoadingState
          message="Loading controlled industry roles..."
          submessage="Retrieving benchmark skill requirements and educational weights"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <ErrorState
          title="Could Not Load Industry Roles"
          message={error}
          onRetry={fetchRoles}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-elevated border border-surface-border text-xs text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Controlled Industry Dataset — MVP</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Industry Benchmark Roles
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Calibrated role requirements defining required proficiencies (0–100), relative weights,
          and macro market demand.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((r: Role) => {
          const isSelected = targetRoleSlug === r.slug;
          return (
            <div
              key={r.slug}
              className={`bg-surface border rounded-2xl p-6 space-y-4 transition-all ${
                isSelected
                  ? 'border-accent ring-1 ring-accent/30 shadow-lg'
                  : 'border-surface-border hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{r.title}</h2>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Target Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{r.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-zinc-400 font-mono block">Demand</span>
                  <span className="text-lg font-bold text-sky-400 font-mono">
                    {r.industry_demand.toFixed(1)}/10
                  </span>
                </div>
              </div>

              {/* Benchmark Skill Requirements Table */}
              <div className="pt-2">
                <span className="text-xs font-medium uppercase font-mono tracking-wider text-zinc-400 block mb-2">
                  Benchmark Skills ({r.skills.length})
                </span>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {r.skills.map((s: RoleSkill) => (
                    <div
                      key={s.name}
                      className="p-2.5 bg-surface-elevated border border-surface-border rounded-lg flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-white block">{s.name}</span>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          Importance: {s.role_importance.toFixed(1)}/10 · Wt: {s.weight.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-zinc-400 block text-[10px]">Req Benchmark</span>
                        <span className="font-bold text-sky-400">{s.required_level}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Action */}
              <div className="pt-3 border-t border-surface-border flex justify-end">
                <button
                  type="button"
                  onClick={() => setTargetRole(r.slug)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isSelected
                      ? 'bg-surface-elevated text-zinc-400 border border-surface-border cursor-default'
                      : 'bg-accent text-zinc-950 hover:bg-accent-hover shadow-md'
                  }`}
                >
                  {isSelected ? 'Target Active' : 'Set as My Target Role'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
