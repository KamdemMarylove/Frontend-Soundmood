<script setup lang="ts">
import { ref } from 'vue'

interface Song {
  title: string
  artist: string
  mood: string
}

const moods = ['happy', 'sad', 'energetic', 'relaxed', 'holy', 'outgoing']
const selectedMood = ref('')
const songs = ref<Song[]>([])

const fetchSongsByMood = async () => {
  if (!selectedMood.value) return
  try {
    const response = await fetch(`https://soundmood-webtech-6.onrender.com/songs?mood=${selectedMood.value}`)
    const fetchedSongs = await response.json()
    songs.value = fetchedSongs

    if (fetchedSongs.length > 0) {
      await saveMoodEntry(selectedMood.value, fetchedSongs[0])
    }
  } catch (error) {
    console.error('Fehler beim Laden der Songs:', error)
  }
}

const saveMoodEntry = async (mood: string, song: Song) => {
  try {
    await fetch('https://soundmood-webtech-6.onrender.com/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, song })
    })
    console.log("Mood gespeichert:", mood)
  } catch (error) {
    console.error("Fehler beim Speichern des Mood-Entries:", error)
  }
}
</script>

<template>
  <div class="container">
    <h2>Wie fühlst du dich heute?</h2>
    <div class="button-group">
      <button
        v-for="mood in moods"
        :key="mood"
        @click="selectedMood = mood; fetchSongsByMood()"
        :class="{ active: selectedMood === mood }"
      >
        {{ mood }}
      </button>
    </div>

    <section v-if="songs.length > 0">
      <h3>🎧 Passende Songs für "{{ selectedMood }}"</h3>
      <ul>
        <li v-for="song in songs" :key="song.title">
          {{ song.title }} von {{ song.artist }}
        </li>
      </ul>
    </section>

    <p v-else-if="selectedMood">Keine Songs gefunden für "{{ selectedMood }}".</p>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  background-color: #eee;
  cursor: pointer;
  transition: 0.2s;
}

button.active {
  background-color: #00c3ff;
  color: white;
}

button:hover {
  background-color: #ccc;
}

ul {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  font-size: 1.1rem;
}

li {
  margin-bottom: 0.5rem;
}
</style>
