import React from 'react';
import { WikiDoc, WikiDocType } from '../../types/wiki';
import { WikiHoverCard } from './WikiHoverCard';
import { Shield, MapPin, Calendar, User, Heart, Crown, Sword, Flag } from 'lucide-react';
import { getDocSlug } from '../../data/mockSanityData';

interface WikiInfoboxProps {
  document: WikiDoc;
  onNavigate: (type: WikiDocType, slug: string) => void;
}

export const WikiInfobox: React.FC<WikiInfoboxProps> = ({ document, onNavigate }) => {
  const isCharacter = document._type === 'character';
  const isHouse = document._type === 'house';
  const isLocation = document._type === 'location';
  const isEvent = document._type === 'event';

  // Helper row component
  const InfoRow = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => {
    if (!children) return null;
    return (
      <tr className="border-b border-neutral-800/60 text-xs">
        <th className="py-2.5 px-3 text-left font-medium text-neutral-400 bg-neutral-900/40 w-1/3 align-top">
          {label}
        </th>
        <td className="py-2.5 px-3 text-neutral-200 w-2/3 align-top leading-relaxed">
          {children}
        </td>
      </tr>
    );
  };

  // Helper section header inside table
  const SectionHeader = ({ title, icon }: { title: string; icon?: React.ReactNode }) => (
    <tr className="bg-gradient-to-r from-amber-950/40 via-neutral-900 to-amber-950/30 border-y border-amber-900/40">
      <th colSpan={2} className="py-1.5 px-3 text-center text-[11px] font-bold uppercase tracking-wider text-amber-300/90 font-serif">
        <span className="inline-flex items-center gap-1.5 justify-center">
          {icon}
          {title}
        </span>
      </th>
    </tr>
  );

  return (
    <aside
      id={`infobox-${getDocSlug(document)}`}
      className="w-full lg:w-80 xl:w-88 shrink-0 bg-neutral-900/90 backdrop-blur-md rounded-xl border border-neutral-800 shadow-xl overflow-hidden self-start lg:sticky lg:top-20"
      aria-label="Article Infobox"
    >
      {/* Top Banner / Title Header */}
      <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 border-b border-neutral-700/60 p-3 text-center">
        <div className="flex items-center justify-center gap-1.5 text-[10px] tracking-widest uppercase font-semibold text-amber-400 font-mono mb-0.5">
          {isCharacter && <Crown className="w-3 h-3" />}
          {isHouse && <Shield className="w-3 h-3" />}
          {isLocation && <MapPin className="w-3 h-3" />}
          {isEvent && <Calendar className="w-3 h-3" />}
          <span>{document._type}</span>
        </div>
        <h3 className="text-lg font-bold text-neutral-100 font-serif-title tracking-wide">
          {document.name}
        </h3>
        {isHouse && document.motto && (
          <p className="text-xs italic text-amber-300 font-serif mt-0.5">
            "{document.motto}"
          </p>
        )}
      </div>

      {/* Main Image / Sigil / Map */}
      {(('image' in document && document.image) || ('sigil' in document && document.sigil) || ('mapImage' in document && document.mapImage)) && (
        <div className="p-3 bg-neutral-950/60 border-b border-neutral-800 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[260px] rounded-lg overflow-hidden border border-neutral-800 shadow-inner bg-neutral-900">
            <img
              src={
                ('image' in document && document.image ? document.image : undefined) ||
                ('sigil' in document && document.sigil ? document.sigil : undefined) ||
                ('mapImage' in document && document.mapImage ? document.mapImage : undefined)
              }
              alt={document.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <p className="text-[11px] text-neutral-400 font-serif text-center mt-2 italic">
            {isCharacter && 'Depiction in Northern Chronicles'}
            {isHouse && 'Heraldic Sigil & Coat of Arms'}
            {isLocation && 'Archival droplet-spire Map Snippet'}
            {isEvent && 'Chronicle of the Campaign'}
          </p>
        </div>
      )}

      {/* Data Table */}
      <table className="w-full border-collapse">
        <tbody>
          {/* Character Specific Details */}
          {isCharacter && (
            <>
              <SectionHeader title="Biographical Information" icon={<User className="w-3 h-3" />} />

              {document.titles && document.titles.length > 0 && (
                <InfoRow label="Titles">
                  <ul className="space-y-1">
                    {document.titles.map((t, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-amber-500/70">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </InfoRow>
              )}

              {document.aliases && document.aliases.length > 0 && (
                <InfoRow label="Aliases">
                  <span>{document.aliases.join(', ')}</span>
                </InfoRow>
              )}

              {document.house && (
                <InfoRow label="Allegiance">
                  <WikiHoverCard
                    data={{
                      _id: document.house._id,
                      _type: 'house',
                      name: document.house.name,
                      slug: getDocSlug(document.house),
                      sigil: document.house.sigil,
                    }}
                    onNavigate={onNavigate}
                  >
                    {document.house.name}
                  </WikiHoverCard>
                </InfoRow>
              )}

              <InfoRow label="Status">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      document.status === 'Alive'
                        ? 'bg-emerald-400 animate-pulse'
                        : document.status === 'Resurrected'
                        ? 'bg-cyan-400'
                        : 'bg-red-500'
                    }`}
                  />
                  <span>{document.status}</span>
                </span>
              </InfoRow>

              {document.born && <InfoRow label="Born">{document.born}</InfoRow>}
              {document.died && <InfoRow label="Died">{document.died}</InfoRow>}
              {document.culture && <InfoRow label="Culture">{document.culture}</InfoRow>}

              {/* Family Lineage Relations */}
              {(document.father || document.mother || document.spouse || (document.children && document.children.length > 0)) && (
                <>
                  <SectionHeader title="Family & Dynasty" icon={<Heart className="w-3 h-3" />} />

                  {document.father && (
                    <InfoRow label="Father">
                      <WikiHoverCard
                        data={{
                          _id: document.father._id,
                          _type: 'character',
                          name: document.father.name,
                          slug: getDocSlug(document.father),
                        }}
                        onNavigate={onNavigate}
                      >
                        {document.father.name}
                      </WikiHoverCard>
                    </InfoRow>
                  )}

                  {document.mother && (
                    <InfoRow label="Mother">
                      <WikiHoverCard
                        data={{
                          _id: document.mother._id,
                          _type: 'character',
                          name: document.mother.name,
                          slug: getDocSlug(document.mother),
                        }}
                        onNavigate={onNavigate}
                      >
                        {document.mother.name}
                      </WikiHoverCard>
                    </InfoRow>
                  )}

                  {document.spouse && (
                    <InfoRow label="Spouse">
                      <WikiHoverCard
                        data={{
                          _id: document.spouse._id,
                          _type: 'character',
                          name: document.spouse.name,
                          slug: getDocSlug(document.spouse),
                        }}
                        onNavigate={onNavigate}
                      >
                        {document.spouse.name}
                      </WikiHoverCard>
                    </InfoRow>
                  )}

                  {document.children && document.children.length > 0 && (
                    <InfoRow label="Issue">
                      <ul className="space-y-1">
                        {document.children.map((child) => (
                          <li key={child._id}>
                            <WikiHoverCard
                              data={{
                                _id: child._id,
                                _type: 'character',
                                name: child.name,
                                slug: getDocSlug(child),
                              }}
                              onNavigate={onNavigate}
                            >
                              {child.name}
                            </WikiHoverCard>
                          </li>
                        ))}
                      </ul>
                    </InfoRow>
                  )}
                </>
              )}
            </>
          )}

          {/* House Specific Details */}
          {isHouse && (
            <>
              <SectionHeader title="Heraldry & Lineage" icon={<Shield className="w-3 h-3" />} />
              <InfoRow label="Words / Motto">
                <span className="italic font-serif text-amber-300">"{document.motto}"</span>
              </InfoRow>
              <InfoRow label="Seat of Power">
                {document.seat ? (
                  <WikiHoverCard
                    data={{
                      _id: document.seat._id,
                      _type: 'location',
                      name: document.seat.name,
                      slug: getDocSlug(document.seat),
                    }}
                    onNavigate={onNavigate}
                  >
                    {document.seat.name}
                  </WikiHoverCard>
                ) : (
                  'Unknown'
                )}
              </InfoRow>
              <InfoRow label="Region">{document.region}</InfoRow>
              {document.ancestralWeapon && (
                <InfoRow label="Ancestral Relic">
                  <span className="flex items-center gap-1 text-amber-200">
                    <Sword className="w-3 h-3 text-amber-400" />
                    {document.ancestralWeapon}
                  </span>
                </InfoRow>
              )}
              {document.founder && <InfoRow label="Founder">{document.founder}</InfoRow>}
              {document.overlord && <InfoRow label="Overlord">{document.overlord}</InfoRow>}
            </>
          )}

          {/* Location Specific Details */}
          {isLocation && (
            <>
              <SectionHeader title="Geographical Annals" icon={<MapPin className="w-3 h-3" />} />
              <InfoRow label="Type">{document.locationType}</InfoRow>
              <InfoRow label="Region">{document.region}</InfoRow>
              {document.ruler && (
                <InfoRow label="Ruler / Steward">
                  <WikiHoverCard
                    data={{
                      _id: document.ruler._id,
                      _type: document.ruler._type as WikiDocType,
                      name: document.ruler.name,
                      slug: getDocSlug(document.ruler),
                    }}
                    onNavigate={onNavigate}
                  >
                    {document.ruler.name}
                  </WikiHoverCard>
                </InfoRow>
              )}
              {document.notableLocations && document.notableLocations.length > 0 && (
                <InfoRow label="Landmarks">
                  <ul className="space-y-1">
                    {document.notableLocations.map((site, i) => (
                      <li key={i} className="text-neutral-300">
                        • {site}
                      </li>
                    ))}
                  </ul>
                </InfoRow>
              )}
            </>
          )}

          {/* Event Specific Details */}
          {isEvent && (
            <>
              <SectionHeader title="Chronicle Details" icon={<Flag className="w-3 h-3" />} />
              <InfoRow label="Date / Year">{document.date}</InfoRow>
              {document.location && (
                <InfoRow label="Location">
                  <WikiHoverCard
                    data={{
                      _id: document.location._id,
                      _type: 'location',
                      name: document.location.name,
                      slug: getDocSlug(document.location),
                    }}
                    onNavigate={onNavigate}
                  >
                    {document.location.name}
                  </WikiHoverCard>
                </InfoRow>
              )}
              <InfoRow label="Outcome">
                <span className="text-amber-200 font-medium">{document.outcome}</span>
              </InfoRow>
              {document.involvedParties && document.involvedParties.length > 0 && (
                <InfoRow label="Parties">
                  <ul className="space-y-1.5">
                    {document.involvedParties.map((party) => (
                      <li key={party._id}>
                        <WikiHoverCard
                          data={{
                            _id: party._id,
                            _type: party._type as WikiDocType,
                            name: party.name,
                            slug: getDocSlug(party),
                          }}
                          onNavigate={onNavigate}
                        >
                          {party.name}
                        </WikiHoverCard>
                        {party.side && (
                          <span className="block text-[10px] text-neutral-400 italic">
                            ({party.side})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </InfoRow>
              )}
            </>
          )}
        </tbody>
      </table>

      {/* Footer stamp */}
      <div className="p-2.5 bg-neutral-950/80 border-t border-neutral-800 text-center">
        <span className="text-[10px] text-neutral-500 font-mono">
          Archived in Winds of Life • Sanity ID: {document._id}
        </span>
      </div>
    </aside>
  );
};
