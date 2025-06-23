<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <h1>🎵 SoundMood</h1>
    <nav>
      <RouterLink to="/">Start</RouterLink>
      <RouterLink to="/week">Meine Woche</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  padding: 1rem;
  background-color: #42b983;
  color: white;
  text-align: center;
}

nav {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
}

a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

a.router-link-exact-active {
  text-decoration: underline;
}

main {
  padding: 2rem;
}
</style>
