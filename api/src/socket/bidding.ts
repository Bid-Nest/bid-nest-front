import { Server } from 'socket.io';
import { Auction } from 'models/auctionModel';
import { IAuction } from 'interfaces/Auction';
import { IBidInfo } from 'interfaces/BidInfo';

export class AuctionHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public async handleNewBid(data: {
    bidInfo: IBidInfo;
    room: string;
  }): Promise<void> {
    try {
      const updatedAuction: IAuction | null = await this.updateAuction(
        data.room,
        data.bidInfo,
      );

      if (updatedAuction) {
        this.emitNewBid(data.room, updatedAuction);
      } else {
        console.warn(`Auction not found or invalid bid for room: ${data.room}`);
      }
    } catch (error) {
      console.error('Error handling new bid:', error);
    }
  }

  private async updateAuction(
    room: string,
    bidInfo: IBidInfo,
  ): Promise<IAuction | null> {
    return Auction.findOneAndUpdate(
      {
        _id: room,
        $or: [{ 'bids.0.bid': { $lt: bidInfo.bid } }, { bids: { $eq: [] } }],
      },
      { $push: { bids: { $each: [bidInfo], $position: 0 } } },
      { new: true },
    )
      .populate('bids.bidder', '_id name')
      .populate('seller', '_id name')
      .exec();
  }

  private emitNewBid(room: string, auction: IAuction): void {
    this.io.to(room).emit('new bid', auction);
  }
}
