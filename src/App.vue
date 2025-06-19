<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Song {
  title: string
  artist: string
  mood: string
}

const songs = ref<Song[]>([])
const newSong = ref<Song>({
  title: '',
  artist: '',
  mood: ''
})

const fetchSongs = async () => {
  try {
    const response = await fetch('https://soundmood-webtech-6.onrender.com/songs')
    songs.value = await response.json()
  } catch (error) {
    console.error('Fehler beim Laden der Songs:', error)
  }
}

const addSong = async () => {
  try {
    await fetch('https://soundmood-webtech-6.onrender.com/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSong.value)
    })
    newSong.value = { title: '', artist: '', mood: '' }
    fetchSongs()
  } catch (error) {
    console.error('Fehler beim Speichern des Songs:', error)
  }
}

onMounted(fetchSongs)
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    <div class="wrapper">
      <h1>🎵 SoundMood</h1>
    </div>
  </header>

  <main>
    <section>
      <h2>Neuen Song hinzufügen</h2>
      <form @submit.prevent="addSong">
        <input v-model="newSong.title" placeholder="Titel" required />
        <input v-model="newSong.artist" placeholder="Künstler" required />
        <input v-model="newSong.mood" placeholder="Stimmung (z. B. happy)" required />
        <button type="submit">Song hinzufügen</button>
      </form>
    </section>

    <section>
      <h2>Song-Vorschläge</h2>
      <ul>
        <li v-for="song in songs" :key="song.title">
          {{ song.title }} – {{ song.artist }} ({{ song.mood }})
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  display: block;
  margin: 0 auto 1rem;
}

.wrapper h1 {
  font-size: 1.8rem;
  font-weight: bold;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
}

form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  gap: 0.5rem;
  margin: 1rem 0;
  width: 100%;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  padding: 0.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #369870;
}

ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

li {
  margin-bottom: 0.5rem;
}
</style>
