/**
 * QRGeneratorApp.tsx — Astro client island wrapper
 * 
 * This wraps the existing App component with QueryClientProvider
 * so it can be mounted as a React island inside Astro pages via:
 *   <QRGeneratorApp client:load locale={locale} initialContentType="wifi" />
 * 
 * Prevents SSG state bleed across pages during multi-page builds
 * by explicitly resetting both contentType and initialTab.
 */
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { ErrorBoundary } from "./ErrorBoundary";
import { TranslationProvider } from "@/i18n/useTranslation";
import { useQRStore } from "@/store/useQRStore";
import { type QRContentType } from "@/types/qr";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: false,
    },
  },
});

export interface QRGeneratorAppProps {
  locale?: string;
  initialContentType?: QRContentType;
  initialTab?: string;
}

export default function QRGeneratorApp({ 
  locale = 'en',
  initialContentType = 'url',
  initialTab = 'Content'
}: QRGeneratorAppProps) {
  // CRITICAL (Astro SSG): Synchronously reset the store state on every render
  // so that single-process Node.js compilation never bleeds state between pages.
  useQRStore.setState((state) => ({
    ...state,
    settings: {
      ...state.settings,
      contentType: initialContentType,
      contentData: initialContentType === 'url' ? (state.settings.contentData || 'https://example.com') : ''
    }
  }));

  return (
    <ErrorBoundary>
      <TranslationProvider locale={locale}>
        <QueryClientProvider client={queryClient}>
          <App 
            initialContentType={initialContentType}
            initialTab={initialTab}
          />
        </QueryClientProvider>
      </TranslationProvider>
    </ErrorBoundary>
  );
}
