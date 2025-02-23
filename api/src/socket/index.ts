import { Server } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import { handleSocketEvents } from './events';

class SocketManager {
  private io: SocketIOServer;

  constructor(server: Server) {
    this.io = new SocketIOServer(server);
    this.initializeSocket();
  }

  private initializeSocket(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('New client connected:', socket.id);
      this.handleSocketEvents(socket);
    });
  }

  private handleSocketEvents(socket: Socket): void {
    handleSocketEvents(socket, this.io);
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}

export default SocketManager;
