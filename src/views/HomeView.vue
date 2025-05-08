<script setup lang="ts">
import { ref, computed } from 'vue'


// Stimmungsauswahl & Songs
const selectedMood = ref('')
const moods = ['Happy', 'Sad', 'Energetic', 'Relaxed', 'Holy','Outgoing']

const songs = ref([
  { title: 'Happy', artist: 'Pharrell Williams', mood: 'Happy' },
  { title: 'Someone Like You', artist: 'Adele', mood: 'Sad' },
  { title: 'Stronger', artist: 'Kanye West', mood: 'Energetic' },
  { title: 'Don’t Know Why', artist: 'Norah Jones', mood: 'Relaxed' },
  { title: 'Firework', artist: 'Katy Perry', mood: 'Outgoing' },
  { title: 'YESHUA-dance cruise', artist: 'Dj Bentoa', mood: 'Holy' }
])

const filteredSongs = computed(() =>
  selectedMood.value
    ? songs.value.filter(song => song.mood === selectedMood.value)
    : []
)
</script>

<template>
  <h1>Willkommen bei SoundMood 🙈 🎵</h1>
  <div>
    <h2>Wie fühlst du dich heute?:</h2>
    <div class="button-group">
      <button
        v-for="mood in moods"
        :key="mood"
        @click="selectedMood = mood"
        :class="{ active: selectedMood === mood }"
      >
        {{ mood }}
      </button>
    </div>

    <div v-if="filteredSongs.length > 0">
      <ul>
        <h4>Das passt bestimmt zu deiner jetzigen Stimmung</h4>
        <li v-for="song in filteredSongs" :key="song.title">
          {{ song.title }} von {{ song.artist }}
        </li>
      </ul>
    </div>

  </div>
</template>

<style scoped>
.button-group {
  display: flex;
  justify-content:left;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 4em 0;

}
button {
  padding: 10px 16px;
  border: none;
  background-color: #eee;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s;
}

button {
  margin-right: 30px;
}

button:hover {
  background-color: #ccc;
}
button.active {
  background-color: rgba(0, 217, 255, 0.8);
  color: #ffffff;
}
</style>

