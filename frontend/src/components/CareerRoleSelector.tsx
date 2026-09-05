import React, { useState, useMemo } from 'react';
import { Target, CheckCircle2, Search, ChevronDown } from 'lucide-react';
import { RoleMatchResult } from '../types';

interface CareerRoleSelectorProps {
  roleMatches: RoleMatchResult[];
  targetRoleSlug: string;
  onSelectRole: (roleSlug: string) => void;
  titleLabel?: string;
  subtitleLabel?: string;
}

export const CareerRoleSelector: React.FC<CareerRoleSelectorProps> = ({
  roleMatches,
  targetRoleSlug,
  onSelectRole,
  titleLabel = 'Target Benchmark Role',
  subtitleLabel = 'Switch role to recompute intelligence matrix',
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Active Selected Role
  const activeRole = useMemo(() => {
    return roleMatches.find((r) => r.role_slug === targetRoleSlug) || roleMatches[0];
  }, [roleMatches, targetRoleSlug]);

  // Top 6 Highest Match Roles for Quick Access
  const topMatches = useMemo(() => {
    return [...roleMatches].sort((a, b) => b.final_score - a.final_score).slice(0, 6);
  }, [roleMatches]);

  // Filtered Roles for Search
  const filteredRoles = useMemo(() => {
    if (!searchTerm.trim()) return roleMatches;
    const term = searchTerm.toLowerCase();
    return roleMatches.filter(
      (r) =>
        r.role_title.toLowerCase().includes(term) ||
        r.role_slug.toLowerCase().includes(term)
    );
  }, [roleMatches, searchTerm]);

  return (
    <div className="bg-surface border border-surface-border rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                {titleLabel}:
              </span>
              <span className="text-sm font-bold text-white">
                {activeRole ? activeRole.role_title : 'Select Role'}
              </span>
              {activeRole && (
                <span className="text-xs font-mono font-bold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                  {Math.round(activeRole.final_score)}% Match
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">{subtitleLabel}</p>
          </div>
        </div>

        {/* Quick Dropdown Select for All 106 Careers */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <select
              value={targetRoleSlug}
              onChange={(e) => onSelectRole(e.target.value)}
              className="appearance-none bg-surface-elevated border border-surface-border hover:border-accent text-xs font-medium text-white px-3.5 py-2 pr-8 rounded-xl focus:outline-none focus:border-accent transition-colors font-sans cursor-pointer shadow-sm"
            >
              <optgroup label="Top Recommended Matches">
                {topMatches.map((r) => (
                  <option key={`top-${r.role_slug}`} value={r.role_slug} className="bg-surface text-white">
                    ★ {r.role_title} ({Math.round(r.final_score)}% match)
                  </option>
                ))}
              </optgroup>
              <optgroup label={`All ${roleMatches.length} Industry Careers`}>
                {roleMatches.map((r) => (
                  <option key={r.role_slug} value={r.role_slug} className="bg-surface text-white">
                    {r.role_title} ({Math.round(r.final_score)}% match)
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-surface-elevated border border-surface-border hover:border-accent text-zinc-300 hover:text-white transition-colors shrink-0 inline-flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-accent" />
            <span>{isExpanded ? 'Compact View' : `Browse All (${roleMatches.length})`}</span>
          </button>
        </div>
      </div>

      {/* Top 6 Quick Match Cards */}
      {!isExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {topMatches.map((r) => {
            const isActive = r.role_slug === targetRoleSlug;
            return (
              <button
                key={r.role_slug}
                type="button"
                onClick={() => onSelectRole(r.role_slug)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'border-accent bg-surface-elevated ring-1 ring-accent/30 shadow-md'
                    : 'border-surface-border bg-surface-elevated/40 hover:bg-surface-elevated hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold truncate ${isActive ? 'text-accent' : 'text-white'}`}>
                    {r.role_title}
                  </span>
                  {isActive && <CheckCircle2 className="w-3 h-3 text-accent shrink-0" />}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono mt-1">
                  <span className="text-zinc-400">Match</span>
                  <span className="text-accent font-semibold">{Math.round(r.final_score)}%</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Expanded Searchable Career Selector Drawer */}
      {isExpanded && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search among ${roleMatches.length} careers (e.g. Developer, Engineer, Analyst, AI, Security)...`}
              className="w-full bg-surface-elevated border border-surface-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-accent"
            />
          </div>

          <div className="max-h-60 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {filteredRoles.map((r) => {
              const isActive = r.role_slug === targetRoleSlug;
              return (
                <button
                  key={r.role_slug}
                  type="button"
                  onClick={() => {
                    onSelectRole(r.role_slug);
                    setIsExpanded(false);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'border-accent bg-surface-elevated ring-1 ring-accent/30 shadow-md'
                      : 'border-surface-border bg-surface-elevated/40 hover:bg-surface-elevated hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold truncate ${isActive ? 'text-accent' : 'text-white'}`}>
                      {r.role_title}
                    </span>
                    {isActive && <CheckCircle2 className="w-3 h-3 text-accent shrink-0" />}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono mt-1">
                    <span className="text-zinc-400">Match</span>
                    <span className="text-accent font-semibold">{Math.round(r.final_score)}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
