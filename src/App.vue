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

<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<style scoped>
:root {
  --rosa: #ff6b9e;
  --rosa-dark: #e05589;
  --bg: #fefefe;
  --text: #333;
}

body {
  font-family: 'Helvetica Neue', sans-serif;
  background-color: var(--bg);
  color: var(--text);
}

header {
  background-color: var(--rosa);
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

nav {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

a {
  text-decoration: none;
  color: white;
  font-weight: bold;
}

a.router-link-exact-active {
  text-decoration: underline;
}

main {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}
</style>
