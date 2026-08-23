/**
 * QRGeneratorApp.tsx — Astro client island wrapper
 * 
 * This wraps the existing App component with QueryClientProvider
 * so it can be mounted as a React island inside Astro pages via:
 *   <QRGeneratorApp client:load />
 * 
 * All React logic, state management, and API calls remain identical
 * to the original Vite SPA.
 */
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { ErrorBoundary } from "./ErrorBoundary";
import { TranslationProvider } from "@/i18n/useTranslation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: false,
    },
  },
});

interface QRGeneratorAppProps {
  locale?: string;
}

export default function QRGeneratorApp({ locale = 'en' }: QRGeneratorAppProps) {
  return (
    <ErrorBoundary>
      <TranslationProvider locale={locale}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </TranslationProvider>
    </ErrorBoundary>
  );
}
