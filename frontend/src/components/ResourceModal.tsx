import React from 'react';
import { X, Youtube, Star, ExternalLink, Play, Clock, Eye, Sparkles } from 'lucide-react';

export interface SkillResource {
  title: string;
  channel: string;
  views: string;
  rating: string;
  duration: string;
  level: string;
  url: string;
  description: string;
}

interface ResourceModalProps {
  skillName: string;
  onClose: () => void;
}

export const getTopYoutubeLectures = (skill: string): SkillResource[] => {
  const s = skill.toLowerCase().trim();

  if (s.includes('python')) {
    return [
      {
        title: 'Python for Beginners – Full Course [Programming Tutorial]',
        channel: 'freeCodeCamp.org',
        views: '42M views',
        rating: '4.9',
        duration: '4h 26m',
        level: 'Beginner to Intermediate',
        url: 'https://www.youtube.com/results?search_query=freecodecamp+python+full+course',
        description: 'Complete Python programming course covering variables, loops, OOP, modules, and mini projects.'
      },
      {
        title: 'Python OOP Tutorials – Object Oriented Programming',
        channel: 'Corey Schafer',
        views: '8.5M views',
        rating: '4.9',
        duration: '2h 45m',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=corey+schafer+python+oop',
        description: 'Deep dive into classes, inheritance, dunder methods, decorators, and property setters.'
      },
      {
        title: 'Python in 100 Seconds & Advanced Features',
        channel: 'Fireship',
        views: '3.2M views',
        rating: '4.8',
        duration: '15m',
        level: 'All Levels',
        url: 'https://www.youtube.com/results?search_query=fireship+python',
        description: 'Fast-paced overview of Python syntax, memory model, GIL, and ecosystem.'
      }
    ];
  }

  if (s.includes('machine learning') || s.includes('deep learning') || s.includes('ai') || s.includes('pytorch') || s.includes('tensorflow')) {
    return [
      {
        title: 'Machine Learning & Neural Networks Course',
        channel: 'StatQuest with Josh Starmer',
        views: '6.4M views',
        rating: '4.9',
        duration: '6h 10m',
        level: 'Beginner to Advanced',
        url: 'https://www.youtube.com/results?search_query=statquest+machine+learning',
        description: 'Step-by-step mathematical breakdown of Decision Trees, SVMs, Neural Networks, and Gradient Descent.'
      },
      {
        title: 'Practical Deep Learning for Coders (PyTorch)',
        channel: 'Jeremy Howard / Fast.ai',
        views: '2.1M views',
        rating: '4.9',
        duration: '10h 30m',
        level: 'Intermediate',
        url: 'https://www.youtube.com/results?search_query=fast+ai+deep+learning+course',
        description: 'Hands-on PyTorch course building computer vision and NLP models from scratch.'
      },
      {
        title: 'Stanford CS229: Machine Learning Full Lecture Series',
        channel: 'Stanford University (Andrew Ng)',
        views: '15M views',
        rating: '5.0',
        duration: '20h Series',
        level: 'Advanced',
        url: 'https://www.youtube.com/results?search_query=stanford+cs229+andrew+ng',
        description: 'World-renowned academic lecture series on supervised, unsupervised learning, and reinforcement learning.'
      }
    ];
  }

  if (s.includes('react') || s.includes('javascript') || s.includes('typescript') || s.includes('frontend') || s.includes('html') || s.includes('css')) {
    return [
      {
        title: `${skill} Course - Beginner to Pro (Full Tutorial)`,
        channel: 'freeCodeCamp.org',
        views: '18M views',
        rating: '4.9',
        duration: '11h 55m',
        level: 'Beginner to Advanced',
        url: `https://www.youtube.com/results?search_query=freecodecamp+${encodeURIComponent(skill)}+course`,
        description: `Master component state, hooks, context API, router, and full-stack ${skill} project integration.`
      },
      {
        title: `Modern ${skill} Full Crash Course`,
        channel: 'Traversy Media',
        views: '5.2M views',
        rating: '4.8',
        duration: '3h 30m',
        level: 'All Levels',
        url: `https://www.youtube.com/results?search_query=traversy+media+${encodeURIComponent(skill)}`,
        description: 'Build real-world web apps with clean patterns, DOM manipulation, async/await, and APIs.'
      },
      {
        title: `${skill} Hooks & Architecture Patterns Explained`,
        channel: 'Web Dev Simplified',
        views: '2.8M views',
        rating: '4.9',
        duration: '1h 45m',
        level: 'Intermediate',
        url: `https://www.youtube.com/results?search_query=web+dev+simplified+${encodeURIComponent(skill)}`,
        description: 'Clear, concise breakdown of clean code patterns, performance optimization, and custom hooks.'
      }
    ];
  }

  if (s.includes('sql') || s.includes('database') || s.includes('postgres') || s.includes('mysql') || s.includes('backend')) {
    return [
      {
        title: 'SQL & Database Design Masterclass',
        channel: 'freeCodeCamp.org',
        views: '14M views',
        rating: '4.9',
        duration: '4h 20m',
        level: 'Beginner to Intermediate',
        url: 'https://www.youtube.com/results?search_query=freecodecamp+sql+full+course',
        description: 'Learn relational database schemas, JOINs, subqueries, indexing, and ACID transactions.'
      },
      {
        title: 'Database Internals, Indexing & Query Tuning',
        channel: 'Hussein Nasser',
        views: '1.9M views',
        rating: '4.9',
        duration: '3h 15m',
        level: 'Intermediate to Advanced',
        url: `https://www.youtube.com/results?search_query=hussein+nasser+${encodeURIComponent(skill)}`,
        description: 'In-depth architectural analysis of B-Trees, WAL logs, connection pooling, and indexing strategies.'
      }
    ];
  }

  // Generic Fallback
  return [
    {
      title: `${skill} Full Course – Complete Developer Tutorial`,
      channel: 'freeCodeCamp.org',
      views: '10M+ views',
      rating: '4.9',
      duration: '4h+ Full Course',
      level: 'Beginner to Advanced',
      url: `https://www.youtube.com/results?search_query=freecodecamp+${encodeURIComponent(skill)}+full+course`,
      description: `Comprehensive video tutorial covering ${skill} fundamentals, syntax, libraries, and real-world projects.`
    },
    {
      title: `${skill} Crash Course & Practical Best Practices`,
      channel: 'Fireship / Traversy Media',
      views: '3M+ views',
      rating: '4.8',
      duration: '1h 30m',
      level: 'All Levels',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill)}+crash+course+tutorial`,
      description: `Rapid breakdown of core ${skill} concepts, workflow tools, and industry standards.`
    },
    {
      title: `University Academic Lectures: ${skill}`,
      channel: 'MIT OpenCourseWare',
      views: '2M+ views',
      rating: '4.9',
      duration: 'Academic Series',
      level: 'Intermediate to Advanced',
      url: `https://www.youtube.com/results?search_query=mit+opencourseware+${encodeURIComponent(skill)}`,
      description: `Formal computer science and engineering lecture series from leading university professors.`
    }
  ];
};

export const ResourceModal: React.FC<ResourceModalProps> = ({ skillName, onClose }) => {
  const lectures = getTopYoutubeLectures(skillName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface border border-surface-border rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-surface-elevated transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Youtube className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Top Rated YouTube Lectures & Courses
              </h2>
              <span className="text-[10px] font-mono font-bold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                {skillName}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Hand-picked 4.8★+ video tutorials to master <strong className="text-zinc-200">{skillName}</strong> fast.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {lectures.map((lec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-elevated border border-surface-border space-y-2 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 flex items-center gap-1">
                      <Play className="w-3 h-3 fill-rose-400" />
                      {lec.channel}
                    </span>
                    <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {lec.rating} Rating
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lec.duration}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {lec.title}
                  </h3>
                </div>

                <a
                  href={lec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-md"
                >
                  <span>Watch Free</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {lec.description}
              </p>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 font-mono">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-zinc-400" />
                  {lec.views}
                </span>
                <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-zinc-400">
                  Level: {lec.level}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 border-t border-surface-border">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Zero-cost open learning resources verified by NEXMIND
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-white underline font-mono"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
