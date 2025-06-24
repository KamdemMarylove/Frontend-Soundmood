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
  padding: 0.8rem 1rem;
  text-align: center;
  border-bottom: 2px solid #ffd4e2;
}

h1 {
  font-size: 1.5rem;
  margin: 0;
}

nav {
  margin-top: 0.4rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

a {
  color: white;
  font-weight: bold;
  text-decoration: none;
  font-size: 0.95rem;
  transition: 0.2s;
}

a.router-link-exact-active {
  text-decoration: underline;
}

main {
  padding: 3rem 1rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
  background-color: #fafafa;
}
*{
  color:black
}
</style>



