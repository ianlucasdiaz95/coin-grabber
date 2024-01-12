import serverApi from '../api/server.api';


const coinService = {

  getCoinCountByRoom(roomId: string) {
    return serverApi.get(`/coins/count/${roomId}`);
  },

}

export default coinService;