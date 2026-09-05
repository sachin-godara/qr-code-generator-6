import React, { useState, useRef, useEffect } from 'react';
import { locales, localeConfig, type Locale } from '../../i18n/config';
import { useTranslation } from '../../i18n/useTranslation';
import { getCleanPathname, getLocalizedUrl } from '../../i18n/utils';

export function FlagIcon({ code }: { code: Locale }) {
  switch (code) {
    case 'en':
      return (
        <svg className="w-4 h-4 rounded-full overflow-hidden shadow-2xs shrink-0 border border-black/10" viewBox="0 0 640 480" aria-hidden="true">
          <path fill="#bd3d44" d="M0 0h640v480H0z"/>
          <path stroke="#fff" strokeWidth="37" d="M0 55h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/>
          <path fill="#192f5d" d="M0 0h260v260H0z"/>
          <circle cx="130" cy="130" r="10" fill="#fff"/>
        </svg>
      );
    case 'es':
      return (
        <svg className="w-4 h-4 rounded-full overflow-hidden shadow-2xs shrink-0 border border-black/10" viewBox="0 0 640 480" aria-hidden="true">
          <path fill="#c60b1e" d="M0 0h640v480H0z"/>
          <path fill="#ffc400" d="M0 120h640v240H0z"/>
        </svg>
      );
    case 'pt':
      return (
        <svg className="w-4 h-4 rounded-full overflow-hidden shadow-2xs shrink-0 border border-black/10" viewBox="0 0 640 480" aria-hidden="true">
          <path fill="#009c3b" d="M0 0h640v480H0z"/>
          <path fill="#ffdf00" d="M320 60l260 180-260 180L60 240z"/>
          <circle cx="320" cy="240" r="85" fill="#002776"/>
        </svg>
      );
    case 'de':
      return (
        <svg className="w-4 h-4 rounded-full overflow-hidden shadow-2xs shrink-0 border border-black/10" viewBox="0 0 640 480" aria-hidden="true">
          <path fill="#000" d="M0 0h640v160H0z"/>
          <path fill="#d00" d="M0 160h640v160H0z"/>
          <path fill="#ffce00" d="M0 320h640v160H0z"/>
        </svg>
      );
    case 'tr':
      return (
        <svg className="w-4 h-4 rounded-full overflow-hidden shadow-2xs shrink-0 border border-black/10" viewBox="0 0 1200 800" aria-hidden="true">
          <rect width="1200" height="800" fill="#e30a17"/>
          <circle cx="425" cy="400" r="200" fill="#fff"/>
          <circle cx="475" cy="400" r="160" fill="#e30a17"/>
          <polygon fill="#fff" points="583.33,400 700.93,438.2 628.24,338.2 628.24,461.8 700.93,361.8"/>
        </svg>
      );
    default:
      return <span className="material-symbols-outlined text-[16px]">language</span>;

  }
}

export function ReactLanguageSwitcher({ className = '' }: { className?: string }) {
  const { t, locale: currentLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentInfo = localeConfig[currentLocale] || localeConfig.en;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTargetUrl = (targetLocale: Locale) => {
    if (typeof window === 'undefined') return targetLocale === 'en' ? '/' : `/${targetLocale}/`;
    const cleanPath = getCleanPathname(window.location.pathname);
    return getLocalizedUrl(targetLocale, cleanPath);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-on-surface bg-surface-container-high/60 hover:bg-surface-container-highest border border-outline-variant/50 hover:border-primary/40 transition-all shadow-xs touch-press focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Change language"
      >
        <FlagIcon code={currentLocale} />
        <span className="font-bold text-on-surface text-xs tracking-wide">{currentInfo.label}</span>
        <span
          className={`material-symbols-outlined text-[16px] text-on-surface-variant transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 border-b border-outline-variant/30">
            {t('nav.language')}
          </div>
          {locales.map((loc) => {
            const info = localeConfig[loc];
            const isCurrent = loc === currentLocale;
            const targetUrl = getTargetUrl(loc);

            return (
              <a
                key={loc}
                href={targetUrl}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                  isCurrent
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-on-surface hover:bg-surface-container hover:text-primary'
                }`}
                role="menuitem"
              >
                <span className="flex items-center gap-2">
                  <FlagIcon code={loc} />
                  <span>{info.name}</span>
                </span>
                {isCurrent && (
                  <span className="material-symbols-outlined text-sm text-primary font-bold">check</span>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
