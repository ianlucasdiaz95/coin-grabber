<template>
  <main>
    <div class="container mx-auto mt-10">
      <div class="grid grid-cols-1 grid-rows-1 md:grid-cols-3 gap-3" v-if="!isLoading">
        <RoomCard v-for="room in rooms" :room="room" :key="room.id" />
      </div>
      <div v-if="isLoading" class="flex justify-center">
        <Loader />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import RoomCard from '@/components/RoomCard.vue';
import Loader from '@/components/Loader.vue';

import { onMounted } from 'vue';
import useRoom from '@/composables/useRoom';

const { rooms, getRooms, isLoading } = useRoom()

onMounted( async () => {
  await getRooms();
})

</script>