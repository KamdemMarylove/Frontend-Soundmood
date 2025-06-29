import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '@/views/HomeView.vue'

describe('Home.vue', () => {
  // globaler Fetch-Mock
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()

    // fetch global mocken + Rückgabe definieren
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            title: 'Mock Song',
            artist: 'Mock Artist',
            mood: 'happy'
          }
        ])
    })

    vi.stubGlobal('fetch', mockFetch)
  })


  it('renders mood selection buttons', () => {
    const wrapper = mount(Home)

    const buttons = wrapper.findAll('button')
    const moodButtons = buttons.filter(btn =>
      ['happy', 'sad', 'energetic', 'relaxed', 'outgoing'].includes(btn.text())
    )

    expect(moodButtons).toHaveLength(5)
  })

  it('displays question "Wie fühlst du dich heute?"', () => {
    const wrapper = mount(Home)
    expect(wrapper.find('h2').text()).toBe('Wie fühlst du dich heute?')
  })

  it('toggles suggestion form visibility', async () => {
    const wrapper = mount(Home)

    const suggestButton = wrapper.findAll('button').find(btn =>
      btn.text().includes('Hilf uns mit deinem Vorschlag')
    )

    expect(wrapper.find('form').exists()).toBe(false)

    if (suggestButton) {
      await suggestButton.trigger('click')
      expect(wrapper.find('form').exists()).toBe(true)

      await suggestButton.trigger('click')
      expect(wrapper.find('form').exists()).toBe(false)
    }
  })


})
