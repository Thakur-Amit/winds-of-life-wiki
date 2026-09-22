import React, { useState } from 'react';
import {
  WikiDoc,
  WikiDocType,
  CharacterDoc,
  HouseDoc,
  LocationDoc,
  EventDoc,
} from '../../types/wiki';
import { getDocSlug } from '../../data/mockSanityData';
import {
  Search,
  BookOpen,
  Shield,
  MapPin,
  Calendar,
  Users,
  GitFork,
  Code2,
  ChevronDown,
  ChevronRight,
  Flame,
  Bookmark,
  Sparkles,
} from 'lucide-react';

interface WikiSidebarProps {
  characters: CharacterDoc[];
  houses: HouseDoc[];
  locations: LocationDoc[];
  events: EventDoc[];
  currentType: string;
  currentSlug: string;
  onNavigate: (type: WikiDocType | 'tree', slug: string) => void;
  onOpenCodeInspector: () => void;
}

export const WikiSidebar: React.FC<WikiSidebarProps> = ({
  characters,
  houses,
  locations,
  events,
  currentType,
  currentSlug,
  onNavigate,
  onOpenCodeInspector,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState({
    characters: true,
    houses: true,
    locations: true,
    events: true,
    trees: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Quick filter items by search query
  const matchesSearch = (item: { name: string; quickSummary?: string; [key: string]: any }) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.quickSummary && item.quickSummary.toLowerCase().includes(q)) ||
      (item.titles && item.titles.some((t: string) => t.toLowerCase().includes(q))) ||
      (item.motto && item.motto.toLowerCase().includes(q)) ||
      (item.region && item.region.toLowerCase().includes(q))
    );
  };

  const filteredCharacters = characters.filter(matchesSearch);
  const filteredHouses = houses.filter(matchesSearch);
  const filteredLocations = locations.filter(matchesSearch);
  const filteredEvents = events.filter(matchesSearch);

  return (
    <aside
      id="wiki-navigation-sidebar"
      className="w-72 lg:w-80 shrink-0 bg-neutral-925 border-r border-neutral-800 flex flex-col h-full select-none"
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-950/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-950/40 text-neutral-100">
            <Flame className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-neutral-100 font-serif-title tracking-wide flex items-center gap-1.5">
              Winds of Life
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                Wiki
              </span>
            </h1>
            <p className="text-[11px] text-neutral-400 font-mono">
              Worldbuilding & Lore Engine
            </p>
          </div>
        </div>

        {/* Search Bar with instant filter */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            id="wiki-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search characters, houses, seats..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-[11px] text-neutral-400 hover:text-neutral-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {/* Interactive Family Trees section */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onNavigate('tree', 'stark')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              currentType === 'tree'
                ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60 shadow-sm'
                : 'text-neutral-300 hover:bg-neutral-850 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-amber-400" />
              <span className="font-semibold font-serif">Family Tree Flow</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 font-mono">
              Interactive
            </span>
          </button>
        </div>

        {/* Category: Characters */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => toggleSection('characters')}
            className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-neutral-200"
          >
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Personages ({filteredCharacters.length})</span>
            </span>
            {openSections.characters ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {openSections.characters && (
            <div className="space-y-0.5 pl-2 border-l border-neutral-800/80 ml-2">
              {filteredCharacters.map((c) => {
                const cSlug = getDocSlug(c);
                const isActive = currentType === 'character' && currentSlug === cSlug;
                return (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => onNavigate('character', cSlug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs truncate flex items-center justify-between group transition-colors ${
                      isActive
                        ? 'bg-amber-950/50 text-amber-200 border-l-2 border-amber-400 font-medium'
                        : 'text-neutral-300 hover:bg-neutral-850 hover:text-neutral-100'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        c.status === 'Alive'
                          ? 'bg-emerald-500'
                          : c.status === 'Resurrected'
                          ? 'bg-cyan-400'
                          : 'bg-neutral-600'
                      }`}
                    />
                  </button>
                );
              })}
              {filteredCharacters.length === 0 && (
                <p className="text-[11px] text-neutral-500 italic px-2 py-1">No matches found</p>
              )}
            </div>
          )}
        </div>

        {/* Category: Noble Houses */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => toggleSection('houses')}
            className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-neutral-200"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-red-400" />
              <span>Great Houses ({filteredHouses.length})</span>
            </span>
            {openSections.houses ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {openSections.houses && (
            <div className="space-y-0.5 pl-2 border-l border-neutral-800/80 ml-2">
              {filteredHouses.map((h) => {
                const hSlug = getDocSlug(h);
                const isActive = currentType === 'house' && currentSlug === hSlug;
                return (
                  <button
                    key={h._id}
                    type="button"
                    onClick={() => onNavigate('house', hSlug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs truncate flex items-center justify-between group transition-colors ${
                      isActive
                        ? 'bg-red-950/50 text-red-200 border-l-2 border-red-400 font-medium'
                        : 'text-neutral-300 hover:bg-neutral-850 hover:text-neutral-100'
                    }`}
                  >
                    <span className="truncate">{h.name}</span>
                    <span className="text-[10px] text-neutral-500 italic truncate max-w-[80px]">
                      {h.region}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Category: Locations */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => toggleSection('locations')}
            className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-neutral-200"
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Realms & Seats ({filteredLocations.length})</span>
            </span>
            {openSections.locations ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {openSections.locations && (
            <div className="space-y-0.5 pl-2 border-l border-neutral-800/80 ml-2">
              {filteredLocations.map((l) => {
                const lSlug = getDocSlug(l);
                const isActive = currentType === 'location' && currentSlug === lSlug;
                return (
                  <button
                    key={l._id}
                    type="button"
                    onClick={() => onNavigate('location', lSlug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs truncate transition-colors ${
                      isActive
                        ? 'bg-emerald-950/50 text-emerald-200 border-l-2 border-emerald-400 font-medium'
                        : 'text-neutral-300 hover:bg-neutral-850 hover:text-neutral-100'
                    }`}
                  >
                    {l.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Category: Events */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => toggleSection('events')}
            className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-neutral-200"
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Chronicles & Wars ({filteredEvents.length})</span>
            </span>
            {openSections.events ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {openSections.events && (
            <div className="space-y-0.5 pl-2 border-l border-neutral-800/80 ml-2">
              {filteredEvents.map((e) => {
                const eSlug = getDocSlug(e);
                const isActive = currentType === 'event' && currentSlug === eSlug;
                return (
                  <button
                    key={e._id}
                    type="button"
                    onClick={() => onNavigate('event', eSlug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs truncate transition-colors ${
                      isActive
                        ? 'bg-blue-950/50 text-blue-200 border-l-2 border-blue-400 font-medium'
                        : 'text-neutral-300 hover:bg-neutral-850 hover:text-neutral-100'
                    }`}
                  >
                    {e.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Tools: Architecture & Schemas Inspector */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-950 space-y-2">
        <button
          type="button"
          id="btn-inspect-architecture"
          onClick={onOpenCodeInspector}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-700/80 text-neutral-200 hover:text-amber-300 text-xs font-medium transition-all group"
        >
          <span className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>Architecture & Schemas</span>
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 font-mono">
            Next + Sanity
          </span>
        </button>
      </div>
    </aside>
  );
};
