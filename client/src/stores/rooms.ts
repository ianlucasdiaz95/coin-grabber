import type { Coin, Room } from '@/types'
import { defineStore } from 'pinia'

export const useRoomsStore = defineStore('rooms', {
  state: () => ({
    rooms: [] as Room[],
    currentRoom: {} as Room
  }),
  actions: {
    setCurrentRoom(roomId: string){
      const room = this.rooms.find(room => room.id === roomId);

      if(!room){
        return;
      }

      this.currentRoom = room;

    },
    setRoomCoinCount(roomId:string, coinCount: number){
      const roomIdx = this.rooms.findIndex(room => room.id === roomId);

      if(roomIdx === -1){
        return;
      }

      this.rooms[roomIdx].coinCount = coinCount;
    },
    setRooms(rooms: Room[]) {
      this.rooms = rooms;      
    },
  },
})
