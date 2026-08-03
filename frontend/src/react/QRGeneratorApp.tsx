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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function QRGeneratorApp() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
