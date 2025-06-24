<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface MoodEntry {
  date: string
  mood: string
  song: {
    title: string
    artist: string
  }
}

const backendBaseUrl = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080'
  : 'https://soundmood-webtech-6.onrender.com'

const weekEntries = ref<MoodEntry[]>([])
const showList = ref(false)

const fetchWeekEntries = async () => {
  try {
    const res = await fetch(`${backendBaseUrl}/entries/week`)
    weekEntries.value = await res.json()
  } catch (err) {
    console.error('Fehler beim Laden der Wochenstimmungen:', err)
  }
}

const getDayName = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('de-DE', { weekday: 'long' })
}

// Daten für Chart vorbereiten
const moodCounts = computed(() => {
  const counts: Record<string, number> = {}
  weekEntries.value.forEach(e => {
    counts[e.mood] = (counts[e.mood] || 0) + 1
  })
  return counts
})

const chartData = computed(() => ({
  labels: Object.keys(moodCounts.value),
  datasets: [
    {
      label: 'Anzahl pro Stimmung',
      data: Object.values(moodCounts.value),
      backgroundColor: '#ff6b9e'
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: 'Stimmungen der Woche' }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Anzahl'
      }
    }
  }
}

onMounted(() => {
  fetchWeekEntries()
})
</script>

<template>
  <div class="week">
    <h2>🗓 Deine Stimmungen dieser Woche</h2>

    <Bar :data="chartData" :options="chartOptions" />

    <button class="toggle-button" @click="showList = !showList">
      {{ showList ? 'Songs verbergen' : 'Songs der Woche anzeigen' }}
    </button>

    <ul v-if="showList && weekEntries.length > 0">
      <li v-for="entry in weekEntries" :key="entry.date + entry.mood">
        {{ getDayName(entry.date) }} – {{ entry.mood }} – {{ entry.song.title }} ({{ entry.song.artist }})
      </li>
    </ul>

    <p v-else-if="!weekEntries.length">Keine Einträge für diese Woche.</p>
  </div>
</template>

<style scoped>
.week {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 700px;
  margin: 0 auto;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  text-align: center;
}

.toggle-button {
  margin: 2rem auto 1rem;
  padding: 0.6rem 1.2rem;
  background-color: #ffd4e2;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.toggle-button:hover {
  background-color: #ff8cb7;
}

ul {
  margin-top: 1rem;
  list-style: none;
  padding: 0;
  text-align: left;
}

li {
  margin: 0.5rem 0;
}
</style>
