<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Song {
  title: string
  artist: string
  mood: string
}

const moods = ['happy', 'sad', 'relaxed', 'energetic', 'outgoing']
const selectedMood = ref('')
const songs = ref<Song[]>([])

const showForm = ref(false)
const newSuggestion = ref({ title: '', artist: '' })
const newSuggestionMood = ref('happy') // dropdown-Auswahl

// Stimmungseintrag speichern
const saveMoodEntry = async (mood: string, song: Song) => {
  try {
    await fetch('https://soundmood-webtech-6.onrender.com/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mood: mood,
        song: song
      })
    })
    console.log("Mood gespeichert:", mood)
  } catch (error) {
    console.error("Fehler beim Speichern des Mood-Entries:", error)
  }
}

// Songs fetchen
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

// Vorschlag senden
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
    alert('Danke für deinen Vorschlag! 🎉')
    newSuggestion.value = { title: '', artist: '' }
    newSuggestionMood.value = 'happy'
    showForm.value = false
  } catch (error) {
    console.error('Fehler beim Vorschlag-Senden:', error)
  }
}

// Beim Laden: automatisch "happy" laden
onMounted(() => {
  selectedMood.value = 'happy'
  fetchSongsByMood()
})
</script>

<template>
  <header>
    <h1>🎵 SoundMood – Finde deinen Song zur Stimmung</h1>
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
      <h2>🎧 Vorschläge für "{{ selectedMood }}"</h2>
      <ul>
        <li v-for="song in songs" :key="song.title">
          {{ song.title }} – {{ song.artist }}
        </li>
      </ul>
    </section>

    <section v-else-if="selectedMood">
      <p>Keine Songs gefunden für "{{ selectedMood }}".</p>
    </section>

    <hr />

    <section>
      <button @click="showForm = !showForm" class="suggestion-toggle">
        Hilf uns, unsere App zu verbessern – schick uns Songvorschläge!
      </button>

      <form v-if="showForm" @submit.prevent="submitSuggestion">
        <input v-model="newSuggestion.title" placeholder="Songtitel" required />
        <input v-model="newSuggestion.artist" placeholder="Künstler" required />
        <select v-model="newSuggestionMood" required>
          <option v-for="mood in moods" :key="mood" :value="mood">
            {{ mood }}
          </option>
        </select>
        <button type="submit">Vorschlag senden</button>
      </form>
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
  padding: 0 1rem;
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

.suggestion-toggle {
  margin-top: 2rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  max-width: 300px;
  width: 100%;
}

input, select {
  padding: 0.5rem;
  font-size: 1rem;
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
