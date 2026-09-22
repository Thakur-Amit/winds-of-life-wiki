import React from 'react';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/client';
import {
  CHARACTER_BY_SLUG_QUERY,
  HOUSE_BY_SLUG_QUERY,
  LOCATION_BY_SLUG_QUERY,
  EVENT_BY_SLUG_QUERY,
} from '@/sanity/lib/queries';
import { PortableTextRenderer } from '@/src/components/wiki/PortableTextRenderer';
import { WikiInfobox } from '@/src/components/wiki/WikiInfobox';

interface PageProps {
  params: {
    type: 'characters' | 'houses' | 'locations' | 'events' | 'character' | 'house' | 'location' | 'event';
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const doc = await getDocument(params.type, params.slug);
  if (!doc) return {};
  return {
    title: `${doc.name} — A Wiki of Ice and Fire`,
    description: doc.quickSummary,
    openGraph: {
      title: `${doc.name} — Worldbuilding Wiki`,
      description: doc.quickSummary,
      images: [doc.image || doc.sigil || doc.mapImage].filter(Boolean),
    },
  };
}

async function getDocument(type: string, slug: string) {
  const normalizedType = type.replace(/s$/, ''); // characters -> character
  let query = '';

  switch (normalizedType) {
    case 'character':
      query = CHARACTER_BY_SLUG_QUERY;
      break;
    case 'house':
      query = HOUSE_BY_SLUG_QUERY;
      break;
    case 'location':
      query = LOCATION_BY_SLUG_QUERY;
      break;
    case 'event':
      query = EVENT_BY_SLUG_QUERY;
      break;
    default:
      return null;
  }

  return sanityFetch<any>({ query, params: { slug } });
}

export default async function WikiArticlePage({ params }: PageProps) {
  const doc = await getDocument(params.type, params.slug);

  if (!doc) {
    notFound();
  }

  const content = doc.biography || doc.history || doc.details || doc.description || [];

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 3-Column Layout: Breadcrumbs & Header */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Center: Main Rich Content Body */}
        <div className="flex-1 min-w-0">
          {/* Header Banner */}
          <div className="border-b border-neutral-800 pb-5 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-500 mb-1">
              <span>Citadel Archives</span>
              <span>/</span>
              <span className="text-neutral-400">{doc._type}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-title text-neutral-100 tracking-wide">
              {doc.name}
            </h1>
            {doc.quickSummary && (
              <p className="mt-3 text-sm text-neutral-300/90 leading-relaxed italic bg-neutral-900/50 p-3 rounded-lg border-l-2 border-amber-600">
                {doc.quickSummary}
              </p>
            )}
          </div>

          {/* Portable Text Body with Custom Internal Link Annotations & Hover Cards */}
          <div className="text-neutral-200">
            <PortableTextRenderer value={content} onNavigate={() => {}} />
          </div>
        </div>

        {/* Right Sidebar: Dynamic Infobox */}
        <div className="w-full lg:w-80 shrink-0">
          <WikiInfobox document={doc} onNavigate={() => {}} />
        </div>
      </div>
    </article>
  );
}
