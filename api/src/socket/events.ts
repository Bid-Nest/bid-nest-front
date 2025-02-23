import { Socket, Server } from 'socket.io';
import { AuctionHandler } from './bidding'; // Importing AuctionHandler class
import { IBidInfo } from 'interfaces/BidInfo';

export class SocketEventHandler {
  private socket: Socket;
  private io: Server;
  private auctionHandler: AuctionHandler;

  constructor(socket: Socket, io: Server) {
    this.socket = socket;
    this.io = io;
    this.auctionHandler = new AuctionHandler(io);
    this.initializeEvents();
  }

  private initializeEvents(): void {
    this.socket.on('join auction room', this.handleJoinAuctionRoom.bind(this));
    this.socket.on(
      'leave auction room',
      this.handleLeaveAuctionRoom.bind(this),
    );
    this.socket.on('new bid', this.handleNewBid.bind(this));
    this.socket.on('disconnect', this.handleDisconnect.bind(this));
  }

  private handleJoinAuctionRoom(data: { room: string }): void {
    this.socket.join(data.room);
    console.log(`Client ${this.socket.id} joined room: ${data.room}`);
  }

  private handleLeaveAuctionRoom(data: { room: string }): void {
    this.socket.leave(data.room);
    console.log(`Client ${this.socket.id} left room: ${data.room}`);
  }

  private handleNewBid(data: { bidInfo: IBidInfo; room: string }): void {
    this.auctionHandler.handleNewBid(data);
  }

  private handleDisconnect(): void {
    console.log('Client disconnected:', this.socket.id);
  }
}
