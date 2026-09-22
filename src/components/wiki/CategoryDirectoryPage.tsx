import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Shield,
  MapPin,
  Calendar,
  BookOpen,
  Sparkles,
  Flame,
  ChevronRight,
  Compass,
  Scroll,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Check,
} from 'lucide-react';
import {
  getAllHouses,
  getAllLocations,
  getAllEvents,
  getAllCultures,
  getAllMagic,
  getAllSpecies,
  getAllBooks,
  saveWikiDocument,
  deleteWikiDocument,
  getDocSlug,
} from '../../data/mockSanityData';
import { HoverCardLink } from './HoverCardLink';
import { WikiDocType } from '../../types/wiki';
import { WikiFooter } from './WikiFooter';

interface CategoryDirectoryPageProps {
  categorySlug: string; // e.g. 'places', 'houses', 'history', 'culture', 'magic-artifacts', 'species-creatures', 'books'
  onNavigate: (route: string, type?: string, slug?: string) => void;
}

const ALPHABET = [
  'All',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];

interface DirectoryCardItem {
  _id: string;
  _type: WikiDocType;
  name: string;
  slug: string;
  image?: string;
  quickSummary: string;
  badge?: string;
  secondary?: string;
  tag?: string;
  rawDoc?: any;
}

export const CategoryDirectoryPage: React.FC<CategoryDirectoryPageProps> = ({
  categorySlug,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [activeFilter, setActiveFilter] = useState('All');
  const [syncVersion, setSyncVersion] = useState(0);

  // Add/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalName, setModalName] = useState('');
  const [modalSlug, setModalSlug] = useState('');
  const [modalSecondary, setModalSecondary] = useState('');
  const [modalImage, setModalImage] = useState('');
  const [modalSummary, setModalSummary] = useState('');
  const [modalDetails, setModalDetails] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Sync when any document is added, edited, or deleted
  useEffect(() => {
    const handleUpdate = () => setSyncVersion((v) => v + 1);
    window.addEventListener('citadel-wiki-updated', handleUpdate);
    return () => window.removeEventListener('citadel-wiki-updated', handleUpdate);
  }, []);

  // Determine items and metadata dynamically based on categorySlug and syncVersion
  const categoryMeta = useMemo(() => {
    switch (categorySlug) {
      case 'houses': {
        const houses = getAllHouses();
        return {
          title: 'Noble Houses & Dynasties',
          singular: 'House',
          docType: 'house' as WikiDocType,
          description:
            'The Great Houses and sworn bannermen of Westeros, their ancestral sigils, seats, and words of power.',
          icon: Shield,
          items: houses.map((h): DirectoryCardItem => ({
            _id: h._id,
            _type: 'house' as WikiDocType,
            name: h.name,
            slug: getDocSlug(h),
            image: h.sigil,
            quickSummary: h.quickSummary,
            badge: h.seat?.name || h.region || 'Great House',
            secondary: h.motto ? `"${h.motto}"` : undefined,
            tag: h.region || 'Westeros',
            rawDoc: h,
          })),
          filterTags: ['All', 'The North', 'The Westerlands', 'The Reach', 'The Stormlands', 'The Riverlands', 'The Crownlands'],
        };
      }
      case 'places':
      case 'locations': {
        const places = getAllLocations();
        return {
          title: 'Castles, Cities & Realms',
          singular: 'Place',
          docType: 'location' as WikiDocType,
          description:
            'Ancient granite fortresses, bustling port cities, ruins of Old Valyria, and geographical landmarks.',
          icon: MapPin,
          items: places.map((l): DirectoryCardItem => ({
            _id: l._id,
            _type: 'location' as WikiDocType,
            name: l.name,
            slug: getDocSlug(l),
            image: l.mapImage || (l as any).image,
            quickSummary: l.quickSummary,
            badge: l.region,
            secondary: l.locationType || l.region,
            tag: l.region,
            rawDoc: l,
          })),
          filterTags: ['All', 'The North', 'The Crownlands', 'The Reach', 'The Riverlands', 'Essos', 'Dorne'],
        };
      }
      case 'history':
      case 'events': {
        const events = getAllEvents();
        return {
          title: 'Historical Eras & Wars',
          singular: 'Event',
          docType: 'event' as WikiDocType,
          description:
            'Twelve millennia of recorded history: legendary rebellions, cataclysmic dooms, and pivotal tourneys.',
          icon: Calendar,
          items: events.map((e): DirectoryCardItem => ({
            _id: e._id,
            _type: 'event' as WikiDocType,
            name: e.name,
            slug: getDocSlug(e),
            image: e.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
            quickSummary: e.quickSummary,
            badge: e.date,
            secondary: e.outcome,
            tag: e.date.includes('AC') ? 'Targaryen Era' : 'Ancient Era',
            rawDoc: e,
          })),
          filterTags: ['All', 'Targaryen Era', 'Ancient Era'],
        };
      }
      case 'culture':
      case 'cultures': {
        const cultures = getAllCultures();
        return {
          title: 'Cultures, Peoples & Faiths',
          singular: 'Culture',
          docType: 'culture' as WikiDocType,
          description:
            'Customs, heritage, religious faiths, and sacred laws handed down across millennia.',
          icon: Scroll,
          items: cultures.map((c): DirectoryCardItem => ({
            _id: c._id,
            _type: 'culture' as WikiDocType,
            name: c.name,
            slug: getDocSlug(c),
            image: c.image,
            quickSummary: c.quickSummary,
            badge: c.religion,
            secondary: c.region,
            tag: c.region,
            rawDoc: c,
          })),
          filterTags: ['All', 'Westeros', 'Essos', 'Valyria'],
        };
      }
      case 'magic-artifacts':
      case 'magic': {
        const magic = getAllMagic();
        return {
          title: 'Magic, Relics & Artifacts',
          singular: 'Relic / Spell',
          docType: 'magic' as WikiDocType,
          description:
            'Valyrian steel blades, dragon-bonding rituals, green dreams, and shadow-binding sorceries.',
          icon: Sparkles,
          items: magic.map((m): DirectoryCardItem => ({
            _id: m._id,
            _type: 'magic' as WikiDocType,
            name: m.name,
            slug: getDocSlug(m),
            image: m.image,
            quickSummary: m.quickSummary,
            badge: m.dangerLevel,
            secondary: m.origin,
            tag: m.dangerLevel,
            rawDoc: m,
          })),
          filterTags: ['All', 'Potent', 'Cataclysmic', 'Subtle'],
        };
      }
      case 'species-creatures':
      case 'species': {
        const species = getAllSpecies();
        return {
          title: 'Mythic Species & Bestiary',
          singular: 'Species',
          docType: 'species' as WikiDocType,
          description:
            'Living dragons of Valyria, direwolves of the frozen North, and ancient denizens Beyond the Wall.',
          icon: Flame,
          items: species.map((s): DirectoryCardItem => ({
            _id: s._id,
            _type: 'species' as WikiDocType,
            name: s.name,
            slug: getDocSlug(s),
            image: s.image,
            quickSummary: s.quickSummary,
            badge: s.status,
            secondary: s.habitat,
            tag: s.status,
            rawDoc: s,
          })),
          filterTags: ['All', 'Endangered / Rare', 'Legendary / Mythical', 'Rare'],
        };
      }
      case 'books':
      case 'book':
      default: {
        const books = getAllBooks();
        return {
          title: 'Canonical Tomes & Chronicles',
          singular: 'Book',
          docType: 'book' as WikiDocType,
          description:
            'The core novels of A Song of Ice and Fire, novellas, companion volumes, and historical annals.',
          icon: BookOpen,
          items: books.map((b): DirectoryCardItem => ({
            _id: b._id,
            _type: 'book' as WikiDocType,
            name: b.title || b.name || 'Untitled Tome',
            slug: getDocSlug(b),
            image: b.coverImage,
            quickSummary: b.quickSummary,
            badge: `${b.publicationYear} (${b.pageCount} pp.)`,
            secondary: `Volume #${b.releaseOrder}`,
            tag: 'Canonical Novel',
            rawDoc: b,
          })),
          filterTags: ['All', 'Canonical Novel'],
        };
      }
    }
  }, [categorySlug, syncVersion]);

  const Icon = categoryMeta.icon;

  // Filter items
  const filteredItems = useMemo(() => {
    return categoryMeta.items
      .filter((item) => {
        // Tag filter
        const matchesTag =
          activeFilter === 'All' ||
          item.tag?.toLowerCase().includes(activeFilter.toLowerCase()) ||
          item.badge?.toLowerCase().includes(activeFilter.toLowerCase());

        // Search query
        const itemName = item.name || '';
        const matchesSearch =
          !searchQuery.trim() ||
          itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.quickSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.secondary && item.secondary.toLowerCase().includes(searchQuery.toLowerCase()));

        // Letter filter
        const matchesLetter =
          selectedLetter === 'All' ||
          itemName.trim().toUpperCase().startsWith(selectedLetter);

        return matchesTag && matchesSearch && matchesLetter;
      })
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [categoryMeta, activeFilter, searchQuery, selectedLetter]);

  // Open modal for new entry
  const handleOpenAdd = () => {
    setEditingId(null);
    setModalName('');
    setModalSlug('');
    setModalSecondary('');
    setModalImage('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80');
    setModalSummary('');
    setModalDetails('');
    setIsModalOpen(true);
  };

  // Open modal for editing existing entry
  const handleOpenEdit = (item: DirectoryCardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(item._id);
    setModalName(item.name);
    setModalSlug(item.slug);
    setModalSecondary(item.secondary || item.badge || '');
    setModalImage(item.image || '');
    setModalSummary(item.quickSummary || '');

    // Extract text from raw document
    const raw = item.rawDoc;
    if (raw) {
      const blocks = raw.biography || raw.details || raw.history || raw.description || raw.synopsis || raw.traditions || raw.rulesAndArtifacts;
      if (Array.isArray(blocks)) {
        const text = blocks
          .map((b: any) => (Array.isArray(b.children) ? b.children.map((c: any) => c.text).join('') : b.text || ''))
          .filter(Boolean)
          .join('\n\n');
        setModalDetails(text || item.quickSummary);
      } else {
        setModalDetails(item.quickSummary);
      }
    } else {
      setModalDetails(item.quickSummary);
    }
    setIsModalOpen(true);
  };

  // Delete entry
  const handleDeleteItem = (item: DirectoryCardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${item.name}" from ${categoryMeta.title}?`)) {
      deleteWikiDocument(item._id);
      setToastMsg(`Deleted "${item.name}" successfully.`);
      setTimeout(() => setToastMsg(''), 3500);
    }
  };

  // Save entry from modal
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim()) return;

    const slugVal = modalSlug.trim() || modalName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const docId = editingId || `${categoryMeta.docType}-${slugVal}`;

    const textBlocks = (modalDetails.trim() || modalSummary.trim())
      .split('\n\n')
      .filter((p) => p.trim())
      .map((p, idx) => ({
        _type: 'block',
        _key: `p-${idx}-${Date.now()}`,
        style: 'normal',
        children: [{ _key: `c-${idx}`, _type: 'span', text: p.trim() }],
      }));

    const newDoc: any = {
      _id: docId,
      _type: categoryMeta.docType,
      name: modalName.trim(),
      slug: { current: slugVal },
      image: modalImage.trim() || undefined,
      quickSummary: modalSummary.trim() || undefined,
      description: textBlocks,
    };

    if (categoryMeta.docType === 'location') {
      newDoc.region = modalSecondary.trim() || 'Westeros';
      newDoc.locationType = 'Castle / Settlement';
      newDoc.mapImage = modalImage.trim() || undefined;
      newDoc.details = textBlocks;
    } else if (categoryMeta.docType === 'house') {
      newDoc.motto = modalSecondary.trim() || undefined;
      newDoc.sigil = modalImage.trim() || undefined;
      newDoc.history = textBlocks;
    } else if (categoryMeta.docType === 'event') {
      newDoc.date = modalSecondary.trim() || 'Historic Era';
      newDoc.outcome = modalSummary.trim();
      newDoc.history = textBlocks;
    } else if (categoryMeta.docType === 'culture') {
      newDoc.region = modalSecondary.trim() || 'Westeros';
      newDoc.religion = modalSecondary.trim() || 'Ancient Faith';
      newDoc.traditions = textBlocks;
    } else if (categoryMeta.docType === 'magic') {
      newDoc.dangerLevel = modalSecondary.trim() || 'Potent';
      newDoc.origin = 'Ancient Traditions';
      newDoc.rulesAndArtifacts = textBlocks;
    } else if (categoryMeta.docType === 'species') {
      newDoc.status = modalSecondary.trim() || 'Endangered / Rare';
      newDoc.habitat = 'Westeros / Essos';
    } else if (categoryMeta.docType === 'book') {
      newDoc.title = modalName.trim();
      newDoc.releaseOrder = 1;
      newDoc.coverImage = modalImage.trim() || undefined;
      newDoc.publicationYear = 1996;
      newDoc.pageCount = 600;
    }

    saveWikiDocument(newDoc);
    setIsModalOpen(false);
    setToastMsg(`Saved "${modalName}" successfully!`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans">
      {/* Category Compact Hero Header */}
      <section className="relative overflow-hidden bg-neutral-900 border-b border-neutral-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-950/70 border border-amber-600/40 p-3 flex items-center justify-center shrink-0 shadow-lg shadow-amber-950/40">
              <Icon className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-500 tracking-wider mb-1">
                <span>winds of life's wiki</span>
                <span>•</span>
                <span>{categoryMeta.items.length} Archival Records</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-title text-neutral-100 tracking-wide">
                {categoryMeta.title}
              </h1>
              <p className="mt-2 text-sm text-neutral-400 max-w-2xl leading-relaxed">
                {categoryMeta.description}
              </p>
            </div>
          </div>

          {/* Quick Search & Add Action */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-64 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${categoryMeta.title.toLowerCase()}...`}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add {categoryMeta.singular}</span>
            </button>
          </div>
        </div>

        {/* Filter Tags */}
        {categoryMeta.filterTags.length > 1 && (
          <div className="max-w-7xl mx-auto mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-neutral-800/80">
            <span className="text-[11px] font-mono text-neutral-400 uppercase mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3 text-amber-400" />
              <span>Filter:</span>
            </span>
            {categoryMeta.filterTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeFilter === tag
                    ? 'bg-amber-600 text-neutral-950 font-bold shadow-sm'
                    : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-750'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-700/80 text-emerald-300 text-xs flex items-center gap-2 shadow-lg">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Alphabetical Fast Bar */}
      <div className="bg-neutral-925/80 border-b border-neutral-850 px-4 sm:px-6 lg:px-8 py-2.5 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs font-mono text-neutral-400 mr-2 uppercase tracking-wider">
              Index:
            </span>
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`w-7 h-7 rounded-md font-mono text-xs transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
                  selectedLetter === letter
                    ? 'bg-amber-600 text-neutral-950 font-black shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-850'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
          <span className="text-[11px] font-mono text-neutral-500 shrink-0">
            Showing {filteredItems.length} entries
          </span>
        </div>
      </div>

      {/* Main Grid View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-neutral-900/60 rounded-2xl border border-neutral-800">
            <p className="text-sm text-neutral-400">No records match your current filter.</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLetter('All');
                  setActiveFilter('All');
                }}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs font-semibold hover:bg-neutral-750 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 rounded-lg bg-amber-600/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-600/30 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First {categoryMeta.singular}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                onClick={() => onNavigate('wiki', categoryMeta.docType, item.slug)}
                className="group relative bg-neutral-900 rounded-2xl border border-neutral-800 hover:border-amber-500/60 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-950/20 hover:-translate-y-1 flex flex-col cursor-pointer"
              >
                {/* Image Header with Aspect Ratio */}
                <div className="relative h-44 w-full overflow-hidden bg-neutral-950">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                    {item.badge ? (
                      <span className="px-2.5 py-1 rounded-full bg-neutral-950/80 border border-neutral-700/80 text-[10px] font-mono text-amber-300 backdrop-blur-sm">
                        {item.badge}
                      </span>
                    ) : <span />}

                    {/* Quick Edit/Delete Controls */}
                    <div className="flex items-center gap-1 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleOpenEdit(item, e)}
                        title="Edit Entry"
                        className="p-1.5 rounded-lg bg-neutral-950/80 hover:bg-amber-950/80 text-neutral-300 hover:text-amber-300 border border-neutral-700/80 backdrop-blur-sm transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteItem(item, e)}
                        title="Delete Entry"
                        className="p-1.5 rounded-lg bg-neutral-950/80 hover:bg-red-950/80 text-neutral-300 hover:text-red-300 border border-neutral-700/80 backdrop-blur-sm transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <HoverCardLink
                        data={{
                          _id: item._id,
                          _type: categoryMeta.docType,
                          name: item.name,
                          slug: item.slug,
                          image: item.image,
                          quickSummary: item.quickSummary,
                        }}
                        onNavigate={onNavigate}
                      >
                        <h3 className="text-lg font-bold font-serif-title text-neutral-100 group-hover:text-amber-300 transition-colors">
                          {item.name}
                        </h3>
                      </HoverCardLink>
                    </div>

                    {item.secondary && (
                      <p className="mt-1 text-xs text-amber-400/90 font-mono italic">
                        {item.secondary}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                      {item.quickSummary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 group-hover:text-amber-400 transition-colors">
                    <span className="font-mono text-[11px] uppercase tracking-wider">
                      Read Codex Article
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add / Edit Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-925">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold font-serif-title text-neutral-100">
                  {editingId ? `Edit ${modalName || categoryMeta.singular}` : `Add New ${categoryMeta.singular}`}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {categoryMeta.singular} Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalName}
                    onChange={(e) => {
                      setModalName(e.target.value);
                      if (!editingId) {
                        setModalSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    placeholder={`e.g. ${categoryMeta.singular === 'Place' ? 'Highgarden' : 'House Dayne'}`}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={modalSlug}
                    onChange={(e) => setModalSlug(e.target.value)}
                    placeholder="e.g. highgarden"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {categoryMeta.docType === 'location' ? 'Region / Location' : categoryMeta.docType === 'house' ? 'Motto / Seat' : 'Secondary Badge'}
                  </label>
                  <input
                    type="text"
                    value={modalSecondary}
                    onChange={(e) => setModalSecondary(e.target.value)}
                    placeholder="e.g. The Reach / The North"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={modalImage}
                    onChange={(e) => setModalImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Quick Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={modalSummary}
                  onChange={(e) => setModalSummary(e.target.value)}
                  placeholder="A concise 1-2 sentence overview shown on preview cards and search..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Full Lore & History (Separate paragraphs with double Enter)
                </label>
                <textarea
                  rows={4}
                  value={modalDetails}
                  onChange={(e) => setModalDetails(e.target.value)}
                  placeholder="Detailed chronicled history, traditions, notable figures, and events..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-950/40 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingId ? 'Update & Save' : 'Add to Wiki'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <WikiFooter onNavigate={onNavigate} />
    </div>
  );
};
export default CategoryDirectoryPage;
