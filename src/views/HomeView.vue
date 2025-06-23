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

const showForm = ref(false)
const newSuggestion = ref({ title: '', artist: '' })
const newSuggestionMood = ref('happy')

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
  } catch (error) {
    console.error("Fehler beim Speichern des Mood-Entries:", error)
  }
}

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
  <div class="home">
    <h2>🎵 Wie fühlst du dich heute?</h2>

    <div class="mood-buttons">
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
      <h3>🔊 Passende Songs für "{{ selectedMood }}"</h3>
      <ul class="song-list">
        <li v-for="song in songs" :key="song.title">
          <strong>{{ song.title }}</strong> von {{ song.artist }}
        </li>
      </ul>
    </section>

    <p v-else-if="selectedMood" class="empty">Keine Songs gefunden für "{{ selectedMood }}".</p>

    <hr />

    <section class="vorschlag">
      <button @click="showForm = !showForm">
        {{ showForm ? 'Abbrechen' : 'Hilf uns mit einem Songvorschlag!' }}
      </button>

      <form v-if="showForm" @submit.prevent="submitSuggestion">
        <input v-model="newSuggestion.title" placeholder="🎶 Songtitel" required />
        <input v-model="newSuggestion.artist" placeholder="🎤 Künstler" required />
        <select v-model="newSuggestionMood">
          <option v-for="m in moods" :key="m" :value="m">{{ m }}</option>
        </select>
        <button type="submit" class="submit-button">Absenden</button>
      </form>
    </section>
  </div>
</template>

<style scoped>
:root {
  --rosa: #ff6b9e;
  --rosa-dark: #e05589;
  --bg: #fdfdfd;
  --text: #333;
}

.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  color: var(--text);
}

h2, h3 {
  margin-bottom: 1rem;
}

.mood-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

button {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  background-color: var(--rosa);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-width: 110px;
  text-transform: capitalize;
}

button:hover {
  background-color: var(--rosa-dark);
}

button.active {
  background-color: #ff85ad;
}

.song-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.song-list li {
  margin-bottom: 0.7rem;
}

.empty {
  margin-top: 1rem;
  color: #999;
}

form {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

input, select {
  padding: 0.6rem;
  width: 250px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.submit-button {
  background-color: var(--rosa);
  color: white;
}

hr {
  margin: 3rem 0 2rem;
  border: none;
  border-top: 1px solid #eee;
}
</style>
