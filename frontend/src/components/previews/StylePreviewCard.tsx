import React from 'react';

interface StylePreviewCardProps {
  title: string;
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function StylePreviewCard({ title, isSelected, onClick, children }: StylePreviewCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex-shrink-0 w-[4.5rem] sm:w-24 md:w-28 flex flex-col items-center justify-start p-1.5 gap-1.5 rounded-2xl border-2 transition-all duration-200 snap-center touch-press
        min-h-[60px] sm:min-h-0
        ${isSelected 
          ? 'border-primary bg-primary/[0.03] shadow-[0_0_15px_rgba(0,80,203,0.3)] scale-[1.02]' 
          : 'border-outline-variant bg-surface hover:bg-surface-container-high hover:border-primary/50 hover:shadow-md hover:scale-[1.04] active:scale-95'
        }
      `}
    >
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center shadow-md z-20 transition-transform">
          <span className="material-symbols-outlined text-[12px] font-bold">check</span>
        </div>
      )}

      {/* Preview Container */}
      <div className={`w-full aspect-square rounded-xl flex items-center justify-center shadow-sm overflow-hidden relative transition-colors duration-200
        ${isSelected ? 'bg-primary/[0.04] border border-primary/30' : 'bg-white border border-outline-variant/30 group-hover:border-primary/30'}
      `}>
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#0050cb 1px, transparent 1px)", backgroundSize: "8px 8px" }}></div>
         <div className="relative z-10 w-full h-full flex items-center justify-center p-0.5">
           {children}
         </div>
      </div>

      {/* Title */}
      <span className={`text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-center w-full truncate px-0.5 capitalize transition-colors duration-200 leading-tight
        ${isSelected ? 'text-primary' : 'text-on-surface group-hover:text-primary'}
      `}>
        {title.replace(/_/g, ' ')}
      </span>
    </button>
  );
}
