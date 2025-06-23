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

const weekEntries = ref<MoodEntry[]>([])
const moodCounts = ref<Record<string, number>>({})

const getDayName = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('de-DE', { weekday: 'long' })
}

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
    console.error('Fehler beim Laden der Wochenstimmungen:', err)
  }
}

onMounted(fetchWeekEntries)

const chartData = computed(() => ({
  labels: Object.keys(moodCounts.value),
  datasets: [{
    label: 'Stimmungen diese Woche',
    backgroundColor: '#ff9ccf',
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
    <h2>🗓 Deine Stimmungen dieser Woche</h2>

    <Bar :data="chartData" :options="chartOptions" />

    <ul v-if="weekEntries.length">
      <li v-for="entry in weekEntries" :key="entry.date">
        {{ getDayName(entry.date) }} – <strong>{{ entry.mood }}</strong> – {{ entry.song.title }} ({{ entry.song.artist }})
      </li>
    </ul>
    <p v-else>Keine Einträge für diese Woche.</p>
  </div>
</template>

<style scoped>
.week {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

ul {
  margin-top: 2rem;
  text-align: left;
  list-style: none;
  padding: 0;
  font-size: 1rem;
}

li {
  margin: 0.5rem 0;
}
</style>
