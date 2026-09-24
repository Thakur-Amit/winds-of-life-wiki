import React, { useState } from 'react';
import {
  WikiDoc,
  WikiDocType,
  CharacterDoc,
  HouseDoc,
  LocationDoc,
  EventDoc,
} from '../../types/wiki';
import { WikiSidebar } from './WikiSidebar';
import { PortableTextRenderer } from './PortableTextRenderer';
import { WikiInfobox } from './WikiInfobox';
import { FamilyTreeFlow } from './FamilyTreeFlow';
import { CodeArchitectureModal } from './CodeArchitectureModal';
import {
  Menu,
  X,
  Code2,
  GitFork,
  BookOpen,
  HelpCircle,
  Share2,
  Clock,
  Sparkles,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface WikiLayoutProps {
  characters: CharacterDoc[];
  houses: HouseDoc[];
  locations: LocationDoc[];
  events: EventDoc[];
  currentDoc: WikiDoc | null;
  currentView: 'doc' | 'tree';
  currentType: string;
  currentSlug: string;
  onNavigate: (type: WikiDocType | 'tree', slug: string) => void;
}

export const WikiLayout: React.FC<WikiLayoutProps> = ({
  characters,
  houses,
  locations,
  events,
  currentDoc,
  currentView,
  currentType,
  currentSlug,
  onNavigate,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [showHelpBanner, setShowHelpBanner] = useState(true);

  // Content to render in center
  const portableTextContent = currentDoc
    ? 'biography' in currentDoc && Array.isArray(currentDoc.biography)
      ? currentDoc.biography
      : 'history' in currentDoc && Array.isArray(currentDoc.history)
      ? currentDoc.history
      : 'details' in currentDoc && Array.isArray(currentDoc.details)
      ? currentDoc.details
      : 'traditions' in currentDoc && Array.isArray(currentDoc.traditions)
      ? currentDoc.traditions
      : 'rulesAndArtifacts' in currentDoc && Array.isArray(currentDoc.rulesAndArtifacts)
      ? currentDoc.rulesAndArtifacts
      : 'synopsis' in currentDoc && Array.isArray(currentDoc.synopsis)
      ? currentDoc.synopsis
      : 'description' in currentDoc && Array.isArray(currentDoc.description)
      ? currentDoc.description
      : []
    : [];

  const leadSummary = currentDoc
    ? 'quickSummary' in currentDoc && typeof currentDoc.quickSummary === 'string'
      ? currentDoc.quickSummary
      : 'description' in currentDoc && typeof currentDoc.description === 'string'
      ? currentDoc.description
      : undefined
    : undefined;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-200">
      {/* Code & Architecture Modal */}
      <CodeArchitectureModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      {/* Desktop Left Sidebar */}
      <div className="hidden md:flex shrink-0 h-full">
        <WikiSidebar
          characters={characters}
          houses={houses}
          locations={locations}
          events={events}
          currentType={currentType}
          currentSlug={currentSlug}
          onNavigate={(type, slug) => {
            onNavigate(type, slug);
          }}
          onOpenCodeInspector={() => setIsCodeModalOpen(true)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/80 backdrop-blur-sm">
          <div className="w-80 h-full bg-neutral-925 shadow-2xl relative flex flex-col">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-800 text-neutral-300 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <WikiSidebar
              characters={characters}
              houses={houses}
              locations={locations}
              events={events}
              currentType={currentType}
              currentSlug={currentSlug}
              onNavigate={(type, slug) => {
                setMobileSidebarOpen(false);
                onNavigate(type, slug);
              }}
              onOpenCodeInspector={() => {
                setMobileSidebarOpen(false);
                setIsCodeModalOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0a0c10]">
        {/* Top Navbar */}
        <header className="h-14 shrink-0 bg-neutral-925/90 backdrop-blur-md border-b border-neutral-800/80 px-4 flex items-center justify-between gap-4 z-20">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb path */}
            <nav className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono truncate">
              <button
                onClick={() => onNavigate('character', 'eddard-stark')}
                className="hover:text-amber-300 transition-colors"
              >
                Winds of Life
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              <span className="capitalize text-neutral-400">
                {currentView === 'tree' ? 'Family Trees' : currentType}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              <span className="text-amber-400 font-semibold truncate font-serif">
                {currentView === 'tree' ? 'House Stark Lineage' : currentDoc?.name || currentSlug}
              </span>
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-nav-family-tree"
              onClick={() => onNavigate('tree', 'stark')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                currentView === 'tree'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                  : 'bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border-neutral-800'
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Family Tree Graph</span>
            </button>

            <button
              type="button"
              id="btn-open-inspector-top"
              onClick={() => setIsCodeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-neutral-950 shadow-md shadow-amber-950/40 transition-all cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Sanity & Next.js Code</span>
            </button>
          </div>
        </header>

        {/* Feature Hint Banner */}
        {showHelpBanner && (
          <div className="bg-gradient-to-r from-amber-950/40 via-neutral-900 to-amber-950/30 border-b border-amber-900/30 px-4 py-2 text-xs flex items-center justify-between text-neutral-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-amber-300">Sanity Portable Text Interlinking:</strong> Hover over any underlined amber link (e.g., <em className="text-amber-200">Jon Snow, Winterfell, Robert's Rebellion</em>) to preview dynamic Sanity Hover Cards without regex scanning!
              </span>
            </div>
            <button
              onClick={() => setShowHelpBanner(false)}
              className="text-neutral-500 hover:text-neutral-300 text-xs px-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable Center Content Area */}
        <div className="flex-1 overflow-y-auto">
          {currentView === 'tree' ? (
            /* Interactive React Flow Family Tree View */
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto h-full flex flex-col">
              <FamilyTreeFlow
                onSelectCharacter={(slug) => {
                  onNavigate('character', slug);
                }}
              />
            </div>
          ) : currentDoc ? (
            /* 3-Column Wiki Article Layout */
            <article className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              {/* Header Title & Metadata */}
              <div className="border-b border-neutral-800 pb-5 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-400 font-semibold">
                      {currentDoc._type}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">
                      Archival Record: {currentDoc.slug?.current || (typeof currentDoc.slug === 'string' ? currentDoc.slug : currentDoc._id)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Revised 305 AC</span>
                    </span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-title text-neutral-100 tracking-wide mt-2">
                  {currentDoc.name}
                </h1>

                {/* Subtitle / Words / Titles */}
                {'motto' in currentDoc && currentDoc.motto && (
                  <p className="text-sm italic font-serif text-amber-300/90 mt-1">
                    "{currentDoc.motto}"
                  </p>
                )}
                {'titles' in currentDoc && currentDoc.titles && (
                  <p className="text-xs text-neutral-400 font-mono mt-1">
                    {currentDoc.titles.join(' • ')}
                  </p>
                )}

                {/* Lead quick summary box */}
                {leadSummary && (
                  <div className="mt-4 p-4 rounded-xl bg-neutral-900/60 border-l-4 border-amber-500/80 border-y border-r border-neutral-800/80 text-sm text-neutral-300 leading-relaxed font-sans">
                    <span className="font-semibold text-amber-300 font-serif mr-1">Codex Abstract:</span>
                    {leadSummary}
                  </div>
                )}
              </div>

              {/* Main 2-Column Desktop Grid (Article Content + Floating Infobox) */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Article Body with Custom Portable Text */}
                <div className="flex-1 min-w-0 max-w-3xl">
                  <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800/60 backdrop-blur-sm">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2 border-b border-neutral-800 pb-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>droplet-spire Historical Chronicle</span>
                    </h3>

                    {portableTextContent.length > 0 ? (
                      <PortableTextRenderer
                        value={portableTextContent}
                        onNavigate={(type, slug) => onNavigate(type, slug)}
                      />
                    ) : (
                      <p className="text-sm text-neutral-500 italic">
                        The archival scrolls for this entry are currently in the care of the Archmaesters at Oldtown.
                      </p>
                    )}

                    {/* Section: Linked Lineage / Family Quick Navigation if Character */}
                    {currentDoc._type === 'character' && (
                      <div className="mt-10 pt-6 border-t border-neutral-800/80">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold font-serif-title text-neutral-200 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-amber-400" />
                            <span>Dynastic Tree & Kinship</span>
                          </h4>
                          <button
                            type="button"
                            onClick={() => onNavigate('tree', 'stark')}
                            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium group"
                          >
                            <span>Open Full Visual Family Tree</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                        <p className="text-xs text-neutral-400 mb-3">
                          Explore the generational connections and marital alliances mapped dynamically via React Flow.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Sidebar: Dynamic Infobox */}
                <WikiInfobox
                  document={currentDoc}
                  onNavigate={(type, slug) => onNavigate(type, slug)}
                />
              </div>
            </article>
          ) : (
            <div className="p-12 text-center text-neutral-400">
              <h2 className="text-xl font-serif text-neutral-200">Record Not Found</h2>
              <p className="text-xs mt-2">The requested codex document could not be located in the archives.</p>
              <button
                onClick={() => onNavigate('character', 'eddard-stark')}
                className="mt-4 px-4 py-2 rounded-lg bg-amber-600 text-neutral-950 font-bold text-xs"
              >
                Return to Lord Eddard Stark
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
