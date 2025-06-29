import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Week from '@/views/WeekView.vue'
import WeekView from '@/views/WeekView.vue'

// Mock Chart.js
vi.mock('vue-chartjs', () => ({
  Bar: {
    name: 'Bar',
    template: '<div data-testid="bar-chart">Mock Bar Chart</div>',
    props: ['data', 'options']
  }
}))

vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn()
  },
  Title: {},
  Tooltip: {},
  Legend: {},
  BarElement: {},
  CategoryScale: {},
  LinearScale: {}
}))

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('WeekView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockClear()
  })

  it('renders week view title', () => {
    const wrapper = mount(WeekView)
    expect(wrapper.find('h2').text()).toBe('🗓 Deine Stimmungen dieser Woche')
  })

  it('renders bar chart component', () => {
    const wrapper = mount(WeekView)
    expect(wrapper.find('[data-testid="bar-chart"]').exists()).toBe(true)
  })

  it('fetches week entries on mount', async () => {
    const mockEntries = [
      {
        id: 1,
        date: '2023-12-01',
        mood: 'happy',
        liked: false,
        song: { title: 'Test Song', artist: 'Test Artist' }
      }
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockEntries])
    })

    mount(WeekView)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/entries/week')
    )
  })

  it('toggles song list visibility', async () => {
    const wrapper = mount(Week)

    const toggleButton = wrapper.find('.toggle-button')
    expect(toggleButton.text()).toBe('Songs der Woche anzeigen')

    await toggleButton.trigger('click')
    expect(toggleButton.text()).toBe('Songs verbergen')
  })




})
