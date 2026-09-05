import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Eye, Palette, Check, X } from 'lucide-react';
import { useTheme, AppTheme } from '../context/ThemeContext';

export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options: Array<{
    id: AppTheme;
    label: string;
    subtitle: string;
    icon: typeof Moon;
    title: string;
  }> = [
    {
      id: 'dark',
      label: 'Dark Theme',
      subtitle: 'Pure Black · OLED & High Contrast',
      icon: Moon,
      title: 'Black / Dark Theme',
    },
    {
      id: 'light',
      label: 'Light Theme',
      subtitle: 'Clean White · Daytime Reading',
      icon: Sun,
      title: 'White / Light Theme',
    },
    {
      id: 'eyecare',
      label: 'Eye Care Theme',
      subtitle: 'Warm Sepia · Low Blue Light',
      icon: Eye,
      title: 'Eye Protection (Warm Sepia)',
    },
  ];

  // Close panel on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const currentOption = options.find((o) => o.id === theme) || options[0];
  const CurrentIcon = currentOption.icon;

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Single Box Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={`Current Theme: ${currentOption.label}. Click to adjust Theme Slider.`}
        aria-label="Toggle Theme Slider"
        style={{ backgroundColor: 'var(--bg-surface)' }}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border shadow-md group ${
          isOpen
            ? 'border-accent ring-2 ring-accent/30 text-accent'
            : 'border-surface-border text-accent hover:border-accent/50'
        }`}
      >
        <CurrentIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
      </button>

      {/* Slide-out Theme Selector Panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-72 p-4 rounded-2xl border shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans text-left"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px var(--border-color)',
          }}
          role="dialog"
          aria-label="Theme Selection Slider"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between pb-3 border-b"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg border flex items-center justify-center text-accent"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <Palette className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block leading-tight">
                  Theme Appearance
                </span>
                <span className="text-[10px] text-zinc-400 block font-mono">
                  Active: {currentOption.label}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close panel"
              style={{ backgroundColor: 'transparent' }}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-surface-hover transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Direct Select Option Cards */}
          <div className="space-y-1.5 pt-3">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isActive = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTheme(opt.id)}
                  style={{
                    backgroundColor: isActive
                      ? 'var(--bg-surface-elevated)'
                      : 'var(--bg-main)',
                    borderColor: isActive ? 'var(--accent-color)' : 'var(--border-color)',
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                    isActive ? 'shadow-xs ring-1 ring-accent/30' : 'hover:opacity-90'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: isActive
                          ? 'var(--bg-surface)'
                          : 'var(--bg-surface-elevated)',
                        borderColor: 'var(--border-color)',
                        color: isActive ? 'var(--accent-color)' : 'var(--text-muted)',
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span
                        className={`text-xs font-semibold block ${
                          isActive ? 'text-accent' : 'text-zinc-200'
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-zinc-400 block font-normal">
                        {opt.subtitle}
                      </span>
                    </div>
                  </div>
                  {isActive && (
                    <Check className="w-4 h-4 text-accent shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
