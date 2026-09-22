import React, { useState } from 'react';
import {
  Database,
  Plus,
  Check,
  Code2,
  FileCode,
  Shield,
  Users,
  Settings,
  ArrowLeft,
  Trash2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { mockProfessions } from '../../data/mockSanityData';
import { ProfessionDoc } from '../../types/wiki';
import { SanityDocumentStudio } from './SanityDocumentStudio';
import { WikiFooter } from './WikiFooter';

interface AdminSanityPageProps {
  onNavigate: (route: string, type?: string, slug?: string) => void;
  professions: ProfessionDoc[];
  onAddProfession: (newProf: ProfessionDoc) => void;
}

export const AdminSanityPage: React.FC<AdminSanityPageProps> = ({
  onNavigate,
  professions,
  onAddProfession,
}) => {
  const [activeTab, setActiveTab] = useState<'desk' | 'professions' | 'schemas' | 'groq' | 'studio'>('desk');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateProfession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProf: ProfessionDoc = {
      _id: `prof-${Date.now()}`,
      _type: 'profession',
      name: name.trim(),
      slug: { current: newSlug },
      image: imageUrl.trim() || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      description: description.trim() || 'Custom archetype added from Sanity Studio.',
      count: 1,
    };

    onAddProfession(newProf);
    setName('');
    setSlug('');
    setImageUrl('');
    setDescription('');
    setSuccessMsg(`"${newProf.name}" created! It now automatically appears on the Character Directory page.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans">
      {/* Top Admin Header */}
      <div className="bg-neutral-925 border-b border-neutral-800 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
              title="Return to Wiki"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-mono text-[10px] border border-amber-800/60 uppercase">
                  Studio CMS
                </span>
                <span className="text-xs text-neutral-400 font-mono">/admin</span>
              </div>
              <h1 className="text-2xl font-black font-serif-title text-neutral-100 tracking-wide mt-0.5">
                Sanity.io Headless Content Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('characters')}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-300 border border-neutral-800 font-medium"
            >
              View Characters Directory
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs"
            >
              Back to Public Wiki
            </button>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('desk')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'desk'
                ? 'border-amber-400 text-amber-300 font-bold bg-neutral-950/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Document Studio (All 9 Types)</span>
          </button>
          <button
            onClick={() => setActiveTab('professions')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'professions'
                ? 'border-amber-400 text-amber-300 font-bold bg-neutral-950/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Archetypes & Roles ({professions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('schemas')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'schemas'
                ? 'border-amber-400 text-amber-300 font-bold bg-neutral-950/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Sanity Schemas</span>
          </button>
          <button
            onClick={() => setActiveTab('groq')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'groq'
                ? 'border-amber-400 text-amber-300 font-bold bg-neutral-950/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>GROQ Queries</span>
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'studio'
                ? 'border-amber-400 text-amber-300 font-bold bg-neutral-950/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Studio Config</span>
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'desk' && (
          <SanityDocumentStudio onNavigate={onNavigate} />
        )}

        {activeTab === 'professions' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Add New Profession Form */}
            <div className="lg:col-span-5 bg-neutral-925 rounded-2xl border border-neutral-800 p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
                <Plus className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold font-serif-title text-neutral-100">
                  Add Dynamic Profession / Sub-category
                </h3>
              </div>

              {successMsg && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateProfession} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-neutral-400 mb-1 font-mono uppercase text-[10px]">
                    Profession Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }}
                    placeholder="e.g. Ironborn Raiders, High Septons, Dragonriders"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-mono uppercase text-[10px]">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. ironborn-raiders"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono text-xs placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-mono uppercase text-[10px]">
                    Background Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono text-xs placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-mono uppercase text-[10px]">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief summary of this role in the realm..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish to Sanity CMS</span>
                </button>
              </form>
            </div>

            {/* Right: Current Active Professions */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <h3 className="text-sm font-bold font-serif-title text-neutral-200">
                  Published Archetypes ({professions.length})
                </h3>
                <span className="text-[11px] font-mono text-neutral-500">
                  Active in /characters directory
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {professions.map((prof) => (
                  <div
                    key={prof._id}
                    className="relative h-28 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 flex flex-col justify-end p-4 shadow-md group"
                  >
                    <img
                      src={prof.image}
                      alt={prof.name}
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35] contrast-125 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
                    <div className="relative z-10">
                      <span className="text-[10px] font-mono text-amber-400 font-semibold">
                        slug: {prof.slug?.current || (typeof prof.slug === 'string' ? prof.slug : prof._id)}
                      </span>
                      <h4 className="text-sm font-bold font-serif-title text-neutral-100">
                        {prof.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {prof.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schemas' && (
          <div className="bg-neutral-925 rounded-2xl border border-neutral-800 p-6 space-y-4">
            <h3 className="text-base font-bold font-serif-title text-neutral-100">
              Sanity Studio Schemas Definition
            </h3>
            <p className="text-xs text-neutral-400">
              The project is pre-configured with complete schemas for characters, professions, houses, places, events, and custom Portable Text interlink annotations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-amber-400 font-bold">sanity/schemas/profession.ts</span>
                <p className="text-neutral-400 text-[11px] mt-1">
                  Defines Name, Slug, Image (hotspot), and Description for sub-category grids.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-amber-400 font-bold">sanity/schemas/character.ts</span>
                <p className="text-neutral-400 text-[11px] mt-1">
                  Includes Name, Titles, House ref, Professions array ref, Image, and Portable Text biography.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-amber-400 font-bold">sanity/schemas/objects/internalLink.ts</span>
                <p className="text-neutral-400 text-[11px] mt-1">
                  Custom mark annotation for entity interlinking without regex text scanning.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'groq' && (
          <div className="bg-neutral-925 rounded-2xl border border-neutral-800 p-6 space-y-4 font-mono text-xs">
            <h3 className="text-base font-bold font-serif-title text-neutral-100 font-sans">
              GROQ Query Dereferencing
            </h3>
            <pre className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-200 overflow-x-auto leading-relaxed">
{`// Fetch characters with resolved professions and house details
export const CHARACTERS_QUERY = \`*[_type == "character"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  "image": image.asset->url,
  status,
  house->{ name, "slug": slug.current },
  professions[]->{ name, "slug": slug.current, image }
}\`;`}
            </pre>
          </div>
        )}

        {activeTab === 'studio' && (
          <div className="bg-neutral-925 rounded-2xl border border-neutral-800 p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold font-serif-title text-neutral-100">
              Sanity Studio Local Launch
            </h3>
            <p className="text-neutral-300 leading-relaxed">
              When working in a local development environment with your Sanity Project ID and Dataset:
            </p>
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-amber-300">
              npm run dev # Launches Next.js App Router on http://localhost:3000
            </div>
            <p className="text-neutral-400">
              Visit <code className="text-amber-400">/admin</code> or connect to your hosted Sanity studio to manage content directly.
            </p>
          </div>
        )}
      </div>

      <WikiFooter onNavigate={onNavigate} />
    </div>
  );
};
