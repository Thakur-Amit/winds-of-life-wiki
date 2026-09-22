import React, { useState } from 'react';
import { FamilyTreeFlow } from './FamilyTreeFlow';
import { WikiFooter } from './WikiFooter';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { HOUSES_LIST } from '../../data/familyTreeData';

interface FamilyTreePageProps {
  onNavigate: (route: string, type?: string, slug?: string) => void;
}

export const FamilyTreePage: React.FC<FamilyTreePageProps> = ({ onNavigate }) => {
  const [selectedHouseId, setSelectedHouseId] = useState<string>('stark');

  const houseName = HOUSES_LIST.find((h) => h.id === selectedHouseId)?.name || 'House Stark';

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans">
      {/* Breadcrumb Navigation Bar */}
      <div className="bg-neutral-925/80 border-b border-neutral-850 px-4 sm:px-6 lg:px-8 py-3 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-neutral-400 font-mono">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-amber-300 transition-colors"
            >
              Winds of Life
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-amber-400 font-semibold font-serif">
              {houseName} Lineage & Family Tree
            </span>
          </nav>

          <button
            onClick={() => onNavigate('characters')}
            className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Characters</span>
          </button>
        </div>
      </div>

      {/* Main Family Tree Flow Graph */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        <div className="flex-1 min-h-[720px] flex flex-col">
          <FamilyTreeFlow
            selectedHouseId={selectedHouseId}
            onSelectHouseId={setSelectedHouseId}
            onSelectCharacter={(slug) => {
              onNavigate('wiki', 'character', slug);
            }}
          />
        </div>
      </main>

      {/* Footer */}
      <WikiFooter onNavigate={onNavigate} />
    </div>
  );
};
