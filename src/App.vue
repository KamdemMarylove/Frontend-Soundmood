<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
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
  background-color: #ff6b9e;
  color: white;
  padding: 1rem;
  text-align: center;
  border-bottom: 3px solid #ffd4e2;
}

h1 {
  font-size: 1.8rem;
  margin: 0.2rem 0;
}

nav {
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
}

a {
  color: white;
  font-weight: bold;
  text-decoration: none;
  transition: 0.2s;
}

a.router-link-exact-active {
  text-decoration: underline;
}

main {
  padding: 3rem 1rem;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>

