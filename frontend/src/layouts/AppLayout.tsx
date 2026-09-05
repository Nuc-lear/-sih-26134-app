import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Cpu,
  Sparkles,
  LayoutDashboard,
  Target,
  FileText,
  FileCode,
  RotateCcw,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { student, loadDemoSuny, isLoading } = useStudent();

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/roles', label: 'Role Requirements', icon: Target },
    { to: '/priorities', label: 'Action Priorities', icon: FileCode },
    { to: '/report', label: 'AI Executive Brief', icon: FileText },
    { to: '/extractor', label: 'Job Parser', icon: Cpu },
  ];

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-surface-border relative">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-1.5 flex items-center justify-between gap-4 pr-12 sm:pr-14">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">
                  NEXMIND
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated text-accent border border-surface-border">
                  SIH26134
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 block -mt-0.5 font-normal">
                Deterministic Career Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links: Dashboard only, with dynamic breadcrumb when on sub-modules */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                location.pathname === '/dashboard'
                  ? 'bg-surface-elevated text-accent border border-surface-border shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-surface-hover'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            {location.pathname !== '/dashboard' && (
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-600 text-xs">/</span>
                <span className="text-xs text-zinc-300 font-medium px-2.5 py-1 rounded-md bg-surface-elevated border border-surface-border font-sans">
                  {navLinks.find((l) => l.to === location.pathname)?.label || 'Module'}
                </span>
              </div>
            )}
          </nav>

          {/* Right Action: Demo Profile Switcher */}
          <div className="flex items-center gap-3">
            {student ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <span className="text-xs font-semibold text-white block">
                    {student.full_name}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono block">
                    {student.degree_field} · Yr {student.current_year_of_study}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => loadDemoSuny()}
                  disabled={isLoading}
                  title="Reload baseline Suny Ranjan Verma benchmark"
                  className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-surface-elevated border border-surface-border transition-colors text-xs inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Demo</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => loadDemoSuny()}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-zinc-950 hover:bg-accent-hover text-xs font-semibold transition-all shadow-md font-sans"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Try Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Toppest Corner: Minimized Vertical Theme Switcher */}
        <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-30">
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface/50 py-6 text-xs text-zinc-500">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-mono">●</span>
            <span>Deterministic Scoring Engines: Active (Zero-AI Invariant Enforced)</span>
          </div>
          <span>Controlled Industry Dataset — MVP · Team NEXMIND</span>
        </div>
      </footer>
    </div>
  );
};
