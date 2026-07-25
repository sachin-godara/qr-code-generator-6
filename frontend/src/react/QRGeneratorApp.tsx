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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

const queryClient = new QueryClient()

export default function QRGeneratorApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}
