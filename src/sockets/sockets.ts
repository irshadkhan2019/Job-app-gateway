import { GatewayCache } from '@gateway/redis/gateway.cache';
import { Server, Socket } from 'socket.io';

export class SocketIOAppHandler {
  private io: Server;
  private gatewayCache: GatewayCache;

  constructor(io: Server) {
    this.io = io;
    this.gatewayCache = new GatewayCache();

  }

  public listen(): void {
    this.io.on('connection', async (socket: Socket) => {
        // events coming from client React app here server listening for getLoggedInUsers event
        
      socket.on('getLoggedInUsers', async () => {
        const response: string[] = await this.gatewayCache.getLoggedInUsersFromCache('loggedInUsers');
        // send event back to front end where react app is listening for online event
        this.io.emit('online', response);
      });

      socket.on('loggedInUsers', async (username: string) => {
        const response: string[] = await this.gatewayCache.saveLoggedInUserToCache('loggedInUsers', username);
        this.io.emit('online', response);
      });

      socket.on('removeLoggedInUser', async (username: string) => {
        const response: string[] = await this.gatewayCache.removeLoggedInUserFromCache('loggedInUsers', username);
        this.io.emit('online', response);
      });

      socket.on('category', async (category: string, username: string) => {
        await this.gatewayCache.saveUserSelectedCategory(`selectedCategories:${username}`, category);
      });
    });
  }
};