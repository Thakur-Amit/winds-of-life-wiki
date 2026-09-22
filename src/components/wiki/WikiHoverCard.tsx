import React from 'react';
import { HoverCardLink, HoverLinkItemData } from './HoverCardLink';
import { WikiDocType, CharacterStatus } from '../../types/wiki';

export type HoverCardData = HoverLinkItemData;

interface WikiHoverCardProps {
  children: React.ReactNode;
  data: HoverCardData;
  onNavigate: (type: WikiDocType, slug: string) => void;
}

export const WikiHoverCard: React.FC<WikiHoverCardProps> = ({ children, data, onNavigate }) => {
  return (
    <HoverCardLink data={data} onNavigate={onNavigate}>
      {children}
    </HoverCardLink>
  );
};

export { HoverCardLink };
export default WikiHoverCard;
