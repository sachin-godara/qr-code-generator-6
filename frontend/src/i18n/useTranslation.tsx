import React, { createContext, useContext, useMemo } from 'react';
import { defaultLocale, locales, localeConfig, type Locale, isValidLocale } from './config';
import { dictionaries, t as translateFunction } from './utils';

interface TranslationContextType {
  locale: Locale;
  t: (key: string, params?: Record<string, string | number>, fallback?: string) => string;
  dict: (typeof dictionaries)[Locale];
}

const TranslationContext = createContext<TranslationContextType>({
  locale: defaultLocale,
  t: (key: string, params?: Record<string, string | number>, fallback?: string) => translateFunction(defaultLocale, key, params, fallback),
  dict: dictionaries[defaultLocale],
});

export interface TranslationProviderProps {
  locale?: string;
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  locale = defaultLocale,
  children,
}) => {
  const currentLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;

  const value = useMemo(() => {
    return {
      locale: currentLocale,
      t: (key: string, params?: Record<string, string | number>, fallback?: string) =>
        translateFunction(currentLocale, key, params, fallback),
      dict: dictionaries[currentLocale] || dictionaries[defaultLocale],
    };
  }, [currentLocale]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export function useTranslation() {
  const context = useContext(TranslationContext);
  return context;
}
