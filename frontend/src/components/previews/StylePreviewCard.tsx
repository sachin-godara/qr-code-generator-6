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
      className={`group relative w-full min-w-0 flex flex-col items-center justify-start p-1.5 gap-1.5 rounded-xl border transition-all duration-200 touch-press select-spring
        min-h-[60px] sm:min-h-0
        ${isSelected 
          ? 'border-primary ring-2 ring-primary/20 bg-primary/[0.04] scale-[1.02] shadow-sm' 
          : 'border-transparent surface-ring-interactive bg-surface-container-lowest hover:bg-surface-container/60 active:scale-[0.97]'
        }
      `}
    >
      {/* Selected Indicator — small, clean checkmark */}
      {isSelected && (
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center shadow-sm z-20">
          <span className="material-symbols-outlined text-[10px] font-bold">check</span>
        </div>
      )}

      {/* Preview Container */}
      <div className={`w-full aspect-square rounded-lg flex items-center justify-center overflow-hidden relative transition-colors duration-200
        ${isSelected ? 'bg-primary/[0.03]' : 'bg-white group-hover:bg-zinc-50/50'}
      `}>
         <div className="relative z-10 w-full h-full flex items-center justify-center p-0.5">
           {children}
         </div>
      </div>

      {/* Title */}
      <span className={`text-[9px] sm:text-[10px] font-medium text-center w-full px-1 capitalize transition-colors duration-200 leading-tight whitespace-normal break-words h-7 flex items-center justify-center
        ${isSelected ? 'text-primary font-semibold' : 'text-zinc-500 group-hover:text-zinc-700'}
      `}>
        {title.replace(/_/g, ' ')}
      </span>
    </button>
  );
}
