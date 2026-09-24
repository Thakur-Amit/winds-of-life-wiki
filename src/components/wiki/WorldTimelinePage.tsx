import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Shield,
  MapPin,
  ChevronRight,
  ArrowLeft,
  X,
  Check,
  Sparkles,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import {
  TimelineEvent,
  getWorldTimeline,
  saveWorldTimeline,
  addTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
  resetWorldTimeline,
} from '../../data/timelineData';
import { WikiFooter } from './WikiFooter';

interface WorldTimelinePageProps {
  onNavigate: (route: string, type?: string, slug?: string) => void;
}

export const WorldTimelinePage: React.FC<WorldTimelinePageProps> = ({ onNavigate }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  // Form State for Adding / Editing Event
  const [formYear, setFormYear] = useState('');
  const [formNumericYear, setFormNumericYear] = useState<number>(0);
  const [formEra, setFormEra] = useState<TimelineEvent['era']>('Rebellion & Modern');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formHouses, setFormHouses] = useState('');
  const [formCharacters, setFormCharacters] = useState('');
  const [formType, setFormType] = useState<TimelineEvent['type']>('War');

  const loadData = () => {
    setEvents(getWorldTimeline());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('droplet-spire-timeline-updated', handleUpdate);
    return () => window.removeEventListener('droplet-spire-timeline-updated', handleUpdate);
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesEra = selectedEra === 'All' || ev.era === selectedEra;
      const matchesType = selectedType === 'All' || ev.type === selectedType;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.year.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.location?.toLowerCase().includes(q) ||
        ev.houses?.some((h) => h.toLowerCase().includes(q)) ||
        ev.characters?.some((c) => c.toLowerCase().includes(q));

      return matchesEra && matchesType && matchesSearch;
    });
  }, [events, selectedEra, selectedType, searchQuery]);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormYear('300 AC');
    setFormNumericYear(300);
    setFormEra('Rebellion & Modern');
    setFormTitle('');
    setFormDescription('');
    setFormLocation('King\'s Landing');
    setFormHouses('House Stark, House Lannister');
    setFormCharacters('Jon Snow, Daenerys Targaryen');
    setFormType('War');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (ev: TimelineEvent) => {
    setEditingEvent(ev);
    setFormYear(ev.year);
    setFormNumericYear(ev.numericYear);
    setFormEra(ev.era);
    setFormTitle(ev.title);
    setFormDescription(ev.description);
    setFormLocation(ev.location || '');
    setFormHouses(ev.houses ? ev.houses.join(', ') : '');
    setFormCharacters(ev.characters ? ev.characters.join(', ') : '');
    setFormType(ev.type);
    setIsEditorOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formYear.trim()) return;

    const housesArray = formHouses
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const charsArray = formCharacters
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingEvent) {
      updateTimelineEvent(editingEvent.id, {
        year: formYear,
        numericYear: Number(formNumericYear) || 0,
        era: formEra,
        title: formTitle,
        description: formDescription,
        location: formLocation,
        houses: housesArray,
        characters: charsArray,
        type: formType,
      });
    } else {
      addTimelineEvent({
        year: formYear,
        numericYear: Number(formNumericYear) || 0,
        era: formEra,
        title: formTitle,
        description: formDescription,
        location: formLocation,
        houses: housesArray,
        characters: charsArray,
        type: formType,
        isCanon: false,
      });
    }

    setIsEditorOpen(false);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this event from the droplet-spire Chronicle?')) {
      deleteTimelineEvent(id);
      loadData();
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset the entire timeline to the canonical droplet-spire records?')) {
      resetWorldTimeline();
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans">
      {/* 1. BREADCRUMB & HEADER */}
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
              Universal World Timeline
            </span>
          </nav>

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Codex</span>
          </button>
        </div>
      </div>

      {/* 2. TIMELINE HERO BANNER */}
      <section className="bg-neutral-925 border-b border-neutral-850 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>droplet-spire Chronology of the Known World</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-serif-title text-neutral-100 tracking-wide">
              The Grand Chronicle & World Timeline
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1 leading-relaxed">
              From the mythic Dawn Age twelve thousand years before Aegon's Conquest, through the Dance of the Dragons and the War of the Five Kings. Fully synchronized with all archival records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all cursor-pointer font-serif"
            >
              <Plus className="w-4 h-4" />
              <span>Add Chronicle Event</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset Timeline to droplet-spire Canon"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Canon</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. FILTERS & SEARCH BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
          {/* Era Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mr-1">
              Era:
            </span>
            {(['All', 'Dawn & Ancient', 'Valyrian & Targaryen', 'Rebellion & Modern'] as const).map(
              (era) => (
                <button
                  key={era}
                  onClick={() => setSelectedEra(era)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    selectedEra === era
                      ? 'bg-amber-600 text-neutral-950 font-bold shadow-md shadow-amber-950'
                      : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                  }`}
                >
                  {era}
                </button>
              )
            )}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search year, war, house, or character..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-8 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-neutral-500 hover:text-neutral-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. CHRONOLOGICAL VERTICAL TIMELINE */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800/80 p-8">
            <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
            <p className="text-neutral-400 text-sm">No historical events match your current filter.</p>
            <button
              onClick={() => {
                setSelectedEra('All');
                setSelectedType('All');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-amber-400 hover:underline font-mono"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="relative border-l-2 border-neutral-800 ml-4 sm:ml-32 space-y-10 py-4">
            {filteredEvents.map((ev, idx) => {
              const typeColor =
                ev.type === 'War'
                  ? 'bg-red-950/80 text-red-300 border-red-800/60'
                  : ev.type === 'Cataclysm'
                  ? 'bg-purple-950/80 text-purple-300 border-purple-800/60'
                  : ev.type === 'Treaty'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                  : ev.type === 'Dynasty'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                  : 'bg-blue-950/80 text-blue-300 border-blue-800/60';

              return (
                <div key={ev.id} className="relative pl-6 sm:pl-8 group">
                  {/* Spine Node Dot */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-neutral-950 border-2 border-amber-500 group-hover:scale-125 group-hover:border-amber-400 transition-all duration-300 shadow-md shadow-amber-950" />

                  {/* Left Column Year Badge (on Desktop) */}
                  <div className="sm:absolute sm:-left-36 sm:top-1 sm:w-28 sm:text-right font-mono text-xs font-bold text-amber-400">
                    <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                      {ev.year}
                    </span>
                  </div>

                  {/* Event Card Content */}
                  <div
                    onMouseEnter={() => setHoveredEventId(ev.id)}
                    onMouseLeave={() => setHoveredEventId(null)}
                    className="bg-neutral-900/90 rounded-2xl border border-neutral-800/80 p-5 sm:p-6 shadow-xl hover:border-amber-500/60 transition-all duration-300"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${typeColor}`}>
                          {ev.type}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">
                          {ev.era}
                        </span>
                        {ev.location && (
                          <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-mono">
                            <MapPin className="w-3 h-3 text-neutral-500" />
                            {ev.location}
                          </span>
                        )}
                      </div>

                      {/* Action buttons (Edit & Delete) */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(ev);
                          }}
                          className="p-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-amber-300 transition-colors cursor-pointer"
                          title="Edit chronicle event"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(ev.id);
                          }}
                          className="p-1.5 rounded-lg bg-neutral-950 hover:bg-red-950/60 border border-neutral-800 hover:border-red-800/60 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete chronicle event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Interactive Event Name (Clickable to open Main Page) */}
                    <div
                      onClick={() => onNavigate('wiki', 'event', ev.id.replace(/^tl-/, ''))}
                      className="cursor-pointer group/title flex items-center justify-between gap-3 pt-1"
                    >
                      <h3 className="text-lg sm:text-xl font-bold font-serif-title text-neutral-100 group-hover/title:text-amber-300 transition-colors tracking-wide flex items-center gap-2">
                        <span>{ev.title}</span>
                        <ChevronRight className="w-4 h-4 text-amber-400 opacity-60 group-hover/title:opacity-100 group-hover/title:translate-x-1 transition-all" />
                      </h3>

                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-amber-400/90 group-hover/title:text-amber-300 shrink-0">
                        <span>Open Event Page</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>

                    {/* Hover Hint for Desktop */}
                    <div className="sm:hidden mt-1 text-[10px] font-mono text-neutral-500">
                      Tap title to open full article page
                    </div>

                    {/* Event Details: Revealed on Hover or always visible on mobile */}
                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        hoveredEventId === ev.id
                          ? 'mt-3 max-h-96 opacity-100'
                          : 'max-h-0 sm:max-h-0 opacity-0 sm:opacity-0 sm:pointer-events-none mt-0'
                      }`}
                    >
                      <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-850 mt-2 space-y-3">
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                          {ev.description}
                        </p>

                        {/* Associated Houses & Key Figures */}
                        <div className="pt-2 border-t border-neutral-850 flex flex-wrap items-center gap-4 text-xs">
                          {ev.houses && ev.houses.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="text-neutral-500 font-mono text-[10px]">Houses:</span>
                              {ev.houses.map((h) => (
                                <span
                                  key={h}
                                  className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 font-serif"
                                >
                                  {h}
                                </span>
                              ))}
                            </div>
                          )}

                          {ev.characters && ev.characters.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <BookOpen className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              <span className="text-neutral-500 font-mono text-[10px]">Personages:</span>
                              {ev.characters.map((c) => (
                                <span
                                  key={c}
                                  className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 font-serif"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={() => onNavigate('wiki', 'event', ev.id.replace(/^tl-/, ''))}
                            className="ml-auto px-3 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>Read Codex Record</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 5. ADD / EDIT EVENT MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <h3 className="text-lg font-bold font-serif-title text-neutral-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>{editingEvent ? 'Edit Chronicle Event' : 'Add New Chronicle Event'}</span>
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-left text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-mono mb-1">Year Label *</label>
                  <input
                    type="text"
                    required
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    placeholder="e.g. 282 AC or 8,000 BC"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-mono mb-1">Numeric Year (Sort) *</label>
                  <input
                    type="number"
                    required
                    value={formNumericYear}
                    onChange={(e) => setFormNumericYear(Number(e.target.value))}
                    placeholder="e.g. 282 (BC is negative: -8000)"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-mono mb-1">Era Category</label>
                  <select
                    value={formEra}
                    onChange={(e) => setFormEra(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 font-mono focus:outline-none focus:border-amber-500"
                  >
                    <option value="Dawn & Ancient">Dawn & Ancient</option>
                    <option value="Valyrian & Targaryen">Valyrian & Targaryen</option>
                    <option value="Rebellion & Modern">Rebellion & Modern</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 font-mono mb-1">Event Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 font-mono focus:outline-none focus:border-amber-500"
                  >
                    <option value="War">War / Battle</option>
                    <option value="Treaty">Treaty / Pact</option>
                    <option value="Dynasty">Dynasty / Reign</option>
                    <option value="Cataclysm">Cataclysm / Disaster</option>
                    <option value="Discovery">Discovery / Arcana</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-mono mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Robert's Rebellion (War of the Usurper)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 font-serif focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-mono mb-1">Location / Theater</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. The Trident, King's Landing"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-mono mb-1">Historical Account / Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Comprehensive chronicle description of causes, key clashes, and aftermath..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 leading-relaxed focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-mono mb-1">Houses (comma separated)</label>
                  <input
                    type="text"
                    value={formHouses}
                    onChange={(e) => setFormHouses(e.target.value)}
                    placeholder="House Stark, House Baratheon"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-mono mb-1">Key Personages (comma separated)</label>
                  <input
                    type="text"
                    value={formCharacters}
                    onChange={(e) => setFormCharacters(e.target.value)}
                    placeholder="Eddard Stark, Robert Baratheon"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold transition-all flex items-center gap-1.5 shadow-md shadow-amber-950 font-serif"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingEvent ? 'Save Changes' : 'Publish to Chronicle'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <WikiFooter onNavigate={onNavigate} />
    </div>
  );
};
