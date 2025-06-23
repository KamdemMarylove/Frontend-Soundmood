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
  padding: 1.5rem 1rem;
  text-align: center;
  border-bottom: 4px solid #ffd4e2;
}

h1 {
  margin: 0;
  font-size: 2rem;
}

nav {
  margin-top: 1rem;
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
  padding: 2rem;
  background-color: #fff;
  min-height: 80vh;
}
</style>
