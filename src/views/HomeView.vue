<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Song {
  title: string
  artist: string
  mood: string
}

interface MoodEntry {
  date: string
  mood: string
  liked: boolean
  song: {
    title: string
    artist: string
  }
}

const backendBaseUrl = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080'
  : 'https://soundmood-webtech-6.onrender.com'

const moods = ['happy', 'sad', 'energetic', 'relaxed', 'outgoing']
const selectedMood = ref('')
const songs = ref<Song[]>([])

const showForm = ref(false)
const newSuggestion = ref({ title: '', artist: '' })
const newSuggestionMood = ref('happy')

// Lieblingssongs
const showFavorites = ref(false)
const favoriteEntries = ref<MoodEntry[]>([])

const fetchSongsByMood = async () => {
  if (!selectedMood.value) return
  try {
    const res = await fetch(`${backendBaseUrl}/songs?mood=${selectedMood.value}`)
    const data = await res.json()
    songs.value = data

    if (data.length > 0) {
      await fetch(`${backendBaseUrl}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood.value, song: data[0] })
      })
    }
  } catch (err) {
    console.error('Fehler beim Laden:', err)
  }
}

const submitSuggestion = async () => {
  try {
    await fetch(`${backendBaseUrl}/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newSuggestion.value.title,
        artist: newSuggestion.value.artist,
        mood: newSuggestionMood.value
      })
    })
    alert('Vorschlag gespeichert!')
    newSuggestion.value = { title: '', artist: '' }
    newSuggestionMood.value = 'happy'
    showForm.value = false
  } catch (err) {
    console.error('Fehler beim Senden:', err)
  }
}

const fetchFavorites = async () => {
  try {
    const res = await fetch(`${backendBaseUrl}/entries`)
    const all = await res.json()
    favoriteEntries.value = all.filter((e: MoodEntry) => e.liked)
  } catch (err) {
    console.error('Fehler beim Laden der Lieblingssongs:', err)
  }
}

onMounted(() => {
  fetchFavorites()
})
</script>

<template>
  <div class="home">
    <h2>Wie fühlst du dich heute?</h2>

    <div class="button-group">
      <button
        v-for="m in moods"
        :key="m"
        @click="selectedMood = m; fetchSongsByMood()"
        :class="{ active: selectedMood === m }"
      >
        {{ m }}
      </button>
    </div>

    <div v-if="songs.length > 0">
      <h3>Song-Vorschlag für "{{ selectedMood }}"</h3>
      <ul>
        <li v-for="s in songs" :key="s.title">
          🎶 {{ s.title }} – {{ s.artist }}
        </li>
      </ul>
    </div>

    <p v-else-if="selectedMood">Keine Songs für "{{ selectedMood }}" gefunden.</p>

    <hr />

    <!-- Songvorschlag Formular -->
    <button class="suggest-button" @click="showForm = !showForm">
      {{ showForm ? 'Abbrechen' : 'Hilf uns mit deinem Vorschlag' }}
    </button>

    <form v-if="showForm" @submit.prevent="submitSuggestion">
      <input v-model="newSuggestion.title" placeholder="Songtitel" required />
      <input v-model="newSuggestion.artist" placeholder="Künstler" required />
      <select v-model="newSuggestionMood">
        <option v-for="m in moods" :key="m">{{ m }}</option>
      </select>
      <button type="submit">Absenden</button>
    </form>



    <!-- Lieblingssongs -->
    <button class="suggest-button" @click="showFavorites = !showFavorites">
      {{ showFavorites ? 'Lieblingssongs verbergen' : 'Lieblingssongs anzeigen' }}
    </button>

    <ul v-if="showFavorites && favoriteEntries.length > 0">
      <li v-for="entry in favoriteEntries" :key="entry.date">
        ⭐ {{ entry.song.title }} – {{ entry.song.artist }} ({{ entry.mood }})
      </li>
    </ul>

    <p v-if="showFavorites && favoriteEntries.length === 0">Noch keine Lieblingssongs gespeichert.</p>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  max-width: 700px;
  margin: auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-top: 1rem;
}

.button-group {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin: 2rem 0;
}

.suggest-button{
  margin: 10px;
}

button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  background-color: #ffd4e2;
  color: #333;
  cursor: pointer;
  transition: 0.2s;
}

button.active {
  background-color: #ff6b9e;
  color: white;
}

button:hover {
  background-color: #ff8cb7;
}

.suggest-button {
  margin-top: 2rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  align-items: center;
}

input, select {
  padding: 0.5rem;
  width: 250px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

ul {
  margin-top: 1rem;
  list-style: none;
  padding: 0;
}
</style>
