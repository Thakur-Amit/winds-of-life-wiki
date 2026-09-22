import React from 'react';
import { Flame, Shield, BookOpen, Compass, ExternalLink } from 'lucide-react';

interface WikiFooterProps {
  onNavigate: (route: string, type?: string, slug?: string) => void;
}

export const WikiFooter: React.FC<WikiFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-850 mt-16 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-800">
          {/* Col 1: Brand & Citadel Seal */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Flame className="w-4 h-4 fill-amber-400/40" />
              </div>
              <span className="font-serif-title text-base font-bold text-neutral-100 tracking-wider">
                WINDS OF LIFE WIKI
              </span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-xs">
              A comprehensive encyclopedia and worldbuilding archive inspired by George R.R. Martin's <em>A Song of Ice and Fire</em> universe and <em>winds of life's wiki</em>.
            </p>
            <p className="text-[11px] font-mono text-neutral-500">
              Archived at the Citadel of Oldtown • 305 AC
            </p>
          </div>

          {/* Col 2: Core Compendiums */}
          <div>
            <h4 className="text-neutral-200 font-serif font-bold text-xs uppercase tracking-wider mb-3">
              Compendiums
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('characters')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Characters & Personages
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wiki', 'house', 'house-stark')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Great & Minor Houses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wiki', 'location', 'winterfell')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Realms, Castles & Places
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wiki', 'event', 'roberts-rebellion')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Chronicles & Great Wars
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Visual & Lore Tools */}
          <div>
            <h4 className="text-neutral-200 font-serif font-bold text-xs uppercase tracking-wider mb-3">
              Exploration & Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('family-tree')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Interactive Dynasty Tree (React Flow)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('characters')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Alphabetical Codex Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-amber-400 transition-colors text-left font-mono text-[11px] text-neutral-500 hover:text-amber-400"
                >
                  Sanity Studio Headless CMS (/admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Archival Disclaimer */}
          <div>
            <h4 className="text-neutral-200 font-serif font-bold text-xs uppercase tracking-wider mb-3">
              Archival Notice
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              All lore, characters, and geographical locations belong to their respective creators. Built for deep lore exploration, portable text interlinking, and lineage graphing.
            </p>
            <div className="mt-3 inline-block px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-amber-500/90">
              Next.js • Sanity.io • Tailwind CSS
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <p>© 305 AC Winds of Life. Non-commercial wiki project.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-neutral-300 transition-colors"
            >
              Back to Winds of Life
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('characters')}
              className="hover:text-neutral-300 transition-colors"
            >
              Characters
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('admin')}
              className="hover:text-amber-400 transition-colors font-mono"
            >
              CMS Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
