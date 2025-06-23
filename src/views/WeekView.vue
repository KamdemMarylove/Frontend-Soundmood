<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface MoodEntry {
  date: string
  mood: string
  song: {
    title: string
    artist: string
  }
}

const weekEntries = ref<MoodEntry[]>([])

const getDayName = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('de-DE', { weekday: 'long' })
}

const fetchWeekEntries = async () => {
  try {
    const res = await fetch('https://soundmood-webtech-6.onrender.com/entries/week')
    weekEntries.value = await res.json()
  } catch (err) {
    console.error('Fehler beim Laden der Wochenstimmungen:', err)
  }
}

onMounted(() => {
  fetchWeekEntries()
})
</script>

<template>
  <div class="week">
    <h2>🗓 Deine Stimmungen dieser Woche</h2>
    <ul v-if="weekEntries.length">
      <li v-for="entry in weekEntries" :key="entry.date">
        {{ getDayName(entry.date) }} – {{ entry.mood }} – {{ entry.song.title }} ({{ entry.song.artist }})
      </li>
    </ul>
    <p v-else>Keine Einträge für diese Woche.</p>
  </div>
</template>

<style scoped>
.week {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

li {
  margin: 0.5rem 0;
}
</style>
