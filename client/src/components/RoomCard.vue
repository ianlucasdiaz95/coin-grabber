<template>
  <div class="mr-4 block rounded-lg bg-slate-950 shadow-sm ">
    <div class="p-6">
      <h5
        class="mb-2 text-xl font-medium leading-tight text-white">
        {{ room.name }}
      </h5>
      <p class="mb-4 text-base text-neutral-300">
        Available coins: {{ room.coinCount }}
      </p>
      <button
        type="button"
        @click="router.push({ name: 'Room', params: { id: room.id }})"
        class="inline-block rounded bg-white px-6 py-2 text-sm font-medium uppercase leading-normal text-black hover:bg-neutral-300 transition-all"
        data-te-ripple-init
        data-te-ripple-color="light">
        Go to room
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import useRoom from '@/composables/useRoom';
import useSocket from '@/composables/useSocket';
import type { Room } from '@/types';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { socket } = useSocket();
const { getRoomCoinCount } = useRoom();

const props = defineProps<{
  room: Room
}>()

onMounted(() => {
  socket.on('regenerated-coins', () => {
    getRoomCoinCount(props.room.id)
  })

  socket.on('coin-grabbed', () => {
    console.log('coin grabbed')
    getRoomCoinCount(props.room.id)
  })
})

</script>

<style scoped lang="scss">

</style>