import { useCoinsStore } from '@/stores/coins';
import type { Coin } from '@/types';
import { io } from "socket.io-client";
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

const URL = "http://localhost:3000";
const socket = io(URL);

const useSocket = () => {

  const coinsStore = useCoinsStore()
  const clientsInRoom = ref(0);

  function joinRoom(roomId: string) {
    socket.emit("join-room", roomId, () => {
      toast.info(`Joined ${roomId}`);
    });
  }

  function listenAvailableCoins(){
    socket.on('available-coins', (payload: Coin[]) => {
      coinsStore.coins = payload
    })
  }

  function listenGrabbedCoin(){
    socket.on('coin-grabbed', (payload: string) => {
      coinsStore.grabCoin(payload);
    })
  }

  function grabCoin(coinId: string){
    socket.emit('grab-coin', coinId)
  }

  function listenJoinedRoom(){
    
    socket.on('room-count', (payload) => {
      console.log(payload)
      clientsInRoom.value = payload;
    })
  }

  function leaveRoom(roomId: string){
    socket.emit('leave-room', roomId);
  }

  return {
    //data
    clientsInRoom,
    socket,
    //methods
    grabCoin,
    joinRoom,
    listenAvailableCoins,
    listenGrabbedCoin,
    listenJoinedRoom,
    leaveRoom
  };
};

export default useSocket;