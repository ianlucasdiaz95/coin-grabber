<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="flex flex-col items-center justify-center container w-full py-3">
    <img alt="Logo" class="logo" src="@/assets/coin.png" width="100" height="100" />
    <h1 class="text-center text-xl uppercase mt-2">Coin grabber</h1>
  </header>

  <main>
    <RouterView />
  </main>
  
</template>

<style scoped>

</style>
