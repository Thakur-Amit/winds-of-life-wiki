import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FamilyTreeNodeData } from '../../types/wiki';
import { Crown, Skull, Shield } from 'lucide-react';

export const FamilyTreeNode = memo(({ data }: { data: FamilyTreeNodeData & { onSelect: (slug: string) => void } }) => {
  const isDeceased = data.status === 'Deceased';
  const isResurrected = data.status === 'Resurrected';

  return (
    <div
      onClick={() => data.onSelect(data.slug)}
      className="group relative w-64 bg-neutral-900/95 hover:bg-neutral-850 rounded-xl border border-neutral-700/80 hover:border-amber-500/80 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-200 cursor-pointer overflow-hidden p-3"
    >
      {/* Top Handle for Parent Inflow */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-amber-500 !border-2 !border-neutral-900 transition-transform group-hover:scale-125"
      />

      {/* Decorative top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        data.house.includes('Stark') ? 'bg-gradient-to-r from-slate-400 via-neutral-200 to-slate-500' :
        data.house.includes('Targaryen') ? 'bg-gradient-to-r from-red-600 via-amber-500 to-red-600' :
        'bg-amber-600'
      }`} />

      <div className="flex items-center gap-3">
        {/* Avatar Portrait */}
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-neutral-700 shrink-0 bg-neutral-950">
          <img
            src={data.avatar}
            alt={data.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
          />
          {isDeceased && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Skull className="w-4 h-4 text-neutral-400/80" />
            </div>
          )}
        </div>

        {/* Name & House */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-sm font-bold text-neutral-100 group-hover:text-amber-300 font-serif-title truncate transition-colors">
              {data.name}
            </h4>
          </div>

          <p className="text-[11px] text-amber-400/90 font-mono truncate">
            {data.role || (data.titles && data.titles[0]) || data.house}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider ${
                isDeceased
                  ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                  : isResurrected
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              {data.status}
            </span>

            {data.born && (
              <span className="text-[10px] text-neutral-500 font-mono">
                {data.born.split(',')[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Click prompt */}
      <div className="mt-2 text-[10px] text-amber-500/70 group-hover:text-amber-400 font-medium text-right transition-colors">
        Click to view article →
      </div>

      {/* Bottom Handle for Children Outflow */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-amber-500 !border-2 !border-neutral-900 transition-transform group-hover:scale-125"
      />
    </div>
  );
});

FamilyTreeNode.displayName = 'FamilyTreeNode';
