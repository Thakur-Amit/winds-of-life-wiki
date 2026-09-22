import React, { useState } from 'react';
import { X, Copy, Check, FolderTree, FileCode, Database, Cpu, ExternalLink } from 'lucide-react';

interface CodeArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeArchitectureModal: React.FC<CodeArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'schemas' | 'queries' | 'nextjs' | 'reactflow'>('structure');
  const [selectedSchema, setSelectedSchema] = useState<'character' | 'house' | 'location' | 'event' | 'internalLink'>('character');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const folderStructureText = `
worldbuilding-wiki/
├── app/
│   ├── wiki/
│   │   ├── [type]/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx               # Dynamic article page router (Character, House, Location, Event)
│   │   │       └── loading.tsx            # Skeleton codex loader
│   │   ├── family-tree/
│   │   │   └── page.tsx                   # Dedicated interactive React Flow dynasty visualizer
│   │   └── layout.tsx                     # Wiki 3-column layout (Sidebar, Article, Infobox)
│   ├── layout.tsx                         # Root html layout with dark theme & fonts
│   └── page.tsx                           # Wiki portal / homepage
├── sanity/
│   ├── schemas/
│   │   ├── objects/
│   │   │   ├── internalLink.ts            # Custom Mark annotation for entity interlinking
│   │   │   └── portableText.ts            # Rich text block array with markDefs
│   │   ├── character.ts                   # Schema for Personages, titles, house ref, lineage
│   │   ├── house.ts                       # Schema for Noble Houses, sigil, motto, seat ref
│   │   ├── location.ts                    # Schema for Realms, castles, map, ruler ref
│   │   ├── event.ts                       # Schema for Chronicles, battles, involved parties
│   │   └── index.ts                       # Schema aggregator
│   ├── lib/
│   │   ├── queries.ts                     # Deep GROQ queries dereferencing internalLink & relations
│   │   └── client.ts                      # Sanity client & caching setup
│   └── sanity.config.ts                   # Studio workspace configuration
├── src/
│   └── components/
│       └── wiki/
│           ├── PortableTextRenderer.tsx   # Custom Next.js PortableText component with mark handlers
│           ├── WikiHoverCard.tsx          # Tooltip preview card (Tailwind + Framer Motion)
│           ├── WikiInfobox.tsx            # Top-right Wikipedia/AWOIAF-style infobox
│           ├── FamilyTreeFlow.tsx         # React Flow interactive lineage graph
│           └── WikiSidebar.tsx            # Left navigation sidebar & instant search
├── package.json
└── tailwind.config.ts
`;

  const nextJsPageSnippet = `// app/wiki/[type]/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/client';
import {
  CHARACTER_BY_SLUG_QUERY,
  HOUSE_BY_SLUG_QUERY,
  LOCATION_BY_SLUG_QUERY,
  EVENT_BY_SLUG_QUERY
} from '@/sanity/lib/queries';
import { PortableTextRenderer } from '@/components/wiki/PortableTextRenderer';
import { WikiInfobox } from '@/components/wiki/WikiInfobox';

interface PageProps {
  params: {
    type: 'character' | 'house' | 'location' | 'event';
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const doc = await fetchDoc(params.type, params.slug);
  if (!doc) return {};
  return {
    title: \`\${doc.name} — A Wiki of Ice and Fire\`,
    description: doc.quickSummary,
  };
}

async function fetchDoc(type: string, slug: string) {
  switch (type) {
    case 'character':
      return sanityFetch({ query: CHARACTER_BY_SLUG_QUERY, params: { slug } });
    case 'house':
      return sanityFetch({ query: HOUSE_BY_SLUG_QUERY, params: { slug } });
    case 'location':
      return sanityFetch({ query: LOCATION_BY_SLUG_QUERY, params: { slug } });
    case 'event':
      return sanityFetch({ query: EVENT_BY_SLUG_QUERY, params: { slug } });
    default:
      return null;
  }
}

export default async function WikiArticlePage({ params }: PageProps) {
  const doc = await fetchDoc(params.type, params.slug);
  if (!doc) notFound();

  return (
    <article className="max-w-6xl mx-auto px-6 py-8">
      {/* 3-Column Layout: Center Content + Top-Right Infobox */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Article Body */}
        <div className="flex-1 min-w-0">
          <header className="border-b border-neutral-800 pb-4 mb-6">
            <span className="text-xs uppercase tracking-wider text-amber-500 font-mono">
              {doc._type}
            </span>
            <h1 className="text-3xl font-extrabold font-serif text-neutral-100 mt-1">
              {doc.name}
            </h1>
          </header>

          {/* Portable Text with Custom Internal Links */}
          <div className="prose prose-invert max-w-none">
            <PortableTextRenderer value={doc.biography || doc.history || doc.details || doc.description} />
          </div>
        </div>

        {/* Wikipedia/AWOIAF-Style Floating Infobox */}
        <WikiInfobox document={doc} />
      </div>
    </article>
  );
}`;

  const groqSnippet = `// sanity/lib/queries.ts
// Deep projection for Portable Text internal links:
const PORTABLE_TEXT_PROJECTION = \`
  ...,
  markDefs[]{
    ...,
    _type == "internalLink" => {
      ...,
      reference->{
        _id,
        _type,
        name,
        "slug": slug.current,
        quickSummary,
        "image": coalesce(image.asset->url, sigil.asset->url, mapImage.asset->url),
        status,
        date,
        region,
        motto,
        "houseName": house->name
      }
    }
  }
\`;

export const CHARACTER_BY_SLUG_QUERY = \`
  *[_type == "character" && slug.current == $slug][0]{
    _id,
    _type,
    name,
    titles,
    aliases,
    age,
    status,
    culture,
    born,
    died,
    "image": image.asset->url,
    quickSummary,
    house->{ _id, name, "slug": slug.current, "sigil": sigil.asset->url, motto },
    father->{ _id, name, "slug": slug.current },
    mother->{ _id, name, "slug": slug.current },
    spouse->{ _id, name, "slug": slug.current },
    children[]->{ _id, name, "slug": slug.current },
    biography[]{ \${PORTABLE_TEXT_PROJECTION} }
  }
\`;`;

  const reactFlowLineageSnippet = `/**
 * React Flow Family Tree Data Architecture
 * ========================================================
 * 1. HOW IT IS STORED IN SANITY:
 * In the 'character' schema, family relationships are modeled as document references:
 *   - father: reference -> character
 *   - mother: reference -> character
 *   - spouse: reference -> character
 *   - children: array of references -> character
 *
 * 2. GROQ QUERY:
 *   *[_type == "character" && house->slug.current == $houseSlug]{
 *     _id,
 *     name,
 *     "slug": slug.current,
 *     "avatar": image.asset->url,
 *     status,
 *     born,
 *     died,
 *     "fatherId": father._ref,
 *     "motherId": mother._ref,
 *     "spouseId": spouse._ref,
 *     "spouseName": spouse->name
 *   }
 *
 * 3. TRANSFORMING SANITY DOCUMENTS INTO REACT FLOW NODES & EDGES:
 *   // Calculate generation level for Y-positioning:
 *   // Level 0 (Rickard Stark) => y: 50
 *   // Level 1 (Ned, Brandon, Lyanna) => y: 240
 *   // Level 2 (Robb, Sansa, Arya, Bran) => y: 440
 *   // Level 3 (Jon Snow / grandchildren) => y: 640
 *
 *   const edges = characters.flatMap((char) => {
 *     const links = [];
 *     if (char.fatherId) {
 *       links.push({
 *         id: \`edge-parent-\${char.fatherId}-\${char._id}\`,
 *         source: char.fatherId,
 *         target: char._id,
 *         type: 'smoothstep',
 *         style: { stroke: '#d4af37', strokeWidth: 2 }
 *       });
 *     }
 *     if (char.spouseId) {
 *       links.push({
 *         id: \`edge-spouse-\${char._id}-\${char.spouseId}\`,
 *         source: char._id,
 *         target: char.spouseId,
 *         type: 'smoothstep',
 *         style: { stroke: '#e11d48', strokeDasharray: '4 4' }
 *       });
 *     }
 *     return links;
 *   });
 */`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-800/60 flex items-center justify-center text-amber-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100 font-serif-title">
                Architecture, Schemas & Implementation Deliverables
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Production-ready Next.js (App Router) + Sanity.io CMS + React Flow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 bg-neutral-925 border-b border-neutral-800 gap-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('structure')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'structure'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Folder Structure</span>
          </button>

          <button
            onClick={() => setActiveTab('schemas')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'schemas'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Sanity Schemas</span>
          </button>

          <button
            onClick={() => setActiveTab('queries')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'queries'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>GROQ Queries</span>
          </button>

          <button
            onClick={() => setActiveTab('nextjs')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'nextjs'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Next.js App Router Page</span>
          </button>

          <button
            onClick={() => setActiveTab('reactflow')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'reactflow'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            <span>React Flow Family Tree Architecture</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-neutral-950 font-mono text-xs text-neutral-300 relative">
          {/* Copy Button */}
          <div className="sticky top-2 right-2 flex justify-end z-10">
            <button
              onClick={() => {
                if (activeTab === 'structure') handleCopy(folderStructureText);
                if (activeTab === 'nextjs') handleCopy(nextJsPageSnippet);
                if (activeTab === 'queries') handleCopy(groqSnippet);
                if (activeTab === 'reactflow') handleCopy(reactFlowLineageSnippet);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 shadow-md text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
            </button>
          </div>

          {activeTab === 'structure' && (
            <div className="space-y-4">
              <p className="text-neutral-400 font-sans text-xs">
                Production file and directory layout designed for local-first Next.js (App Router) + Sanity Studio + React Flow:
              </p>
              <pre className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-200/90 leading-relaxed overflow-x-auto">
                {folderStructureText}
              </pre>
            </div>
          )}

          {activeTab === 'schemas' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-neutral-400 font-sans text-xs">Select schema to inspect:</span>
                {(['character', 'house', 'location', 'event', 'internalLink'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSchema(s)}
                    className={`px-2.5 py-1 rounded text-xs uppercase font-mono ${
                      selectedSchema === s
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 text-neutral-200 overflow-x-auto">
                <p className="text-neutral-500 mb-2">// sanity/schemas/{selectedSchema}.ts</p>
                <p className="font-sans text-xs text-neutral-300 mb-3">
                  All schemas are created in <code className="text-amber-300">/sanity/schemas/{selectedSchema}.ts</code> with full validation, reference filtering, and Portable Text internal link annotations.
                </p>
                <div className="text-[11px] text-amber-200/90 leading-relaxed">
                  Refer to the generated source files on disk:
                  <ul className="list-disc list-inside mt-2 space-y-1 font-mono text-neutral-300">
                    <li>/sanity/schemas/objects/internalLink.ts (Custom Mark Annotation)</li>
                    <li>/sanity/schemas/objects/portableText.ts (Rich Text)</li>
                    <li>/sanity/schemas/character.ts (Personage + Lineage References)</li>
                    <li>/sanity/schemas/house.ts (Heraldry, Motto, Seat)</li>
                    <li>/sanity/schemas/location.ts (Realms, Castles, Maps)</li>
                    <li>/sanity/schemas/event.ts (Chronicles, Involved Parties)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'queries' && (
            <div className="space-y-4">
              <p className="text-neutral-400 font-sans text-xs">
                GROQ queries resolving Sanity Portable Text internal links into full hover card payloads with zero regex scanning:
              </p>
              <pre className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-200/90 leading-relaxed overflow-x-auto">
                {groqSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'nextjs' && (
            <div className="space-y-4">
              <p className="text-neutral-400 font-sans text-xs">
                Next.js App Router dynamic page implementation with server-side GROQ fetching and 3-column Wiki layout:
              </p>
              <pre className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-200/90 leading-relaxed overflow-x-auto">
                {nextJsPageSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'reactflow' && (
            <div className="space-y-4">
              <p className="text-neutral-400 font-sans text-xs">
                Deep dive into structuring parent-child node data in Sanity so that it naturally translates into the visual nodes and edges of React Flow:
              </p>
              <pre className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-200/90 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {reactFlowLineageSnippet}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
