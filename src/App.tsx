/**
 * Worldbuilding Wiki - Inspired by "A Wiki of Ice and Fire"
 * Built with Next.js architecture, Sanity Portable Text interlinking, and React Flow
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  mockProfessions,
  getAllCharacters,
  findDocByTypeAndSlug,
} from './data/mockSanityData';
import { TopNavbar } from './components/wiki/TopNavbar';
import { LandingPage } from './components/wiki/LandingPage';
import { CharacterDirectoryPage } from './components/wiki/CharacterDirectoryPage';
import { CategoryDirectoryPage } from './components/wiki/CategoryDirectoryPage';
import { WikiArticleView } from './components/wiki/WikiArticleView';
import { FamilyTreePage } from './components/wiki/FamilyTreePage';
import { WorldTimelinePage } from './components/wiki/WorldTimelinePage';
import { AdminSanityPage } from './components/wiki/AdminSanityPage';
import { ProfessionDoc } from './types/wiki';

export default function App() {
  // Routes: 'home' | 'characters' | 'category' | 'wiki' | 'family-tree' | 'timeline' | 'admin'
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [categorySlug, setCategorySlug] = useState<string>('places');
  const [wikiType, setWikiType] = useState<string>('character');
  const [wikiSlug, setWikiSlug] = useState<string>('');

  // Dynamic Professions managed in Sanity CMS Studio
  const [professions, setProfessions] = useState<ProfessionDoc[]>(mockProfessions);

  // Known category slugs
  const knownCategories = [
    'houses',
    'places',
    'locations',
    'history',
    'events',
    'culture',
    'cultures',
    'magic-artifacts',
    'magic',
    'species-creatures',
    'species',
    'books',
    'book',
  ];

  // Sync hash routing if user uses browser forward/back or deep links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || hash === '/' || hash === 'home') {
        setCurrentRoute('home');
      } else if (hash === 'characters') {
        setCurrentRoute('characters');
      } else if (hash === 'timeline') {
        setCurrentRoute('timeline');
      } else if (hash === 'family-tree') {
        setCurrentRoute('family-tree');
      } else if (hash === 'admin') {
        setCurrentRoute('admin');
      } else if (hash.startsWith('category/')) {
        const cat = hash.replace('category/', '');
        setCurrentRoute('category');
        setCategorySlug(cat);
      } else if (knownCategories.includes(hash)) {
        setCurrentRoute('category');
        setCategorySlug(hash);
      } else if (hash.startsWith('wiki/')) {
        const parts = hash.split('/');
        if (parts.length >= 3) {
          setCurrentRoute('wiki');
          setWikiType(parts[1]);
          setWikiSlug(parts[2]);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (route: string, typeOrCat?: string, slug?: string) => {
    setCurrentRoute(route);
    if (route === 'wiki' && typeOrCat && slug) {
      setWikiType(typeOrCat);
      setWikiSlug(slug);
      window.location.hash = `wiki/${typeOrCat}/${slug}`;
    } else if (route === 'category' && typeOrCat) {
      setCategorySlug(typeOrCat);
      window.location.hash = `category/${typeOrCat}`;
    } else if (route === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = route;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddProfession = (newProf: ProfessionDoc) => {
    setProfessions((prev) => [newProf, ...prev]);
  };

  // Resolve current active wiki document
  const currentDoc = useMemo(() => {
    return findDocByTypeAndSlug(wikiType, wikiSlug) || getAllCharacters()[0] || null;
  }, [wikiType, wikiSlug]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans selection:bg-amber-900/50 selection:text-amber-100">
      {/* Top Navbar */}
      <TopNavbar currentRoute={currentRoute} onNavigate={handleNavigate} />

      {/* Main View Switcher */}
      <div className="flex-1 flex flex-col">
        {currentRoute === 'home' && (
          <LandingPage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'characters' && (
          <CharacterDirectoryPage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'timeline' && (
          <WorldTimelinePage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'category' && (
          <CategoryDirectoryPage
            categorySlug={categorySlug}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'wiki' && (
          <WikiArticleView
            document={currentDoc}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'family-tree' && (
          <FamilyTreePage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'admin' && (
          <AdminSanityPage
            onNavigate={handleNavigate}
            professions={professions}
            onAddProfession={handleAddProfession}
          />
        )}
      </div>
    </div>
  );
}
