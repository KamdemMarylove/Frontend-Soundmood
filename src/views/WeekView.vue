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

// Registrierung der ChartJS-Komponenten
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// ✨ TypeScript Interface MIT id-Feld
interface MoodEntry {
  id: number
  date: string
  mood: string
  song: {
    title: string
    artist: string
  }
}

const weekEntries = ref<MoodEntry[]>([])
const moodCounts = ref<Record<string, number>>({})

// Daten vom Backend holen
const fetchWeekEntries = async () => {
  try {
    const res = await fetch('https://soundmood-webtech-6.onrender.com/entries/week')
    const data: MoodEntry[] = await res.json()
    weekEntries.value = data

    const counts: Record<string, number> = {}
    data.forEach(entry => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1
    })
    moodCounts.value = counts
  } catch (err) {
    console.error('Fehler beim Laden:', err)
  }
}
onMounted(fetchWeekEntries)

// Daten für Diagramm vorbereiten
const chartData = computed(() => ({
  labels: Object.keys(moodCounts.value),
  datasets: [{
    label: 'Stimmungen diese Woche',
    backgroundColor: '#ff6b9e',
    data: Object.values(moodCounts.value)
  }]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Deine Stimmungsauswertung 🧠'
    }
  }
}
</script>

<template>
  <div class="week">
    <h2>🗓 Wochenübersicht</h2>

    <Bar :data="chartData" :options="chartOptions" />

    <ul>
      <li v-for="entry in weekEntries" :key="entry.id">
        {{ new Date(entry.date).toLocaleDateString('de-DE') }} –
        <strong>{{ entry.mood }}</strong> –
        {{ entry.song.title }} von {{ entry.song.artist }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.week {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

ul {
  text-align: left;
  margin-top: 2rem;
  font-size: 1rem;
  list-style: none;
  padding: 0;
}
</style>
