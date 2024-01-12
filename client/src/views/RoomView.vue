<template>
  <div class="container">
    <button
        type="button"
        @click="router.push({ name: 'Home'})"
        class="inline-block rounded bg-black px-6 py-2 text-sm font-medium uppercase leading-normal text-white hover:bg-neutral-700 transition-all"
        data-te-ripple-init
        data-te-ripple-color="light">
        Go back
      </button>
    <div class="text-center mb-5 mt-5">
      <h1 class="text-3xl font-bold">{{ currentRoom?.name }}</h1>
      <p>Available coins: {{ availableCoins }}</p>
      <p>Users in room: {{ clientsInRoom }}</p>
      <p class="mt-5">Select a coin to grab it.</p>
    </div>
    <div class="relative w-100 min-h-[500px] border mb-10 border-gray-400">
      <div v-for="coin in coins" :key="coin.id" @click="grabCoin(coin.id)" class="cursor-pointer hover:scale-[1.20] transition-all absolute w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black" :style="getCoinStyle(coin)">
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import useSocket from '@/composables/useSocket';
import useRoom from '@/composables/useRoom';
import { useRouter } from 'vue-router';
import type { Coin } from '@/types'
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCoinsStore } from '@/stores/coins';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const coinsStore = useCoinsStore();
const { joinRoom, listenAvailableCoins, listenGrabbedCoin, grabCoin, clientsInRoom, listenJoinedRoom, leaveRoom } = useSocket();
const { currentRoom ,getRoom } = useRoom()

onMounted(() => {
  getRoom(id);
  joinRoom(id);
  
  listenJoinedRoom();
  listenAvailableCoins();
  listenGrabbedCoin();
})

onUnmounted(() => {
  leaveRoom(id);
});

const coins = computed(() => {
  return coinsStore.coins
})

const availableCoins = computed(() => {
  return coinsStore.coins.length
})

const getCoinStyle = (coin: Coin) => {
  const left = (coin.position.x / 100) * 100 + '%';
  const top = (coin.position.y / 100) * 100 + '%';

  return {
    left,
    top,
  };
};
</script>

<style scoped lang="scss">

</style>