import React from "react";

export const ScannabilityAlert = ({ show, message, compact = false }: { show: boolean, message: React.ReactNode, compact?: boolean }) => {
  if (!show) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-1 mt-1">
        <div className="w-1 h-1 rounded-full bg-amber-500 shrink-0"></div>
        <p className="text-[9px] font-medium text-amber-600 dark:text-amber-500">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start bg-primary/5 border border-primary/20 rounded-xl gap-3 p-4 mt-3 shadow-sm">
      <div className="bg-primary/10 p-1.5 rounded-lg shrink-0 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-[18px]">
          tune
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold text-primary dark:text-primary">
          Scannability Warning
        </p>
        <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
};
