'use client';

import React from 'react';
import { FamilyTreeFlow } from '@/src/components/wiki/FamilyTreeFlow';
import { useRouter } from 'next/navigation';

export default function FamilyTreePage() {
  const router = useRouter();

  const handleSelectCharacter = (slug: string) => {
    router.push(`/wiki/characters/${slug}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-5rem)] flex flex-col">
      <FamilyTreeFlow onSelectCharacter={handleSelectCharacter} />
    </div>
  );
}
