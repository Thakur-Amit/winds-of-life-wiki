import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Shield,
  MapPin,
  Scroll,
  Calendar,
  Sparkles,
  Flame,
  BookOpen,
  Briefcase,
  Plus,
  Check,
  Search,
  ExternalLink,
  Eye,
  Link as LinkIcon,
  Save,
  Image as ImageIcon,
  HelpCircle,
  FileText,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import {
  getAllCharacters,
  getAllHouses,
  getAllLocations,
  getAllEvents,
  getAllCultures,
  getAllMagic,
  getAllSpecies,
  getAllBooks,
  getAllProfessions,
  saveWikiDocument,
  deleteWikiDocument,
} from '../../data/mockSanityData';
import { HoverCardLink } from './HoverCardLink';
import { WikiDocType, CharacterStatus, CharacterSection } from '../../types/wiki';

interface SanityDocumentStudioProps {
  onNavigate: (route: string, type?: string, slug?: string) => void;
}

type StudioDocType =
  | 'character'
  | 'house'
  | 'place'
  | 'culture'
  | 'event'
  | 'magic'
  | 'species'
  | 'book'
  | 'profession';

const saveSelectedImageToRepo = async (file: File): Promise<string> => {
  const fileName = file.name || `upload-${Date.now()}`;

  try {
    if ('showSaveFilePicker' in window) {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: 'Image Files',
            accept: {
              'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
            },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(file);
      await writable.close();
      return fileName;
    }
  } catch (error) {
    console.info('File save dialog cancelled or unsupported:', error);
  }

  const reader = new FileReader();
  const dataUrl = await new Promise<string>((resolve) => {
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(file);
  });

  return dataUrl || fileName;
};

export const SanityDocumentStudio: React.FC<SanityDocumentStudioProps> = ({ onNavigate }) => {
  const [selectedType, setSelectedType] = useState<StudioDocType>('character');
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string | null>('char-jon-snow');
  const [syncVersion, setSyncVersion] = useState(0);

  // Form State for active editing
  const [docName, setDocName] = useState('Jon Snow');
  const [docSlug, setDocSlug] = useState('jon-snow');
  const [docImage, setDocImage] = useState('https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=600&auto=format&fit=crop&q=80');
  const [quickSummary, setQuickSummary] = useState(
    'Lord Commander of the Night\'s Watch and crowned King in the North, secretly Aegon Targaryen.'
  );
  
  // Specific fields
  const [charStatus, setCharStatus] = useState<CharacterStatus>('Alive');
  const [charHouseRef, setCharHouseRef] = useState('house-stark');
  const [charLocationRef, setCharLocationRef] = useState('loc-winterfell');
  const [charTitles, setCharTitles] = useState('');
  const [charAliases, setCharAliases] = useState('');
  const [charBorn, setCharBorn] = useState('');
  const [charDied, setCharDied] = useState('');
  const [charCulture, setCharCulture] = useState('');
  const [charAllegiance, setCharAllegiance] = useState('');
  const [charFatherRef, setCharFatherRef] = useState('');
  const [charMotherRef, setCharMotherRef] = useState('');
  const [charSpouseRef, setCharSpouseRef] = useState('');
  const [charFatherName, setCharFatherName] = useState('');
  const [charMotherName, setCharMotherName] = useState('');
  const [charSpouseName, setCharSpouseName] = useState('');
  const [charChildrenNames, setCharChildrenNames] = useState('');
  const [houseMotto, setHouseMotto] = useState('Winter is Coming');
  const [placeRegion, setPlaceRegion] = useState('');
  const [placeType, setPlaceType] = useState('');
  const [eventDate, setEventDate] = useState('298 AC');
  const [magicDanger, setMagicDanger] = useState('Potent');
  const [bookReleaseOrder, setBookReleaseOrder] = useState('1');

  const [characterSections, setCharacterSections] = useState<CharacterSection[]>([
    { title: 'Appearance and Character', content: 'Tall, lean, and watchful, with a grim expression shaped by duty and loss.\n\nSteadfast, loyal, and fiercely protective of the people he cares for.' },
    { title: 'History', content: 'Raised at Winterfell as the acknowledged bastard of Eddard Stark, he joined the Night\'s Watch at the ancient Wall.' },
    { title: 'Recent Events', content: 'After the long winter and the war against the dead, he returned to lead the North and protect the realm from dark forces.' },
  ]);

  // Portable Text body blocks
  const [paragraphs, setParagraphs] = useState<string[]>([
    'Raised at Winterfell as the acknowledged bastard of Eddard Stark, he joined the brotherhood of the Night\'s Watch at the ancient Wall.',
    'During his ranging Beyond the Wall, he infiltrated the wildling host under Mance Rayder and defended Castle Black against immense odds.',
  ]);

  // Listen to wiki updates to refresh document lists instantly
  useEffect(() => {
    const handleUpdate = () => setSyncVersion((v) => v + 1);
    window.addEventListener('droplet-spire-wiki-updated', handleUpdate);
    return () => window.removeEventListener('droplet-spire-wiki-updated', handleUpdate);
  }, []);

  // Live collections based on syncVersion
  const charactersList = useMemo(() => getAllCharacters(), [syncVersion]);
  const housesList = useMemo(() => getAllHouses(), [syncVersion]);
  const placesList = useMemo(() => getAllLocations(), [syncVersion]);
  const culturesList = useMemo(() => getAllCultures(), [syncVersion]);
  const eventsList = useMemo(() => getAllEvents(), [syncVersion]);
  const magicList = useMemo(() => getAllMagic(), [syncVersion]);
  const speciesList = useMemo(() => getAllSpecies(), [syncVersion]);
  const booksList = useMemo(() => getAllBooks(), [syncVersion]);
  const professionsList = useMemo(() => getAllProfessions(), [syncVersion]);

  const TYPE_CONFIGS = useMemo(() => [
    { type: 'character' as StudioDocType, label: 'Characters', icon: Users, color: 'text-amber-400', count: charactersList.length },
    { type: 'house' as StudioDocType, label: 'Noble Houses', icon: Shield, color: 'text-red-400', count: housesList.length },
    { type: 'place' as StudioDocType, label: 'Places & Castles', icon: MapPin, color: 'text-emerald-400', count: placesList.length },
    { type: 'culture' as StudioDocType, label: 'Cultures & Faiths', icon: Scroll, color: 'text-purple-400', count: culturesList.length },
    { type: 'event' as StudioDocType, label: 'History & Events', icon: Calendar, color: 'text-blue-400', count: eventsList.length },
    { type: 'magic' as StudioDocType, label: 'Magic & Artifacts', icon: Sparkles, color: 'text-pink-400', count: magicList.length },
    { type: 'species' as StudioDocType, label: 'Species & Beasts', icon: Flame, color: 'text-orange-400', count: speciesList.length },
    { type: 'book' as StudioDocType, label: 'Canonical Books', icon: BookOpen, color: 'text-yellow-400', count: booksList.length },
    { type: 'profession' as StudioDocType, label: 'Professions', icon: Briefcase, color: 'text-cyan-400', count: professionsList.length },
  ], [charactersList, housesList, placesList, culturesList, eventsList, magicList, speciesList, booksList, professionsList]);

  // Handle selecting a document from list
  const handleSelectExisting = (doc: any) => {
    setIsCreatingNew(false);
    setSelectedDocId(doc._id);
    setDocName(doc.name || doc.title || '');
    setDocSlug(doc.slug?.current || '');
    setDocImage(doc.image || doc.sigil || doc.mapImage || doc.coverImage || '');
    setQuickSummary(doc.quickSummary || '');
    if (doc.status) setCharStatus(doc.status);
    setCharTitles(Array.isArray(doc.titles) ? doc.titles.join(', ') : '');
    setCharAliases(Array.isArray(doc.aliases) ? doc.aliases.join(', ') : '');
    setCharBorn(doc.born || '');
    setCharDied(doc.died || '');
    setCharCulture(doc.culture || '');
    setCharAllegiance(doc.allegiance || '');
    setCharFatherRef(doc.father?._id || '');
    setCharMotherRef(doc.mother?._id || '');
    setCharSpouseRef(doc.spouse?._id || '');
    setCharFatherName(doc.father?.name || '');
    setCharMotherName(doc.mother?.name || '');
    setCharSpouseName(doc.spouse?.name || '');
    setCharChildrenNames(Array.isArray(doc.children) ? doc.children.map((child: any) => child.name).join(', ') : '');
    if (doc.motto) setHouseMotto(doc.motto);
    if (doc.region) setPlaceRegion(doc.region);
    if (doc.locationType) setPlaceType(doc.locationType);
    if (doc.date) setEventDate(doc.date);
    if (doc.dangerLevel) setMagicDanger(doc.dangerLevel);
    if (doc.releaseOrder) setBookReleaseOrder(String(doc.releaseOrder));

    if (doc._type === 'character') {
      const sections = Array.isArray(doc.sections) && doc.sections.length > 0
        ? doc.sections
        : [
            { title: 'Appearance and Character', content: [doc.appearance, doc.character].filter(Boolean).join('\n\n') },
            { title: 'History', content: doc.history || '' },
            { title: 'Recent Events', content: doc.recentEvents || '' },
          ].filter((section) => section.content && section.content.trim());
      setCharacterSections(sections.length > 0 ? sections : [
        { title: 'Appearance and Character', content: '' },
        { title: 'History', content: '' },
        { title: 'Recent Events', content: '' },
      ]);
    }

    // Extract text from portable text blocks if present
    const blocks = doc.biography || doc.details || doc.history || doc.description || doc.synopsis || doc.traditions || doc.rulesAndArtifacts;
    if (Array.isArray(blocks)) {
      const texts = blocks
        .map((b: any) => (Array.isArray(b.children) ? b.children.map((c: any) => c.text).join('') : b.text || ''))
        .filter(Boolean);
      if (texts.length > 0) {
        setParagraphs(texts);
      } else {
        setParagraphs(['']);
      }
    } else {
      setParagraphs([doc.quickSummary || '']);
    }
  };

  const handleStartNew = () => {
    setIsCreatingNew(true);
    setSelectedDocId(null);
    setDocName('');
    setDocSlug('');
    setDocImage('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80');
    setQuickSummary('');
    setCharTitles('');
    setCharAliases('');
    setCharBorn('');
    setCharDied('');
    setCharCulture('');
    setCharAllegiance('');
    setCharFatherRef('');
    setCharMotherRef('');
    setCharSpouseRef('');
    setCharFatherName('');
    setCharMotherName('');
    setCharSpouseName('');
    setCharChildrenNames('');
    setHouseMotto('');
    setPlaceRegion('');
    setPlaceType('');
    setCharacterSections([
      { title: 'Appearance and Character', content: '' },
      { title: 'History', content: '' },
      { title: 'Recent Events', content: '' },
    ]);
    setParagraphs(['']);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const slugToUse = docSlug.trim() || docName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const docId = selectedDocId || `${selectedType === 'place' ? 'location' : selectedType}-${slugToUse}`;

    const textBlocks = paragraphs
      .filter((p) => p.trim())
      .map((p, idx) => ({
        _type: 'block',
        _key: `p-${idx}-${Date.now()}`,
        style: 'normal',
        children: [{ _key: `c-${idx}`, _type: 'span', text: p.trim() }],
      }));

    const newDoc: any = {
      _id: docId,
      _type: selectedType === 'place' ? 'location' : selectedType,
      name: docName.trim(),
      slug: { current: slugToUse },
      image: docImage.trim() || undefined,
      quickSummary: quickSummary.trim() || undefined,
      description: textBlocks,
    };

    if (selectedType === 'character') {
      const validSections = characterSections
        .filter((section) => section.title.trim() && section.content.trim())
        .map((section) => ({
          _key: `section-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
          title: section.title.trim(),
          content: section.content.trim(),
        }));

      const appearanceSection = validSections.find((section) => section.title.toLowerCase() === 'appearance and character');
      const historySection = validSections.find((section) => section.title.toLowerCase() === 'history');
      const recentEventsSection = validSections.find((section) => section.title.toLowerCase() === 'recent events');

      newDoc.status = charStatus;
      newDoc.titles = charTitles.split(',').map((value) => value.trim()).filter(Boolean);
      newDoc.aliases = charAliases.split(',').map((value) => value.trim()).filter(Boolean);
      newDoc.born = charBorn.trim() || undefined;
      newDoc.died = charDied.trim() || undefined;
      newDoc.culture = charCulture.trim() || undefined;
      newDoc.allegiance = charAllegiance.trim() || undefined;
      newDoc.house = { _ref: charHouseRef };
      newDoc.location = { _ref: charLocationRef };
      newDoc.father = charFatherRef ? { _ref: charFatherRef } : undefined;
      newDoc.mother = charMotherRef ? { _ref: charMotherRef } : undefined;
      newDoc.spouse = charSpouseRef ? { _ref: charSpouseRef } : undefined;
      const makeCharacterRelation = (name: string, ref: string) => {
        const cleanName = name.trim();
        if (!cleanName) return undefined;
        const matched = charactersList.find((character) => character._id === ref || character.name.toLowerCase() === cleanName.toLowerCase());
        return matched
          ? { _id: matched._id, _type: 'character', name: matched.name, slug: matched.slug }
          : { _id: `custom-character-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, _type: 'character', name: cleanName, slug: { current: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-') } };
      };
      newDoc.father = makeCharacterRelation(charFatherName, charFatherRef);
      newDoc.mother = makeCharacterRelation(charMotherName, charMotherRef);
      newDoc.spouse = makeCharacterRelation(charSpouseName, charSpouseRef);
      newDoc.children = charChildrenNames
        .split(',')
        .map((name) => makeCharacterRelation(name, ''))
        .filter(Boolean);
      newDoc.appearance = appearanceSection?.content || '';
      newDoc.character = appearanceSection?.content || '';
      newDoc.history = historySection?.content || '';
      newDoc.recentEvents = recentEventsSection?.content || '';
      newDoc.sections = validSections;
      newDoc.biography = textBlocks;
    } else if (selectedType === 'house') {
      newDoc.motto = houseMotto;
      newDoc.sigil = docImage;
      newDoc.history = textBlocks;
    } else if (selectedType === 'place') {
      newDoc.region = placeRegion.trim();
      newDoc.locationType = placeType;
      newDoc.mapImage = docImage;
      newDoc.details = textBlocks;
    } else if (selectedType === 'event') {
      newDoc.date = eventDate;
      newDoc.history = textBlocks;
    } else if (selectedType === 'magic') {
      newDoc.dangerLevel = magicDanger;
      newDoc.rulesAndArtifacts = textBlocks;
    } else if (selectedType === 'species') {
      newDoc.habitat = placeRegion || 'Antos';
      newDoc.status = 'Endangered / Rare';
    } else if (selectedType === 'book') {
      newDoc.title = docName.trim();
      newDoc.releaseOrder = Number(bookReleaseOrder) || 1;
      newDoc.coverImage = docImage;
      newDoc.publicationYear = 1996;
      newDoc.pageCount = 694;
    }

    saveWikiDocument(newDoc);
    setSelectedDocId(docId);
    setIsCreatingNew(false);
    setSuccessToast(`Document "${docName}" successfully saved to Winds of Life wiki!`);
    setTimeout(() => setSuccessToast(''), 4500);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the wiki?`)) {
      deleteWikiDocument(id);
      setSuccessToast(`Document "${name}" deleted.`);
      setTimeout(() => setSuccessToast(''), 3000);
      handleStartNew();
    }
  };

  // Get current document list based on selected type
  const currentDocs = useMemo(() => {
    switch (selectedType) {
      case 'character':
        return charactersList;
      case 'house':
        return housesList;
      case 'place':
        return placesList;
      case 'culture':
        return culturesList;
      case 'event':
        return eventsList;
      case 'magic':
        return magicList;
      case 'species':
        return speciesList;
      case 'book':
        return booksList;
      case 'profession':
        return professionsList;
      default:
        return charactersList;
    }
  }, [selectedType, charactersList, housesList, placesList, culturesList, eventsList, magicList, speciesList, booksList, professionsList]);

  const filteredDocs = useMemo(() => {
    if (!searchDocQuery.trim()) return currentDocs;
    const q = searchDocQuery.toLowerCase();
    return currentDocs.filter((d: any) => {
      const title = d.name || d.title || '';
      return title.toLowerCase().includes(q) || (d.quickSummary && d.quickSummary.toLowerCase().includes(q));
    });
  }, [currentDocs, searchDocQuery]);

  const CurrentTypeConfig = TYPE_CONFIGS.find((c) => c.type === selectedType) || TYPE_CONFIGS[0];
  const TypeIcon = CurrentTypeConfig.icon;

  return (
    <div className="space-y-6">
      {/* Studio Banner & Non-Coder Notice */}
      <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono uppercase tracking-wider">
              Visual Document Editor
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Live Schema Validation & Interlinking
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif-title text-neutral-100 mt-1">
            Non-Coder Worldbuilding CMS Desk
          </h2>
          <p className="text-xs text-neutral-400 max-w-2xl mt-0.5">
            Create and edit any worldbuilding element visually. Every document instantly validates
            slugs, handles internal link annotations, and generates interactive hover preview cards.
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New {CurrentTypeConfig.label.slice(0, -1)}</span>
        </button>
      </div>

      {/* 9 Content Type Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800 text-xs">
        {TYPE_CONFIGS.map((cfg) => {
          const Icon = cfg.icon;
          const isSelected = selectedType === cfg.type;
          return (
            <button
              key={cfg.type}
              onClick={() => {
                setSelectedType(cfg.type);
                setIsCreatingNew(false);
                setSearchDocQuery('');
              }}
              className={`px-3.5 py-2 rounded-xl font-medium flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-600/60 shadow-md'
                  : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border border-neutral-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
              <span>{cfg.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-neutral-950/80 border border-neutral-800 text-neutral-400">
                {cfg.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2 shadow-xl animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Two-Column Studio Layout: Left Document Browser, Right Visual Document Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Document List (4 cols) */}
        <div className="lg:col-span-4 bg-neutral-900/90 rounded-2xl border border-neutral-800 p-4 shadow-xl flex flex-col space-y-3 max-h-[750px] overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <TypeIcon className={`w-4 h-4 ${CurrentTypeConfig.color}`} />
              <span className="text-xs font-bold font-serif-title text-neutral-200">
                {CurrentTypeConfig.label} ({filteredDocs.length})
              </span>
            </div>
            <button
              onClick={handleStartNew}
              className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>

          {/* Filter search in list */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchDocQuery}
              onChange={(e) => setSearchDocQuery(e.target.value)}
              placeholder={`Filter ${selectedType}s...`}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Document list items */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredDocs.map((doc: any) => {
              const name = doc.name || doc.title;
              const img = doc.image || doc.sigil || doc.mapImage || doc.coverImage;
              const isCurrent = docSlug === doc.slug?.current;
              return (
                <div
                  key={doc._id}
                  onClick={() => handleSelectExisting(doc)}
                  className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-amber-950/40 border-amber-500/70 shadow-sm'
                      : 'bg-neutral-950/60 hover:bg-neutral-800/60 border-neutral-850'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={img}
                      alt={name}
                      className="w-10 h-10 rounded-lg object-cover bg-neutral-900 shrink-0 border border-neutral-800"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-200 truncate">{name}</p>
                      <p className="text-[10px] text-neutral-500 font-mono truncate">
                        {doc.slug?.current}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc._id, name);
                    }}
                    title="Delete record"
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-950/80 text-neutral-500 hover:text-red-400 transition-all shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual Non-Coder Editor & Live Hover Preview (8 cols) */}
        <div className="lg:col-span-8 bg-neutral-900/90 rounded-2xl border border-neutral-800 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500">
                {isCreatingNew ? 'Drafting New Document' : 'Editing Existing Document'}
              </span>
              <h3 className="text-lg font-bold font-serif-title text-neutral-100">
                {docName || `Untitled ${CurrentTypeConfig.label.slice(0, -1)}`}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('wiki', selectedType, docSlug)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 flex items-center gap-1.5 transition-colors"
                title="Preview public wiki article"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>View Public Article</span>
              </button>
            </div>
          </div>

          <form onSubmit={handlePublish} className="space-y-5 text-xs">
            {/* Row 1: Name & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-300 font-medium mb-1 flex items-center justify-between">
                  <span>Name / Title *</span>
                  <span className="text-[10px] text-neutral-500 font-mono">schema: string</span>
                </label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => {
                    setDocName(e.target.value);
                    if (isCreatingNew) {
                      setDocSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Winterfell, House Stark, Valyrian Steel"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1 flex items-center justify-between">
                  <span>URL Slug *</span>
                  <span className="text-[10px] text-neutral-500 font-mono">schema: slug</span>
                </label>
                <input
                  type="text"
                  required
                  value={docSlug}
                  onChange={(e) => setDocSlug(e.target.value)}
                  placeholder="e.g. winterfell"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono text-xs placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Row 2: Image URL + Thumbnail Preview */}
            <div>
              <label className="block text-neutral-300 font-medium mb-1 flex items-center justify-between">
                <span>Featured Image / Sigil / Map</span>
                <span className="text-[10px] text-neutral-500 font-mono">schema: image</span>
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="url"
                  value={docImage}
                  onChange={(e) => setDocImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono text-xs placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-200 cursor-pointer hover:border-amber-500">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;

                      const savedValue = await saveSelectedImageToRepo(file);
                      setDocImage(savedValue || file.name);
                      event.target.value = '';
                    }}
                  />
                </label>
                <img
                  src={docImage}
                  alt="Preview"
                  className="w-10 h-10 rounded-lg object-cover bg-neutral-950 border border-neutral-700 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
            </div>

            {/* Row 3: Quick Summary (Hover Card text with counter) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-neutral-300 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quick Summary (Displayed on Hover Cards) *</span>
                </label>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    quickSummary.length > 280
                      ? 'bg-red-950 text-red-400'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {quickSummary.length} / 280 chars
                </span>
              </div>
              <textarea
                rows={2}
                required
                value={quickSummary}
                onChange={(e) => setQuickSummary(e.target.value)}
                placeholder="Crisp 1-2 sentence definition for hover cards and search snippets..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {selectedType === 'character' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Titles</label>
                  <input
                    type="text"
                    value={charTitles}
                    onChange={(e) => setCharTitles(e.target.value)}
                    placeholder="e.g. King in the North, Lord Commander"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 placeholder-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Aliases</label>
                  <input
                    type="text"
                    value={charAliases}
                    onChange={(e) => setCharAliases(e.target.value)}
                    placeholder="e.g. The White Wolf, Lord Snow"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 placeholder-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Born</label>
                  <input
                    type="text"
                    value={charBorn}
                    onChange={(e) => setCharBorn(e.target.value)}
                    placeholder="e.g. 283 AC, Tower of Joy"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 placeholder-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Died</label>
                  <input
                    type="text"
                    value={charDied}
                    onChange={(e) => setCharDied(e.target.value)}
                    placeholder="Leave blank if living"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 placeholder-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Culture</label>
                  <input
                    type="text"
                    value={charCulture}
                    onChange={(e) => setCharCulture(e.target.value)}
                    placeholder="e.g. Northmen / Valyrian"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 placeholder-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Allegiance</label>
                  <input
                    type="text"
                    value={charAllegiance}
                    onChange={(e) => setCharAllegiance(e.target.value)}
                    placeholder="e.g. House Stark / House Targaryen"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 placeholder-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Father</label>
                  <input
                    list="character-relation-options"
                    value={charFatherName}
                    onChange={(e) => {
                      setCharFatherName(e.target.value);
                      setCharFatherRef(charactersList.find((character) => character.name === e.target.value)?._id || '');
                    }}
                    placeholder="Select or type a name"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 placeholder-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Mother</label>
                  <input
                    list="character-relation-options"
                    value={charMotherName}
                    onChange={(e) => {
                      setCharMotherName(e.target.value);
                      setCharMotherRef(charactersList.find((character) => character.name === e.target.value)?._id || '');
                    }}
                    placeholder="Select or type a name"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 placeholder-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Spouse</label>
                  <input
                    list="character-relation-options"
                    value={charSpouseName}
                    onChange={(e) => {
                      setCharSpouseName(e.target.value);
                      setCharSpouseRef(charactersList.find((character) => character.name === e.target.value)?._id || '');
                    }}
                    placeholder="Select or type a name"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 placeholder-neutral-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 text-[11px] mb-1">Children (comma separated)</label>
                  <input
                    list="character-relation-options"
                    value={charChildrenNames}
                    onChange={(e) => setCharChildrenNames(e.target.value)}
                    placeholder="Select or type names, e.g. Robb Stark, Arya Stark"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 placeholder-neutral-600"
                  />
                </div>
                <datalist id="character-relation-options">
                  {charactersList.map((character) => (
                    <option key={character._id} value={character.name} />
                  ))}
                </datalist>
              </div>
            )}

            {selectedType === 'character' && (
              <div className="space-y-4 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-300 font-medium flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Character Sections</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCharacterSections([...characterSections, { title: `New Section ${characterSections.length + 1}`, content: '' }])}
                    className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Section</span>
                  </button>
                </div>

                {characterSections.map((section, index) => (
                  <div key={`${section.title}-${index}`} className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-900/60 p-3">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        const updated = [...characterSections];
                        updated[index] = { ...updated[index], title: e.target.value };
                        setCharacterSections(updated);
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                    />
                    <textarea
                      rows={4}
                      value={section.content}
                      onChange={(e) => {
                        const updated = [...characterSections];
                        updated[index] = { ...updated[index], content: e.target.value };
                        setCharacterSections(updated);
                      }}
                      placeholder="Write a paragraph for this section..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500 leading-relaxed"
                    />
                    {characterSections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setCharacterSections(characterSections.filter((_, idx) => idx !== index))}
                        className="text-[11px] font-mono text-red-400 hover:underline"
                      >
                        Remove section
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {selectedType === 'place' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Place Type *</label>
                  <select
                    required
                    value={placeType}
                    onChange={(e) => setPlaceType(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200"
                  >
                    <option value="">Select type</option>
                    <option value="Castle">Castle</option>
                    <option value="City">City</option>
                    <option value="Village">Village</option>
                    <option value="Capital">Capital</option>
                    <option value="Kingdom">Kingdom</option>
                    <option value="Fortress">Fortress</option>
                    <option value="Ruins">Ruins</option>
                    <option value="Landmark">Landmark</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Region / Kingdom *</label>
                  <input
                    required
                    type="text"
                    value={placeRegion}
                    onChange={(e) => setPlaceRegion(e.target.value)}
                    placeholder="e.g. The North"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 placeholder-neutral-600"
                  />
                </div>
              </div>
            )}

            {/* Row 4: Schema-Specific Reference Selectors */}
            {selectedType === 'character' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Status</label>
                  <select
                    value={charStatus}
                    onChange={(e) => setCharStatus(e.target.value as CharacterStatus)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200"
                  >
                    <option value="Alive">Alive</option>
                    <option value="Deceased">Deceased</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">House (Reference)</label>
                  <select
                    value={charHouseRef}
                    onChange={(e) => setCharHouseRef(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200"
                  >
                    {getAllHouses().map((h) => (
                      <option key={h._id} value={h._id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Location / Seat</label>
                  <select
                    value={charLocationRef}
                    onChange={(e) => setCharLocationRef(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200"
                  >
                    {getAllLocations().map((l) => (
                      <option key={l._id} value={l._id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {selectedType === 'house' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Motto / Words</label>
                  <input
                    type="text"
                    value={houseMotto}
                    onChange={(e) => setHouseMotto(e.target.value)}
                    placeholder='e.g. "Winter is Coming"'
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Seat (Place Reference)</label>
                  <select className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200">
                    {getAllLocations().map((l) => (
                      <option key={l._id} value={l._id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Row 5: Portable Text Editor Simulation */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-neutral-300 font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Portable Text Content (with Internal Link Annotations)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setParagraphs([...paragraphs, ''])}
                  className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Paragraph</span>
                </button>
              </div>

              <div className="space-y-3">
                {paragraphs.map((para, idx) => (
                  <div key={idx} className="relative">
                    <textarea
                      rows={3}
                      value={para}
                      onChange={(e) => {
                        const updated = [...paragraphs];
                        updated[idx] = e.target.value;
                        setParagraphs(updated);
                      }}
                      placeholder={`Paragraph ${idx + 1}... Type lore details here.`}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                    />
                    {paragraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setParagraphs(paragraphs.filter((_, i) => i !== idx))}
                        className="absolute right-3 top-3 text-neutral-600 hover:text-red-400"
                        title="Remove block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Live Hover Card Preview Section */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-amber-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Live Hover Card Output Preview</span>
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  Hover over the highlighted link below:
                </span>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 leading-relaxed">
                <span>Chronicled in the droplet-spire archives: </span>
                <HoverCardLink
                  data={{
                    _id: `studio-${docSlug}`,
                    _type: selectedType as WikiDocType,
                    name: docName || 'Subject Name',
                    slug: docSlug || 'subject-slug',
                    image: docImage,
                    quickSummary: quickSummary || 'A prominent historical subject recorded in the Great Archive.',
                    status: charStatus,
                    motto: houseMotto,
                    region: placeRegion,
                  }}
                  onNavigate={onNavigate}
                >
                  <strong className="text-amber-400 underline underline-offset-4 cursor-pointer">
                    {docName || 'Subject Name'}
                  </strong>
                </HoverCardLink>
                <span> is regarded by scholars as one of the defining figures of the age.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedDocId && !isCreatingNew && (
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedDocId, docName)}
                    className="py-2.5 px-4 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/80 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Delete Record</span>
                  </button>
                )}
                {docSlug && !isCreatingNew && (
                  <button
                    type="button"
                    onClick={() => onNavigate('wiki', selectedType === 'place' ? 'location' : selectedType, docSlug)}
                    className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-750 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Live Page</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartNew}
                  className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Publish to Wiki</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default SanityDocumentStudio;
