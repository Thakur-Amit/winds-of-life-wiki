import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Flame,
  Shield,
  BookOpen,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight,
  GitFork,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import {
  mockMainCategories,
  allWikiDocuments,
  getAllCharacters,
  getAllHouses,
  getAllLocations,
  getAllEvents,
  getAllCultures,
  getAllMagic,
  getAllSpecies,
  getAllBooks,
  getDocSlug,
} from '../../data/mockSanityData';
import { getWorldTimeline, TimelineEvent } from '../../data/timelineData';
import { WikiFooter } from './WikiFooter';

interface LandingPageProps {
  onNavigate: (route: string, type?: string, slug?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [searchResults, setSearchResults] = useState<typeof allWikiDocuments>([]);
  const [showResults, setShowResults] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [syncVersion, setSyncVersion] = useState(0);

  // Load and listen to central timeline store and wiki updates
  useEffect(() => {
    const loadTimeline = () => {
      setTimelineEvents(getWorldTimeline());
    };
    loadTimeline();

    const handleTimelineUpdate = () => loadTimeline();
    const handleWikiUpdate = () => setSyncVersion((v) => v + 1);

    window.addEventListener('droplet-spire-timeline-updated', handleTimelineUpdate);
    window.addEventListener('droplet-spire-wiki-updated', handleWikiUpdate);

    return () => {
      window.removeEventListener('droplet-spire-timeline-updated', handleTimelineUpdate);
      window.removeEventListener('droplet-spire-wiki-updated', handleWikiUpdate);
    };
  }, []);

  const handleHeroSearchChange = (val: string) => {
    setHeroSearch(val);
    if (!val.trim()) {
      setShowResults(false);
      setSearchResults([]);
      return;
    }
    const q = val.toLowerCase();
    const results = allWikiDocuments.filter((doc) => {
      const docTitle = doc.name || ('title' in doc ? (doc as any).title : '') || '';
      return (
        docTitle.toLowerCase().includes(q) ||
        ('titles' in doc && doc.titles?.some((t: string) => t.toLowerCase().includes(q))) ||
        ('motto' in doc && doc.motto?.toLowerCase().includes(q))
      );
    });
    setSearchResults(results.slice(0, 6));
    setShowResults(true);
  };

  const handleCategoryClick = (catSlug: string) => {
    if (catSlug === 'characters') {
      onNavigate('characters');
    } else {
      onNavigate('category', catSlug);
    }
  };

  // Exact real document counts for each category dynamically calculated
  const getCategoryRealCount = (slug: string): string => {
    switch (slug) {
      case 'characters':
        return `${getAllCharacters().length} Characters`;
      case 'houses':
        return `${getAllHouses().length} Noble Houses`;
      case 'places':
      case 'locations':
        return `${getAllLocations().length} Strongholds & Places`;
      case 'history':
      case 'events':
        return `${getAllEvents().length} Historical Wars`;
      case 'culture':
      case 'cultures':
        return `${getAllCultures().length} Civilizations & Faiths`;
      case 'magic':
      case 'magic-artifacts':
        return `${getAllMagic().length} Arcane Relics`;
      case 'species':
      case 'species-creatures':
        return `${getAllSpecies().length} Bestiary & Races`;
      case 'books':
      case 'book':
        return `${getAllBooks().length} Canon Tomes`;
      default:
        return '0 Records';
    }
  };

  // Prominent epoch highlights directly from central timeline store
  const displayEpochs = useMemo(() => {
    return timelineEvents.slice(0, 5);
  }, [timelineEvents]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans">
      {/* 1. HERO SECTION: Full Screen Height, Cleaned up, No extra clutter */}
      <section className="relative w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center overflow-hidden border-b border-neutral-850">
        {/* Background atmospheric image stretching full screen */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80"
            alt="Winds of Life Realm"
            className="w-full h-full object-cover object-center filter brightness-[0.3] contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.1)_0%,transparent_70%)]" />
        </div>

        {/* Hero Content: Pure, High-Impact & De-cluttered */}
        <div className="relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center justify-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-serif-title text-neutral-100 tracking-wider leading-tight drop-shadow-md">
            WINDS OF LIFE
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto font-sans leading-relaxed">
            The definitive lore encyclopedia of Antos, Eclind, noble lineages, ancestral fortresses, and chronicles of the Known World.
          </p>

          {/* Central Search Bar */}
          <div className="mt-8 w-full max-w-2xl mx-auto relative text-left">
            <div className="relative shadow-2xl rounded-2xl overflow-hidden bg-neutral-900/95 border border-neutral-800 focus-within:border-amber-500/80 focus-within:ring-2 focus-within:ring-amber-500/30 transition-all">
              <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => handleHeroSearchChange(e.target.value)}
                placeholder="Search characters, houses, castles, wars (e.g. Jon Snow, Winterfell)..."
                className="w-full bg-transparent pl-12 pr-4 py-3.5 text-sm sm:text-base text-neutral-100 placeholder-neutral-500 focus:outline-none"
              />
            </div>

            {/* Instant Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-30">
                <div className="p-2.5 bg-neutral-950 border-b border-neutral-800 text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex justify-between">
                  <span>Archival Entries ({searchResults.length})</span>
                  <span>Select to view</span>
                </div>
                {searchResults.map((doc) => {
                  const docImg =
                    ('image' in doc && doc.image) ||
                    ('sigil' in doc && doc.sigil) ||
                    ('mapImage' in doc && doc.mapImage) ||
                    '';
                  return (
                    <button
                      key={doc._id}
                      onClick={() => onNavigate('wiki', doc._type, getDocSlug(doc))}
                      className="w-full p-3 text-left hover:bg-neutral-800/80 border-b border-neutral-800/50 flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-neutral-800 overflow-hidden shrink-0 border border-neutral-700">
                          {docImg ? (
                            <img
                              src={docImg}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-neutral-200 group-hover:text-amber-300 transition-colors font-serif">
                            {doc.name}
                          </h4>
                          <p className="text-[11px] text-neutral-400 truncate max-w-md">
                            {doc.quickSummary || ('motto' in doc && doc.motto) || ''}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-800 text-amber-400 border border-neutral-700 shrink-0">
                        {doc._type}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 2. MAIN CATEGORIES GRID (Accurate Real Document Counts) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-800 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              Archival Directories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-neutral-100 tracking-wide mt-1">
              Explore the Seven Kingdoms & Beyond
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Browse the eight primary compendiums of winds of life's wiki with verified real-time database counts.
            </p>
          </div>
          <button
            onClick={() => onNavigate('characters')}
            className="flex items-center gap-1 text-xs font-semibold text-neutral-300 hover:text-white transition-colors self-start md:self-auto font-mono cursor-pointer"
          >
            <span>Characters Compendium</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 8-Card Responsive Grid with EXACT real counts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mockMainCategories.map((category) => {
            const realCountText = getCategoryRealCount(category.slug);

            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-neutral-800/80 hover:border-amber-500/70 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-950/30 hover:-translate-y-1 bg-neutral-900"
              >
                {/* Dark Image Background */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-[0.5] contrast-125"
                />

                {/* Gradient Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
                <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-amber-950/10 transition-colors" />

                {/* Top Badge: EXACT REAL DOCUMENT COUNT */}
                <div className="absolute top-3.5 right-3.5 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-neutral-950/90 border border-neutral-700/80 text-[10px] font-mono text-neutral-200 tracking-wider font-semibold shadow-md">
                    {realCountText}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10 text-left">
                  <h3 className="text-xl font-extrabold font-serif-title text-neutral-100 group-hover:text-amber-300 transition-colors tracking-wide">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-300/80 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] font-mono text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Enter Compendium</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. WORLD LORE & SYNCHRONIZED TIMELINE SECTION */}
      <section className="w-full bg-neutral-925/80 border-y border-neutral-850 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Col: Historical Lore Overview */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Winds of Life Lore Records
              </span>
              <h2 className="text-3xl font-black font-serif-title text-neutral-100 tracking-wide">
                The Fabric of Antos & The Known World
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                The history of the Known World spans over twelve millennia, from the mythic Dawn Age when the mysterious Children of the Forest carved weeping faces into sacred weirwood trees, to the cataclysmic Long Night and Aegon's unification of the realm.
              </p>
              <div className="space-y-3.5 text-xs text-neutral-400 leading-relaxed">
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <h4 className="text-sm font-bold font-serif text-amber-300 mb-1">
                    The Seven Kingdoms
                  </h4>
                  <p>
                    Forged under the dragon Balerion the Black Dread, the realm comprises the North, Vale, Riverlands, Iron Islands, Westerlands, Reach, Stormlands, and Dorne.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <h4 className="text-sm font-bold font-serif text-amber-300 mb-1">
                    The droplet-spire of Oldtown
                  </h4>
                  <p>
                    Seated along the Whispering Sound, the droplet-spire houses the Order of Maesters who measure seasons, preserve raven networks, and chronicle human history.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Col: Timeline Highlights SOURCED DIRECTLY FROM CENTRAL TIMELINE STORE */}
            <div className="lg:col-span-5 bg-neutral-900/90 rounded-2xl border border-neutral-800 p-6 space-y-4 text-left shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-sm font-bold font-serif-title uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Grand World Timeline</span>
                </h3>
                <button
                  onClick={() => onNavigate('timeline')}
                  className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Full View</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <ul className="space-y-3.5 text-xs">
                {displayEpochs.map((epoch) => (
                  <li
                    key={epoch.id}
                    onClick={() => onNavigate('wiki', 'event', epoch.id.replace(/^tl-/, ''))}
                    className="flex items-start gap-3 group cursor-pointer hover:bg-neutral-850/60 p-1.5 rounded-lg transition-colors"
                  >
                    <span className="font-mono text-amber-400 font-bold shrink-0 text-[11px] px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800">
                      {epoch.year}
                    </span>
                    <div>
                      <strong className="text-neutral-200 font-serif mr-1 group-hover:text-amber-300 transition-colors">
                        {epoch.title}:
                      </strong>
                      <span className="text-neutral-400 line-clamp-2 leading-relaxed">
                        {epoch.description}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-neutral-800/80">
                <button
                  onClick={() => onNavigate('timeline')}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Explore & Edit All Historical Eras →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <WikiFooter onNavigate={onNavigate} />
    </div>
  );
};
export default LandingPage;
