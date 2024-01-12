import serverApi from '../api/server.api';


const roomService = {

  getRooms() {
    return serverApi.get(`/room`);
  },

  getRoom(roomId: string) {
    return serverApi.get(`/room/${roomId}`);
  },

}

export default roomService;