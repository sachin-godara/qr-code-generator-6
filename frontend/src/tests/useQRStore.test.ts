import { describe, it, expect, beforeEach } from 'vitest'
import { useQRStore } from '../store/useQRStore'
import { defaultSettings } from '../types/qr'

describe('useQRStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useQRStore.setState({
      settings: { ...defaultSettings },
      history: [{ ...defaultSettings }],
      historyIndex: 0,
    })
  })

  it('initializes with default settings', () => {
    const state = useQRStore.getState()
    expect(state.settings.contentData).toBe('https://example.com')
    expect(state.settings.error_correction).toBe('H')
  })

  it('updates a specific setting and saves to history', () => {
    const { updateSettings } = useQRStore.getState()
    updateSettings({ contentData: 'https://vitest.dev', dots_color: '#123456' })
    
    const newState = useQRStore.getState()
    expect(newState.settings.contentData).toBe('https://vitest.dev')
    expect(newState.settings.dots_color).toBe('#123456')
    expect(newState.history.length).toBe(2)
    expect(newState.historyIndex).toBe(1)
  })

  it('supports undo and redo', () => {
    const { updateSettings, undo, redo } = useQRStore.getState()
    
    updateSettings({ dots_color: '#ff0000' })
    expect(useQRStore.getState().settings.dots_color).toBe('#ff0000')
    
    undo()
    expect(useQRStore.getState().settings.dots_color).toBe(defaultSettings.dots_color)
    expect(useQRStore.getState().historyIndex).toBe(0)
    
    redo()
    expect(useQRStore.getState().settings.dots_color).toBe('#ff0000')
    expect(useQRStore.getState().historyIndex).toBe(1)
  })
})
