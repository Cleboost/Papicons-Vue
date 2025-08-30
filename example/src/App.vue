<script setup lang="ts">
    import { Home, Search, Heart } from 'papicons-vue'
</script>

<template>
  <main class="main">
    <h1>Papicons Vue - Démo</h1>
    <div class="icons-container">
      <Home :size="32" color="#2F80ED" />
      <Search :size="32" color="#333" />
      <Heart :size="32" color="#EB5757" />
    </div>
  </main>
  
</template>

<style scoped>
.main {
  padding: 24px;
  font-family: ui-sans-serif, system-ui;
}

.icons-container {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 16px;
}
</style>