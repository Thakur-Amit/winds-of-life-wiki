import React, { useState } from 'react';
import { WikiDoc } from '../../types/wiki';
import { PortableTextRenderer } from './PortableTextRenderer';
import { WikiInfobox } from './WikiInfobox';
import { WikiFooter } from './WikiFooter';
import { buildCharacterSections, deleteWikiDocument } from '../../data/mockSanityData';
import {
  BookOpen,
  ChevronRight,
  Clock,
  Shield,
  ArrowLeft,
  GitFork,
  Flame,
  Edit3,
  Trash2,
} from 'lucide-react';

interface WikiArticleViewProps {
  document: WikiDoc;
  onNavigate: (route: string, type?: string, slug?: string) => void;
}

export const WikiArticleView: React.FC<WikiArticleViewProps> = ({
  document,
  onNavigate,
}) => {
  // Extract portable text content based on document type
  const portableTextContent =
    'biography' in document && Array.isArray(document.biography)
      ? document.biography
      : 'history' in document && Array.isArray(document.history)
      ? document.history
      : 'details' in document && Array.isArray(document.details)
      ? document.details
      : 'traditions' in document && Array.isArray(document.traditions)
      ? document.traditions
      : 'rulesAndArtifacts' in document && Array.isArray(document.rulesAndArtifacts)
      ? document.rulesAndArtifacts
      : 'synopsis' in document && Array.isArray(document.synopsis)
      ? document.synopsis
      : 'description' in document && Array.isArray(document.description)
      ? document.description
      : [];

  const leadSummary =
    'quickSummary' in document && typeof document.quickSummary === 'string'
      ? document.quickSummary
      : 'description' in document && typeof document.description === 'string'
      ? document.description
      : undefined;

  const docTitle = document.name || ('title' in document ? (document as any).title : '');
  const characterSections = document._type === 'character' ? buildCharacterSections(document as any) : [];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans">
      {/* Breadcrumb Navigation Bar */}
      <div className="bg-neutral-925/80 border-b border-neutral-850 px-4 sm:px-6 lg:px-8 py-3 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-neutral-400 font-mono truncate">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-amber-300 transition-colors"
            >
              Winds of Life
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
            <button
              onClick={() => {
                if (document._type === 'character') onNavigate('characters');
                else onNavigate('home');
              }}
              className="capitalize hover:text-amber-300 transition-colors"
            >
              {document._type === 'character' ? 'Characters' : `${document._type}s`}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
            <span className="text-amber-400 font-semibold truncate font-serif">
              {docTitle}
            </span>
          </nav>

          <button
            onClick={() => onNavigate('characters')}
            className="hidden sm:flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Directory</span>
          </button>
        </div>
      </div>

      {/* Main Article Content Container (Center Content + Floating Infobox, NO LEFT SIDEBAR) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Article Header Banner */}
        <div className="border-b border-neutral-800 pb-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-400 font-semibold">
                {document._type}
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                Archival Record: {document.slug?.current || (typeof document.slug === 'string' ? document.slug : document._id)}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('admin')}
                className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 border border-neutral-800 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Edit this entry in CMS Studio"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit Entry</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${docTitle}" from the wiki?`)) {
                    deleteWikiDocument(document._id);
                    if (document._type === 'character') {
                      onNavigate('characters');
                    } else {
                      onNavigate('category', document._type === 'location' ? 'places' : `${document._type}s`);
                    }
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Delete this entry from the wiki"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Delete</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400 font-mono pl-2 border-l border-neutral-800">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Citadel Revised 305 AC</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-serif-title text-neutral-100 tracking-wide mt-1">
            {docTitle}
          </h1>

          {/* Subtitles / Motto / Titles */}
          {'motto' in document && document.motto && (
            <p className="text-sm italic font-serif text-amber-300 mt-1">
              "{document.motto}"
            </p>
          )}
          {'titles' in document && document.titles && (
            <p className="text-xs text-neutral-400 font-mono mt-1">
              {document.titles.join(' • ')}
            </p>
          )}

          {/* Lead Quick Summary */}
          {leadSummary && (
            <div className="mt-4 p-4 rounded-xl bg-neutral-900/70 border-l-4 border-amber-500 border-y border-r border-neutral-800 text-sm text-neutral-200 leading-relaxed font-sans">
              <strong className="text-amber-300 font-serif mr-1">Codex Abstract:</strong>
              {leadSummary}
            </div>
          )}
        </div>

        {/* 2-Column Responsive Layout: Left/Center Article Body + Right Infobox */}
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 items-start">
          {/* Main Rich Content Body */}
          <div className="flex-1 min-w-0">
            <div className="bg-neutral-925 p-6 sm:p-8 rounded-2xl border border-neutral-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Citadel Historical Chronicle</span>
                </h2>
                <span className="text-[11px] font-mono text-amber-500/80">
                  Sanity Portable Text
                </span>
              </div>

              {document._type === 'character' && characterSections.length > 0 ? (
                <div className="space-y-6 text-neutral-200">
                  {characterSections.map((section) => (
                    <section key={section.title} className="border border-neutral-800 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-5 shadow-inner shadow-neutral-950/50">
                      <h3 className="text-lg font-bold font-serif-title text-amber-300 mb-3 pb-2 border-b border-neutral-800 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                        {section.title}
                      </h3>
                      <div className="space-y-3 text-sm leading-7 text-neutral-200 whitespace-pre-line">
                        {section.content}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="text-neutral-200">
                  <PortableTextRenderer
                    value={portableTextContent}
                    onNavigate={(type, slug) => onNavigate('wiki', type, slug)}
                  />
                </div>
              )}

              {/* Interactive Lineage Link if Character */}
              {document._type === 'character' && (
                <div className="pt-6 border-t border-neutral-800">
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold font-serif-title text-neutral-100 flex items-center gap-2">
                        <GitFork className="w-4 h-4 text-amber-400" />
                        <span>Dynastic Lineage & Family Connections</span>
                      </h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Inspect interactive genealogical bonds mapped via React Flow.
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('family-tree')}
                      className="px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900/80 border border-amber-700 text-amber-300 text-xs font-semibold self-start sm:self-auto transition-colors"
                    >
                      Open Family Tree Graph
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Wikipedia / AWOIAF Infobox */}
          <div className="w-full lg:w-80 shrink-0">
            <WikiInfobox
              document={document}
              onNavigate={(type, slug) => onNavigate('wiki', type, slug)}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <WikiFooter onNavigate={onNavigate} />
    </div>
  );
};
