export interface Room {
  id: string,
  name: string,
  coinCount: number
}

export interface Coin {
  id:        string;
  room:      string;
  position:  Position;
  expiresAt: number;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}
