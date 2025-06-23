<script setup lang="ts">
import { ref } from 'vue'

interface Song {
  title: string
  artist: string
  mood: string
}

const moods = ['happy', 'sad', 'energetic', 'relaxed', 'outgoing']
const selectedMood = ref('')
const songs = ref<Song[]>([])

const showForm = ref(false)
const newSuggestion = ref({ title: '', artist: '' })
const newSuggestionMood = ref('happy')

// Songs passend zur Stimmung vom Backend holen
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

// Stimmung + Song abspeichern
const saveMoodEntry = async (mood: string, song: Song) => {
  try {
    await fetch('https://soundmood-webtech-6.onrender.com/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, song })
    })
  } catch (error) {
    console.error("Fehler beim Speichern des Mood-Entries:", error)
  }
}

// Songvorschlag absenden
const submitSuggestion = async () => {
  try {
    await fetch('https://soundmood-webtech-6.onrender.com/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newSuggestion.value.title,
        artist: newSuggestion.value.artist,
        mood: newSuggestionMood.value
      })
    })
    alert('Danke für deinen Vorschlag!')
    newSuggestion.value = { title: '', artist: '' }
    newSuggestionMood.value = 'happy'
    showForm.value = false
  } catch (error) {
    console.error('Fehler beim Vorschlag-Senden:', error)
  }
}
</script>

<template>
  <div class="container">
    <h2>🎵 Wie fühlst du dich heute?</h2>

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
      <h3>🎧 Songs für "{{ selectedMood }}"</h3>
      <ul>
        <li v-for="song in songs" :key="song.title">
          {{ song.title }} von {{ song.artist }}
        </li>
      </ul>
    </section>

    <p v-else-if="selectedMood">Keine Songs gefunden für "{{ selectedMood }}".</p>

    <hr />

    <section>
      <button @click="showForm = !showForm">
        {{ showForm ? 'Abbrechen' : 'Hilf uns mit einem Songvorschlag!' }}
      </button>

      <form v-if="showForm" @submit.prevent="submitSuggestion">
        <input v-model="newSuggestion.title" placeholder="Songtitel" required />
        <input v-model="newSuggestion.artist" placeholder="Künstler" required />
        <select v-model="newSuggestionMood">
          <option v-for="m in moods" :key="m" :value="m">{{ m }}</option>
        </select>
        <button type="submit">Absenden</button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
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
  min-width: 100px;
  font-weight: bold;
  text-transform: capitalize;
}

button.active {
  background-color: #00c3ff;
  color: white;
}

button:hover {
  background-color: #ccc;
}

form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

input, select {
  padding: 0.5rem;
  width: 250px;
  font-size: 1rem;
}

ul {
  list-style: none;
  padding: 0;
  font-size: 1.1rem;
  margin-top: 1rem;
}

li {
  margin-bottom: 0.5rem;
}
</style>
