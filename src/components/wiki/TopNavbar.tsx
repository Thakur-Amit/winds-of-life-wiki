import React, { useState, useRef, useEffect } from 'react';
import {
  Flame,
  Search,
  Users,
  Shield,
  MapPin,
  Calendar,
  GitFork,
  Settings,
  X,
  Menu,
} from 'lucide-react';
import { allWikiDocuments, getDocSlug } from '../../data/mockSanityData';
import { WikiDoc } from '../../types/wiki';

interface TopNavbarProps {
  currentRoute: string; // 'home' | 'characters' | 'category' | 'wiki' | 'family-tree' | 'timeline' | 'admin'
  onNavigate: (route: string, type?: string, slug?: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ currentRoute, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered documents for the search box
  const searchResults = searchQuery.trim()
    ? allWikiDocuments.filter((doc) => {
        const q = searchQuery.toLowerCase();
        const docName = doc.name || ('title' in doc ? (doc as any).title : '') || '';
        return (
          docName.toLowerCase().includes(q) ||
          ('titles' in doc && doc.titles?.some((t: string) => t.toLowerCase().includes(q))) ||
          ('aliases' in doc && doc.aliases?.some((a: string) => a.toLowerCase().includes(q))) ||
          ('motto' in doc && doc.motto?.toLowerCase().includes(q)) ||
          ('region' in doc && doc.region?.toLowerCase().includes(q))
        );
      }).slice(0, 8)
    : [];

  const handleSelectDoc = (doc: WikiDoc) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    onNavigate('wiki', doc._type, getDocSlug(doc));
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-neutral-950/75 backdrop-blur-md border-b border-neutral-700/60 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 shrink-0 group text-left cursor-pointer focus:outline-none"
            aria-label="Winds of Life Home"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center group-hover:border-neutral-500 transition-colors text-[20px] font-bold">
              <Flame className="w-4 h-4 text-neutral-300 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-[20px] font-bold tracking-wider text-neutral-100 font-serif-title uppercase group-hover:text-white transition-colors">
                Winds of Life
              </span>
              <span className="text-[9px] text-neutral-500 font-mono tracking-widest uppercase -mt-0.5 hidden sm:inline">
                winds of life's wiki
              </span>
            </div>
          </button>

          {/* Center Search Bar with Subtle Neutral Colors */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-xs md:max-w-md hidden sm:block">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search characters, houses, battles..."
                className="w-full bg-neutral-900/80 border border-neutral-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 focus:bg-neutral-900 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2 text-neutral-500 hover:text-neutral-300"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Instant Search Dropdown */}
            {isSearchOpen && searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                <div className="p-2 border-b border-neutral-800 bg-neutral-950 text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex justify-between">
                  <span>Archival Matches ({searchResults.length})</span>
                  <span>Select to View</span>
                </div>
                {searchResults.length > 0 ? (
                  searchResults.map((doc) => {
                    const docImg =
                      ('image' in doc && doc.image) ||
                      ('sigil' in doc && doc.sigil) ||
                      ('mapImage' in doc && doc.mapImage) ||
                      '';
                    return (
                      <button
                        key={doc._id}
                        onClick={() => handleSelectDoc(doc)}
                        className="w-full p-2.5 text-left flex items-center justify-between hover:bg-neutral-800/80 border-b border-neutral-800/50 last:border-b-0 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded bg-neutral-800 overflow-hidden shrink-0 border border-neutral-700">
                            {docImg ? (
                              <img
                                src={docImg}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-bold">
                                {(doc.name || ('title' in doc ? (doc as any).title : 'C') || 'C')[0]}
                              </div>
                            )}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-medium text-neutral-200 group-hover:text-white transition-colors font-serif">
                              {doc.name || ('title' in doc ? (doc as any).title : '')}
                            </p>
                            <p className="text-[10px] text-neutral-400 truncate">
                              {('quickSummary' in doc && doc.quickSummary) || ('motto' in doc && doc.motto) || ''}
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-400 shrink-0 ml-2 border border-neutral-800">
                          {doc._type}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-neutral-400 italic">
                    No codex records matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Refined, Low-Color Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentRoute === 'home'
                  ? 'bg-neutral-850 text-neutral-100 border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('characters')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                currentRoute === 'characters'
                  ? 'bg-neutral-850 text-neutral-100 border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              <span>Characters</span>
            </button>

            <button
              onClick={() => onNavigate('category', 'houses')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                currentRoute === 'category' && (window.location.hash.includes('houses') || window.location.hash === 'houses')
                  ? 'bg-neutral-850 text-neutral-100 border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-neutral-400" />
              <span>Houses</span>
            </button>

            <button
              onClick={() => onNavigate('category', 'places')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                currentRoute === 'category' && (window.location.hash.includes('places') || window.location.hash === 'places')
                  ? 'bg-neutral-850 text-neutral-100 border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>Places</span>
            </button>

            <button
              onClick={() => onNavigate('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                currentRoute === 'timeline'
                  ? 'bg-neutral-850 text-neutral-100 border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>Timeline</span>
            </button>

            <button
              onClick={() => onNavigate('family-tree')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                currentRoute === 'family-tree'
                  ? 'bg-neutral-850 text-neutral-100 border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-neutral-400" />
              <span>Family Trees</span>
            </button>

            {/* Subtle /admin link */}
            <button
              onClick={() => onNavigate('admin')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ml-1 border ${
                currentRoute === 'admin'
                  ? 'bg-neutral-800 text-neutral-200 border-neutral-600'
                  : 'text-neutral-500 hover:text-neutral-300 border-neutral-800 hover:border-neutral-700'
              }`}
              title="Sanity Studio CMS Admin"
            >
              /admin
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Neutral, Low-Color) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-850 bg-neutral-950 px-4 pt-3 pb-5 space-y-1">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-neutral-900"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('characters');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-neutral-900 flex items-center gap-2"
          >
            <Users className="w-3.5 h-3.5 text-neutral-400" />
            <span>Characters Directory</span>
          </button>
          <button
            onClick={() => {
              onNavigate('category', 'houses');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-neutral-900 flex items-center gap-2"
          >
            <Shield className="w-3.5 h-3.5 text-neutral-400" />
            <span>Great Houses</span>
          </button>
          <button
            onClick={() => {
              onNavigate('category', 'places');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-neutral-900 flex items-center gap-2"
          >
            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
            <span>Places & Castles</span>
          </button>
          <button
            onClick={() => {
              onNavigate('timeline');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-neutral-900 flex items-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>World Timeline</span>
          </button>
          <button
            onClick={() => {
              onNavigate('family-tree');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-neutral-900 flex items-center gap-2"
          >
            <GitFork className="w-3.5 h-3.5 text-neutral-400" />
            <span>Family Trees</span>
          </button>
          <button
            onClick={() => {
              onNavigate('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-mono text-neutral-400 hover:bg-neutral-900 flex items-center gap-2 border-t border-neutral-850 pt-2"
          >
            <Settings className="w-3.5 h-3.5 text-neutral-400" />
            <span>Sanity CMS Admin Studio</span>
          </button>
        </div>
      )}
    </header>
  );
};
