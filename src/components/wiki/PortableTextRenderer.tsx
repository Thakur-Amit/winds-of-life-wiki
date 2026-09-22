import React from 'react';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { HoverCardLink } from './HoverCardLink';
import { PortableTextBlock, WikiDocType } from '../../types/wiki';
import { ExternalLink, Quote } from 'lucide-react';

interface PortableTextRendererProps {
  value: PortableTextBlock[];
  onNavigate: (type: WikiDocType, slug: string) => void;
}

export const PortableTextRenderer: React.FC<PortableTextRendererProps> = ({ value, onNavigate }) => {
  const components: PortableTextComponents = {
    marks: {
      // Custom internal link annotation renderer
      internalLink: ({ value: markValue, children }) => {
        const ref = markValue?.reference;
        if (!ref) {
          return <span>{children}</span>;
        }

        const hoverData = {
          _id: ref._ref || (ref as any)._id || 'unknown',
          _type: (ref._type || 'character') as WikiDocType,
          name: ref.name || ref.title || 'Unknown Subject',
          slug: ref.slug || ref._ref,
          image: ref.image || ref.sigil || ref.mapImage || ref.coverImage,
          quickSummary: ref.quickSummary,
          status: ref.status,
          houseName: ref.houseName,
          region: ref.region,
          date: ref.date,
          motto: ref.motto,
        };

        return (
          <HoverCardLink data={hoverData} onNavigate={onNavigate}>
            {children}
          </HoverCardLink>
        );
      },

      // Standard external web links
      externalLink: ({ value: markValue, children }) => {
        const { href, blank } = markValue || {};
        return (
          <a
            href={href}
            target={blank ? '_blank' : undefined}
            rel={blank ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-0.5 text-amber-400 hover:text-amber-300 underline underline-offset-2"
          >
            {children}
            <ExternalLink className="w-3 h-3 inline ml-0.5 opacity-70" />
          </a>
        );
      },

      // Typographic decorators
      strong: ({ children }) => <strong className="font-semibold text-neutral-100">{children}</strong>,
      em: ({ children }) => <em className="italic text-neutral-200">{children}</em>,
      code: ({ children }) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-300 font-mono text-xs">
          {children}
        </code>
      ),
    },

    block: {
      h2: ({ children }) => {
        const headingText = typeof children === 'string' ? children : '';
        const anchorId = headingText.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return (
          <h2
            id={anchorId || undefined}
            className="text-2xl font-bold text-neutral-100 font-serif-title mt-8 mb-4 pt-4 border-b border-neutral-800/80 flex items-center gap-2 group"
          >
            <span className="text-amber-500/60 font-serif">§</span>
            <span>{children}</span>
          </h2>
        );
      },
      h3: ({ children }) => (
        <h3 className="text-xl font-semibold text-neutral-200 font-serif-title mt-6 mb-3">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-base font-semibold text-neutral-300 font-serif-title mt-4 mb-2">
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <div className="my-6 relative pl-5 pr-4 py-3.5 bg-gradient-to-r from-amber-950/20 via-neutral-900/40 to-transparent border-l-4 border-amber-600/70 rounded-r-lg">
          <Quote className="w-5 h-5 text-amber-500/40 absolute -top-2.5 -left-2.5 bg-neutral-950 rounded-full p-0.5" />
          <blockquote className="italic text-amber-200/90 font-serif text-base leading-relaxed">
            {children}
          </blockquote>
        </div>
      ),
      normal: ({ children }) => (
        <p className="text-neutral-300 text-[15px] leading-relaxed mb-4 max-w-prose">
          {children}
        </p>
      ),
    },

    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside space-y-1.5 text-neutral-300 text-sm mb-4 pl-2">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside space-y-1.5 text-neutral-300 text-sm mb-4 pl-2 font-mono">
          {children}
        </ol>
      ),
    },

    types: {
      image: ({ value: imageValue }) => {
        if (!imageValue?.asset?.url) return null;
        return (
          <figure className="my-6 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900/60">
            <img
              src={imageValue.asset.url}
              alt={imageValue.alt || 'Archival illustration'}
              className="w-full h-auto max-h-96 object-cover object-center"
            />
            {imageValue.caption && (
              <figcaption className="p-2.5 text-xs text-neutral-400 font-serif text-center border-t border-neutral-800/80 bg-neutral-950/40">
                {imageValue.caption}
              </figcaption>
            )}
          </figure>
        );
      },
    },
  };

  return (
    <div className="prose-dark max-w-none text-neutral-200">
      <PortableText value={value as any} components={components} />
    </div>
  );
};
