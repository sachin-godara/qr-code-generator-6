import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../react/App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

describe('App Component', () => {
  it('renders the main title', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    )
    expect(screen.getByText(/QRStream/i)).toBeInTheDocument()
  })
})
