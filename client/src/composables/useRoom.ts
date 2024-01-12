import coinService from '@/services/coin.service';
import roomService from '@/services/room.service';
import type { Room } from '@/types';
import { computed, ref } from 'vue';
import { toast } from 'vue3-toastify';
import { useRoomsStore } from '@/stores/rooms';

const useRoom = () => {
    const isLoading = ref(false);
    const roomsStore = useRoomsStore();

    async function getRooms() {

        isLoading.value = true;

        try {
          const { data } = await roomService.getRooms();

          roomsStore.rooms = data;
            
        } catch (error: any) {
          toast.error(`There was an error getting rooms. Please try again later.`);
        } finally {
          isLoading.value = false;
        }
    }

    async function getRoom(roomId: string) {

      isLoading.value = true;

      try {
          const { data } = await roomService.getRoom(roomId);

          roomsStore.currentRoom = data;
          
      } catch (error: any) {
          toast.error(`There was an error getting the room. Please try again later.`);
      } finally {
        isLoading.value = false;
      }
    }

    async function getRoomCoinCount(roomId: string) {


      try {

          const { data } = await coinService.getCoinCountByRoom(roomId);

          roomsStore.setRoomCoinCount(roomId, data.count);

      } catch (error: any) {
          toast.error(`There was an error getting the room coin count. Please try again later.`);
      }
    }

    const rooms = computed(() => roomsStore.rooms)
    const currentRoom = computed(() => roomsStore.currentRoom)

    return {
        // data
        rooms,
        currentRoom,
        isLoading,

        //methods
        getRooms,
        getRoom,
        getRoomCoinCount
    };
};

export default useRoom;