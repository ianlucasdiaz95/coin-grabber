import express, { Application, Router, Request, Response } from 'express';
import http from 'http';
import { Server as SocketIoServer, Socket } from 'socket.io';
import cors from 'cors';
import * as redis from 'redis';

type CoinArea = {
  xmax: number;
  xmin: number;
  ymax: number;
  ymin: number;
  zmax: number;
  zmin: number;
};

interface Room {
  id: string;
  name: string;
}

interface ServerConfig {
  rooms: Room[];
  coinsPerRoom: number;
  coinArea: CoinArea;
}

interface Coin {
  id: string;
  room: string;
  position: { x: number; y: number; z: number };
  expiresAt: number;
}

class Server {
    public app: Application;
    public port: string | number;
    private server: http.Server;
    private io: SocketIoServer;
    public router: Router
    private redisClient: redis.RedisClientType;
    private redisSubClient: redis.RedisClientType
    public config!: ServerConfig;
    public coins: Coin[];

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.server = http.createServer(this.app);
        this.io = new SocketIoServer(this.server, {
          cors: {
            origin: "http://localhost:5173"
          }
        });
        this.router = Router();
        this.coins = [];
        this.config = {
          rooms: [
            {
              id: "room1",
              name: "Room 1"
            }, 
            {
              id: "room2",
              name: "Room 2"
            },
            {
              id: "room3",
              name: "Room 3"
            }
          ],
          "coinsPerRoom": 5,
          "coinArea": { "xmax": 100, "xmin": 0, "ymax": 100, "ymin": 0, "zmax": 100, "zmin": 0 }
        }

        this.redisClient = redis.createClient({
          socket: {
            port: 6379,
            host: process.env.REDIS_HOST,
          }
        });

        this.redisSubClient = redis.createClient({
          socket: {
            port: 6379,
            host: process.env.REDIS_HOST,
          }
        });

        this.middlewares();
        this.sockets();
        this.routes();
        this.redis();
        this.generateCoins();
    }

    private async redis(): Promise<void> {
      this.redisClient.connect()
      this.redisSubClient.connect()

      this.redisClient.on('connect', () => {
          console.log('Connected to Redis');
      });
      
      this.redisClient.on('error', (err: any) => {
          console.error('Error connecting to Redis:', err);
      });

      this.redisSubClient.configSet('notify-keyspace-events', 'Ex');

      this.redisSubClient.subscribe('__keyevent@0__:expired', (key) => {

        this.generateCoins();

      });

    }

    private middlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private generateCoins(): void {
      // Generate coins

      this.coins = [];
      this.redisClient.flushDb();

      for (const room of this.config.rooms) {
        for (let i = 0; i < this.config.coinsPerRoom; i++) {
          const id = `${room.id}-${i}`;
          const position = {
            x: Math.random() * (this.config.coinArea.xmax - this.config.coinArea.xmin) + this.config.coinArea.xmin,
            y: Math.random() * (this.config.coinArea.ymax - this.config.coinArea.ymin) + this.config.coinArea.ymin,
            z: Math.random() * (this.config.coinArea.zmax - this.config.coinArea.zmin) + this.config.coinArea.zmin,
          };

          const coin: Coin = {
            id,
            room: room.id,
            position,
            expiresAt: Date.now() + 60 * 60,
          };

          this.coins.push(coin);

          this.redisClient.setEx(coin.id, 10, JSON.stringify(coin.position));
          
        }
      }

      this.io.emit('regenerated-coins');

      this.config.rooms.forEach((room) => {
        const coinsInRoom = this.coins.filter((coin) => coin.room === room.id);
        this.io.to(room.id).emit('available-coins', coinsInRoom);
      });
    }

    private routes(): void {

      //Config endpoint
      this.app.use('/api/config', this.router.post('/',(req, res) => {
        
        this.config = req.body;

        this.generateCoins();

        return res.send({data: 'Service configured.'})
      }));

      this.app.get('/api/room', async (req: Request, res: Response) => {

        const data = this.config.rooms.map(room => {
          return {
            ...room,
            coinCount: this.coins.filter((coin) => coin.room === room.id).length
          }
        })

        res.json(data);
      });

      this.app.get('/api/room/:room', async (req: Request, res: Response) => {

        const roomId = req.params.room;

        const room = this.config.rooms.find((room) => room.id === roomId);

        if (!room) {
          return res.status(404).json({ error: 'Room not found' });
        }

        const data = {
          ...room,
          coinCount: this.coins.filter((coin) => coin.room === room.id).length,
        };

        res.json(data);
      });

      this.app.get('/api/coins/:room', async (req: Request, res: Response) => {
        const room = req.params.room;
        const coinsInRoom = this.coins.filter((coin) => coin.room === room);
        res.json(coinsInRoom);
      });
    
      this.app.get('/api/coins/count/:room', async (req: Request, res: Response) => {
        const room = req.params.room;
        const coinsCount = this.coins.filter((coin) => coin.room === room).length;
        res.json({ count: coinsCount });
      });

    }

    private sockets(): void {
      this.io.on('connection', (socket: Socket) => {
        console.log(`Client connected: ${socket.id}`);
    
        socket.on('join-room', async (room: string, callback) => {
          console.log(`Client ${socket.id} joined room ${room}`);
          socket.join(room);

          callback();
    
          const coinsInRoom = this.coins.filter((coin) => coin.room === room);
          this.io.to(room).emit('available-coins', coinsInRoom);

          const socketCount = await this.io.in(room).fetchSockets();
          this.io.to(room).emit('room-count', socketCount.length)
        });

        socket.on('leave-room', async (room: string) => {
          socket.leave(room);

          const socketCount = await this.io.in(room).fetchSockets();
          this.io.to(room).emit('room-count', socketCount.length)
        })
    
        socket.on('grab-coin', async (coinId: string) => {
          const index = this.coins.findIndex((coin) => coin.id === coinId);
    
          if (index !== -1) {
            this.coins.splice(index, 1)[0];
            this.redisClient.del(coinId);
    
            this.io.emit('coin-grabbed', coinId);

            console.log(`Client ${socket.id} grabbed coin ${coinId}`);
          } else {
            console.log(`Coin ${coinId} not found`);
          }
        });

        socket.on('disconnect', async () => {
  
        });
      });
    }

    public listen(): void {
        this.server.listen(this.port, () => {
            console.log('Server running on port: ', this.port);
        });
    }
}

export = Server;