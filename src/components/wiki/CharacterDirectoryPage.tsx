import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Users,
  Shield,
  Crown,
  ChevronRight,
  X,
  Sparkles,
  LayoutGrid,
  List,
  Heart,
  Skull,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';
import {
  mockCharacters,
  mockProfessions,
  mockHouses,
  getDocSlug,
} from '../../data/mockSanityData';
import { CharacterDoc } from '../../types/wiki';
import { WikiFooter } from './WikiFooter';

interface CharacterDirectoryPageProps {
  onNavigate: (route: string, type?: string, slug?: string) => void;
}

const ALPHABET = [
  'All',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];

export const CharacterDirectoryPage: React.FC<CharacterDirectoryPageProps> = ({ onNavigate }) => {
  const [directorySearch, setDirectorySearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');
  const [selectedHouseFilter, setSelectedHouseFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedProfessionSlug, setSelectedProfessionSlug] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'ledger'>('cards');

  // Compute character counts per letter for the alphabet bar
  const letterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    mockCharacters.forEach((c) => {
      const firstChar = c.name.trim()[0]?.toUpperCase() || '';
      if (firstChar) {
        counts[firstChar] = (counts[firstChar] || 0) + 1;
      }
    });
    return counts;
  }, []);

  // Filter characters
  const filteredCharacters = useMemo(() => {
    return mockCharacters
      .filter((char) => {
        // Search Filter
        const q = directorySearch.toLowerCase().trim();
        const matchesSearch =
          !q ||
          char.name.toLowerCase().includes(q) ||
          char.titles?.some((t) => t.toLowerCase().includes(q)) ||
          char.aliases?.some((a) => a.toLowerCase().includes(q)) ||
          char.house?.name?.toLowerCase().includes(q);

        // Letter Filter
        const matchesLetter =
          selectedLetter === 'All' ||
          char.name.trim().toUpperCase().startsWith(selectedLetter);

        // House Filter
        const matchesHouse =
          selectedHouseFilter === 'All' ||
          (char.house && char.house.name.toLowerCase().includes(selectedHouseFilter.toLowerCase())) ||
          (char.allegiance && char.allegiance.toLowerCase().includes(selectedHouseFilter.toLowerCase()));

        // Status Filter
        const matchesStatus =
          selectedStatusFilter === 'All' ||
          char.status?.toLowerCase() === selectedStatusFilter.toLowerCase();

        // Profession Filter
        const matchesProfession =
          !selectedProfessionSlug ||
          char.professions?.some((p) => (p.slug?.current || (typeof p.slug === 'string' ? p.slug : (p as any)._id)) === selectedProfessionSlug);

        return matchesSearch && matchesLetter && matchesHouse && matchesStatus && matchesProfession;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [
    directorySearch,
    selectedLetter,
    selectedHouseFilter,
    selectedStatusFilter,
    selectedProfessionSlug,
  ]);

  // Group characters alphabetically by letter
  const groupedCharacters = useMemo(() => {
    const groups: { [key: string]: CharacterDoc[] } = {};
    filteredCharacters.forEach((char) => {
      const letter = char.name.trim()[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(char);
    });
    return groups;
  }, [filteredCharacters]);

  const activeProfession = mockProfessions.find((p) => (p.slug?.current || (typeof p.slug === 'string' ? p.slug : (p as any)._id)) === selectedProfessionSlug);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans">
      {/* 1. TOP BREADCRUMB & HEADER */}
      <div className="bg-neutral-925/80 border-b border-neutral-850 px-4 sm:px-6 lg:px-8 py-3 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-neutral-400 font-mono">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-amber-300 transition-colors"
            >
              Winds of Life
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-amber-400 font-semibold font-serif">
              Character Directory
            </span>
          </nav>
          <span className="text-neutral-500 font-mono text-[11px]">
            {filteredCharacters.length} of {mockCharacters.length} personages shown
          </span>
        </div>
      </div>

      {/* 2. DIRECTORY HERO SECTION */}
      <section className="bg-neutral-925 border-b border-neutral-850 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Archival Rolls of Westeros & Essos</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-serif-title text-neutral-100 tracking-wide">
              Alphabetical Character Directory
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1 leading-relaxed">
              Exhaustive biographical ledger of sovereign monarchs, legendary knights, high lords, shadows, and maesters documented across the Known World.
            </p>
          </div>

          {/* View Mode Toggle & Clear All Filter Button */}
          <div className="flex items-center gap-3">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-1 flex items-center gap-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-amber-600 text-neutral-950 font-bold shadow-md shadow-amber-950'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Dossier Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline font-mono">Dossier Cards</span>
              </button>
              <button
                onClick={() => setViewMode('ledger')}
                className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'ledger'
                    ? 'bg-amber-600 text-neutral-950 font-bold shadow-md shadow-amber-950'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Alphabetical Ledger View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline font-mono">Ledger Index</span>
              </button>
            </div>

            {(selectedLetter !== 'All' ||
              selectedHouseFilter !== 'All' ||
              selectedStatusFilter !== 'All' ||
              selectedProfessionSlug ||
              directorySearch) && (
              <button
                onClick={() => {
                  setSelectedLetter('All');
                  setSelectedHouseFilter('All');
                  setSelectedStatusFilter('All');
                  setSelectedProfessionSlug(null);
                  setDirectorySearch('');
                }}
                className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-amber-400 hover:text-amber-300 text-xs font-mono transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. COMPREHENSIVE FILTER CONSOLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 w-full">
        {/* Main Search & Dropdown Filters Bar */}
        <div className="bg-neutral-900/80 rounded-2xl border border-neutral-800 p-4 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                placeholder="Search personage, alias, or titles (e.g. Jon Snow, Little Bird)..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-8 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-sans"
              />
              {directorySearch && (
                <button
                  onClick={() => setDirectorySearch('')}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Allegiance & Status Filters */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {/* House Allegiance Filter */}
              <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs">
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-neutral-500 font-mono text-[11px]">House:</span>
                <select
                  value={selectedHouseFilter}
                  onChange={(e) => setSelectedHouseFilter(e.target.value)}
                  className="bg-transparent text-neutral-200 focus:outline-none cursor-pointer font-serif text-xs"
                >
                  <option value="All">All Houses</option>
                  <option value="Stark">House Stark</option>
                  <option value="Targaryen">House Targaryen</option>
                  <option value="Lannister">House Lannister</option>
                  <option value="Baratheon">House Baratheon</option>
                  <option value="Tully">House Tully</option>
                  <option value="Night's Watch">Night's Watch</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs">
                <Heart className="w-3.5 h-3.5 text-red-400" />
                <span className="text-neutral-500 font-mono text-[11px]">Status:</span>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-transparent text-neutral-200 focus:outline-none cursor-pointer font-mono text-xs"
                >
                  <option value="All">All Statuses</option>
                  <option value="Alive">Alive</option>
                  <option value="Deceased">Deceased</option>
                  <option value="Resurrected">Resurrected</option>
                </select>
              </div>
            </div>
          </div>

          {/* A-Z ALPHABET BAR WITH NUMERIC COUNTS */}
          <div className="pt-2 border-t border-neutral-800/80">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mr-1.5">
                Index:
              </span>
              {ALPHABET.map((letter) => {
                const isSelected = selectedLetter === letter;
                const count = letter === 'All' ? mockCharacters.length : letterCounts[letter] || 0;
                const isDisabled = letter !== 'All' && count === 0;

                return (
                  <button
                    key={letter}
                    disabled={isDisabled}
                    onClick={() => setSelectedLetter(letter)}
                    className={`min-w-8 h-8 px-2 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600 text-neutral-950 shadow-md shadow-amber-950 font-bold scale-105 ring-1 ring-amber-400'
                        : isDisabled
                        ? 'bg-neutral-950/40 text-neutral-600 border border-neutral-850 cursor-not-allowed opacity-40'
                        : 'bg-neutral-950 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                    }`}
                  >
                    <span>{letter}</span>
                    {letter !== 'All' && count > 0 && (
                      <span className={`text-[9px] font-normal opacity-70 ${isSelected ? 'text-neutral-950' : 'text-neutral-400'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHARACTER DISPLAY: CARDS VIEW OR LEDGER VIEW */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {filteredCharacters.length === 0 ? (
          <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 p-12 text-center">
            <Users className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-serif-title font-bold text-neutral-200">
              No Personages Found
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
              No archival rolls matched your search query or filters. Try resetting the filters or picking another letter.
            </p>
            <button
              onClick={() => {
                setSelectedLetter('All');
                setSelectedHouseFilter('All');
                setSelectedStatusFilter('All');
                setDirectorySearch('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-neutral-950 font-bold text-xs font-serif"
            >
              Show All Characters
            </button>
          </div>
        ) : viewMode === 'cards' ? (
          /* DOSSIER CARDS VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredCharacters.map((char) => {
              const isDeceased = char.status === 'Deceased';
              const isResurrected = char.status === 'Resurrected';
              const houseName = char.house?.name?.replace('House ', '') || char.allegiance || '';

              return (
                <div
                  key={char._id}
                  onClick={() => onNavigate('wiki', 'character', getDocSlug(char))}
                  className="group relative bg-neutral-900/80 rounded-2xl border border-neutral-800/80 hover:border-amber-500/70 shadow-lg hover:shadow-2xl hover:shadow-amber-950/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col text-left"
                >
                  {/* Portrait Banner Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-neutral-950">
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/40" />

                    {/* Status Pill Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <span
                        className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-md ${
                          isDeceased
                            ? 'bg-neutral-950/80 text-neutral-400 border-neutral-700'
                            : isResurrected
                            ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700'
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                        }`}
                      >
                        {char.status}
                      </span>
                    </div>

                    {/* House Crest / Name Tag */}
                    {houseName && (
                      <div className="absolute bottom-2.5 left-3 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-950/80 border border-neutral-800 text-[10px] text-amber-300 font-serif">
                        <Shield className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate max-w-[150px]">{houseName}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold font-serif-title text-neutral-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                        {char.name}
                      </h3>

                      {/* Primary Title / Alias */}
                      <p className="text-xs text-neutral-400 font-mono mt-0.5 truncate">
                        {char.titles && char.titles[0]
                          ? char.titles[0]
                          : char.aliases && char.aliases[0]
                          ? `"${char.aliases[0]}"`
                          : 'Noble Personage'}
                      </p>

                      {/* Quick Summary Abstract */}
                      <p className="text-[11px] text-neutral-300/80 mt-2 line-clamp-2 leading-relaxed">
                        {char.quickSummary}
                      </p>
                    </div>

                    {/* Card Footer: Born Year & Link Prompt */}
                    <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                      <span>{char.born ? char.born.split(',')[0] : 'Era: 300 AC'}</span>
                      <span className="text-amber-400 group-hover:underline flex items-center gap-0.5">
                        <span>Read Record</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* MAESTER'S ALPHABETICAL LEDGER VIEW */
          <div className="bg-neutral-900/70 rounded-2xl border border-neutral-800 p-6 sm:p-8 space-y-10 shadow-xl text-left">
            {Object.keys(groupedCharacters)
              .sort()
              .map((letter) => (
                <div key={letter} className="space-y-4">
                  {/* Alphabet Section Header Monogram */}
                  <div className="flex items-center gap-3 border-b border-neutral-800 pb-2">
                    <span className="w-9 h-9 rounded-xl bg-neutral-950 border-2 border-amber-600/50 text-amber-400 font-serif-title font-bold text-lg flex items-center justify-center shadow-md">
                      {letter}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      {groupedCharacters[letter].length} archived entries
                    </span>
                    <div className="flex-1 h-px bg-neutral-800/60" />
                  </div>

                  {/* 3-Column Detailed Entry Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {groupedCharacters[letter].map((char) => (
                      <button
                        key={char._id}
                        onClick={() => onNavigate('wiki', 'character', getDocSlug(char))}
                        className="p-2.5 rounded-xl bg-neutral-950/70 hover:bg-neutral-800/80 border border-neutral-800/80 hover:border-amber-500/60 transition-all flex items-center gap-3 text-left group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-neutral-700 bg-neutral-900">
                          <img
                            src={char.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold font-serif text-neutral-200 group-hover:text-amber-300 transition-colors truncate">
                              {char.name}
                            </h4>
                            <span className="text-[9px] font-mono text-neutral-500 shrink-0">
                              {char.status === 'Alive' ? '●' : '†'}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400 font-mono truncate">
                            {char.house?.name?.replace('House ', '') || char.allegiance || char.titles?.[0] || ''}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <WikiFooter onNavigate={onNavigate} />
    </div>
  );
};
