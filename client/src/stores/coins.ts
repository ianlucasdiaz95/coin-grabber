import type { Coin } from '@/types'
import { defineStore } from 'pinia'

export const useCoinsStore = defineStore('coins', {
  state: () => ({
    coins: [] as Coin[],
  }),
  actions: {
    setCoins(coins: Coin[]){
      this.coins = coins;
    },
    grabCoin(coinId: string) {
      const index = this.coins.findIndex((coin) => coin.id === coinId)

      if (index !== -1) {
        this.coins.splice(index, 1)[0];
      } else {
        console.log(`Coin ${coinId} not found`);
      }
      
    },
  },
})
