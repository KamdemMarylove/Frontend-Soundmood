<script setup lang="ts">
import { ref } from 'vue'

interface Song {
  title: string
  artist: string
  mood: string
}

const moods = ['happy', 'sad', 'relaxed', 'energetic', 'outgoing']
const selectedMood = ref('')
const songs = ref<Song[]>([])

const fetchSongsByMood = async () => {
  if (!selectedMood.value) return

  try {
    const response = await fetch(`https://soundmood-webtech-6.onrender.com/songs?mood=${selectedMood.value}`)
    songs.value = await response.json()
  } catch (error) {
    console.error('Fehler beim Laden der Songs:', error)
  }
}
</script>

<template>
  <header>
    <h1>🎵 Welcher Song passt zu deiner Stimmung?</h1>
  </header>

  <main>
    <section>
      <p>Wie fühlst du dich gerade?</p>
      <div class="mood-buttons">
        <button v-for="mood in moods" :key="mood" @click="selectedMood = mood; fetchSongsByMood()">
          {{ mood }}
        </button>
      </div>
    </section>

    <section v-if="songs.length > 0">
      <h2>Vorgeschlagene Songs für "{{ selectedMood }}"</h2>
      <ul>
        <li v-for="song in songs" :key="song.title">
          🎧 {{ song.title }} – {{ song.artist }}
        </li>
      </ul>
    </section>

    <section v-else-if="selectedMood">
      <p>Keine Songs gefunden für "{{ selectedMood }}".</p>
    </section>
  </main>
</template>

<style scoped>
header {
  text-align: center;
  margin: 2rem 0;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mood-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1rem 0;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #369870;
}

ul {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

li {
  margin-bottom: 0.5rem;
}
</style>
