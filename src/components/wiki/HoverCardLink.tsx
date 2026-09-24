import React from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import {
  Shield,
  MapPin,
  Calendar,
  User,
  ArrowRight,
  Sparkles,
  BookOpen,
  Scroll,
  Compass,
  Award,
  Layers,
} from 'lucide-react';
import { WikiDocType, CharacterStatus } from '../../types/wiki';

export interface HoverLinkItemData {
  _id: string;
  _type: WikiDocType;
  name?: string;
  title?: string;
  slug?: { current: string } | string;
  image?: string;
  sigil?: string;
  mapImage?: string;
  coverImage?: string;
  quickSummary?: string;
  status?: CharacterStatus;
  houseName?: string;
  region?: string;
  date?: string;
  motto?: string;
  titles?: string[];
  category?: string;
}

interface HoverCardLinkProps {
  children: React.ReactNode;
  data: HoverLinkItemData;
  onNavigate?: (type: WikiDocType, slug: string) => void;
  className?: string;
}

export const HoverCardLink: React.FC<HoverCardLinkProps> = ({
  children,
  data,
  onNavigate,
  className = '',
}) => {
  const displayName = data.name || data.title || 'Unknown Subject';
  const slugStr =
    typeof data.slug === 'object' && data.slug !== null
      ? data.slug.current
      : typeof data.slug === 'string'
      ? data.slug
      : data._id;

  const displayImage = data.image || data.sigil || data.mapImage || data.coverImage;

  // Normalized doc type (support aliases)
  const normalizedType: WikiDocType =
    data._type === 'location' ? 'place' : data._type || 'character';

  // Distinct category badge styling and icons
  const getTypeBadge = () => {
    switch (normalizedType) {
      case 'character':
        return {
          icon: <User className="w-3 h-3 text-amber-400" />,
          label: 'Personage',
          bg: 'bg-amber-950/70 border-amber-800/50 text-amber-300',
        };
      case 'house':
        return {
          icon: <Shield className="w-3 h-3 text-red-400" />,
          label: 'Noble House',
          bg: 'bg-red-950/70 border-red-800/50 text-red-300',
        };
      case 'place':
        return {
          icon: <MapPin className="w-3 h-3 text-emerald-400" />,
          label: 'Kingdom / Place',
          bg: 'bg-emerald-950/70 border-emerald-800/50 text-emerald-300',
        };
      case 'culture':
        return {
          icon: <Scroll className="w-3 h-3 text-purple-400" />,
          label: 'Culture & Folkway',
          bg: 'bg-purple-950/70 border-purple-800/50 text-purple-300',
        };
      case 'event':
        return {
          icon: <Calendar className="w-3 h-3 text-blue-400" />,
          label: 'Historical Event',
          bg: 'bg-blue-950/70 border-blue-800/50 text-blue-300',
        };
      case 'magic':
        return {
          icon: <Sparkles className="w-3 h-3 text-violet-400" />,
          label: 'Magic & Artifact',
          bg: 'bg-violet-950/70 border-violet-800/50 text-violet-300',
        };
      case 'species':
        return {
          icon: <Compass className="w-3 h-3 text-orange-400" />,
          label: 'Bestiary / Species',
          bg: 'bg-orange-950/70 border-orange-800/50 text-orange-300',
        };
      case 'book':
        return {
          icon: <BookOpen className="w-3 h-3 text-indigo-400" />,
          label: 'Canonical Tome',
          bg: 'bg-indigo-950/70 border-indigo-800/50 text-indigo-300',
        };
      case 'profession':
        return {
          icon: <Award className="w-3 h-3 text-yellow-400" />,
          label: 'Archetype / Role',
          bg: 'bg-yellow-950/70 border-yellow-800/50 text-yellow-300',
        };
      default:
        return {
          icon: <Layers className="w-3 h-3 text-neutral-400" />,
          label: 'Codex Record',
          bg: 'bg-neutral-900 border-neutral-800 text-neutral-300',
        };
    }
  };

  const badge = getTypeBadge();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onNavigate) {
      onNavigate(normalizedType, slugStr);
    } else {
      window.location.hash = `#wiki/${normalizedType}/${slugStr}`;
    }
  };

  return (
    <HoverCard.Root openDelay={140} closeDelay={200}>
      <HoverCard.Trigger asChild>
        <button
          type="button"
          onClick={handleClick}
          className={`inline-flex items-center text-amber-400 hover:text-amber-300 underline decoration-amber-600/70 hover:decoration-amber-400 underline-offset-3 font-medium transition-colors cursor-pointer text-left ${className}`}
        >
          {children}
        </button>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          sideOffset={8}
          side="top"
          align="center"
          className="z-50 w-80 rounded-xl bg-neutral-900/95 backdrop-blur-md border border-neutral-800/90 shadow-2xl shadow-black/90 overflow-hidden text-neutral-200 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          {/* Header Visual Banner */}
          {displayImage && (
            <div className="relative h-28 w-full overflow-hidden bg-neutral-950 border-b border-neutral-800/80">
              <img
                src={displayImage}
                alt={displayName}
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

              {/* Status indicator if character */}
              {data.status && (
                <span
                  className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded uppercase backdrop-blur-sm border ${
                    data.status === 'Alive'
                      ? 'bg-emerald-950/85 text-emerald-300 border-emerald-700/60'
                      : data.status === 'Resurrected'
                      ? 'bg-cyan-950/85 text-cyan-300 border-cyan-700/60'
                      : 'bg-red-950/85 text-red-300 border-red-700/60'
                  }`}
                >
                  {data.status}
                </span>
              )}
            </div>
          )}

          {/* Card Body */}
          <div className="p-3.5 space-y-2.5">
            {/* Meta Badge + Region / Date */}
            <div className="flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-md border ${badge.bg}`}
              >
                {badge.icon}
                {badge.label}
              </span>

              {(data.houseName || data.region || data.date) && (
                <span className="text-[11px] text-neutral-400 font-mono truncate max-w-[130px]">
                  {data.houseName || data.region || data.date}
                </span>
              )}
            </div>

            {/* Title & Motto */}
            <div>
              <h4 className="text-base font-bold text-neutral-100 font-serif-title leading-snug">
                {displayName}
              </h4>
              {data.motto && (
                <p className="text-xs italic text-amber-300/80 mt-0.5">
                  "{data.motto}"
                </p>
              )}
            </div>

            {/* Quick Summary Preview */}
            <p className="text-xs text-neutral-300/90 leading-relaxed line-clamp-3 bg-neutral-950/50 p-2 rounded-lg border border-neutral-800/60">
              {data.quickSummary ||
                'An ancient and storied subject chronicled in the droplet-spire Worldbuilding Codex.'}
            </p>

            {/* Click to Navigate Footer Action */}
            <button
              type="button"
              onClick={handleClick}
              className="w-full flex items-center justify-between pt-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium group transition-colors cursor-pointer border-t border-neutral-800/60"
            >
              <span className="flex items-center gap-1">
                Open Codex Article{' '}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="text-[10px] text-neutral-500 font-mono uppercase">
                wiki/{normalizedType}
              </span>
            </button>
          </div>

          <HoverCard.Arrow className="fill-neutral-900 stroke-neutral-800" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

export default HoverCardLink;
