import fs from 'fs';
import { Auction } from 'models/auctionModel';
import mongoose from 'mongoose';
import path from 'path';
import { IAuction } from 'interfaces/Auction';
import { IAuctionService } from 'types/index';

const defaultImagePath = path.join(
  __dirname,
  'public/images/defaultAuctionImage.jpg',
);

export class AuctionService implements IAuctionService {
  async createAuction(
    userId: string,
    body: Partial<IAuction>,
    file?: Express.Multer.File,
  ): Promise<IAuction> {
    let imageData: Buffer | null = null;
    if (file) {
      const safeRoot = path.resolve(__dirname, '../../uploads');
      const resolvedPath = path.resolve(file.path);
      if (resolvedPath.startsWith(safeRoot)) {
        imageData = fs.readFileSync(resolvedPath);
      } else {
        throw new Error('Invalid file path');
      }
    }

    const auctionData: Partial<IAuction> = {
      ...body,
      seller: new mongoose.Types.ObjectId(userId),
      image: file
        ? {
            data: imageData,
            contentType: file.mimetype,
          }
        : null,
    };

    const auction = new Auction(auctionData);
    return auction.save();
  }

  async getAuctionById(auctionId: string): Promise<IAuction | null> {
    return Auction.findById(auctionId)
      .populate('seller', '_id name')
      .populate('bids.bidder', '_id name')
      .exec();
  }

  async getAuctionsBySeller(userId: string): Promise<IAuction[]> {
    return Auction.find({ seller: userId })
      .populate('seller', '_id name')
      .populate('bids.bidder', '_id name')
      .exec();
  }

  async getAuctionPhoto(
    auctionId: string,
  ): Promise<{ data: Buffer; contentType: string } | { path: string } | null> {
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return null;
    }

    if (auction.image && auction.image.data) {
      return {
        data: auction.image.data,
        contentType: auction.image.contentType,
      };
    }
    return { path: defaultImagePath };
  }

  async updateAuctionById(
    auctionId: string,
    body: Partial<IAuction>,
    file?: Express.Multer.File,
  ): Promise<IAuction | null> {
    const updateAuctionData = this.validateAuctionData(body);

    if (file) {
      let imageData: Buffer | null = null;
      const safeRoot = path.resolve(__dirname, '../../uploads');
      const resolvedPath = path.resolve(file.path);
      if (resolvedPath.startsWith(safeRoot)) {
        imageData = fs.readFileSync(resolvedPath);
      } else {
        throw new Error('Invalid file path');
      }
      updateAuctionData.image = {
        data: imageData,
        contentType: file.mimetype,
      };
    }

    const existingAuction = await Auction.findOne({ _id: auctionId }).exec();
    if (!existingAuction) {
      return null;
    }

    return Auction.findOneAndUpdate(
      { _id: auctionId },
      { $set: updateAuctionData },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  async deleteAuctionById(
    auctionId: string,
  ): Promise<{ deletedCount: number } | null> {
    const auction = await Auction.findOne({ _id: auctionId });
    if (!auction) {
      return null;
    }
    const result = await Auction.deleteOne({ _id: auctionId });
    return result;
  }

  async getOpenAuctions(): Promise<IAuction[]> {
    return Auction.find({ bidEnd: { $gt: new Date() } })
      .sort('bidStart')
      .populate('seller', '_id name')
      .populate('bids.bidder', '_id name')
      .exec();
  }

  async getAllAuctions(): Promise<IAuction[]> {
    return Auction.find({}).exec();
  }

  async getAuctionsByBidder(userId: string): Promise<IAuction[]> {
    return Auction.find({ 'bids.bidder': userId })
      .populate('seller', '_id name')
      .populate('bids.bidder', '_id name')
      .exec();
  }

  private validateAuctionData(data: Partial<IAuction>): Partial<IAuction> {
    const validData: Partial<IAuction> = {};
    if (typeof data.itemName === 'string') validData.itemName = data.itemName;
    if (typeof data.description === 'string')
      validData.description = data.description;
    if (typeof data.startingBid === 'number')
      validData.startingBid = data.startingBid;
    if (data.bidStart instanceof Date) validData.bidStart = data.bidStart;
    if (data.bidEnd instanceof Date) validData.bidEnd = data.bidEnd;
    return validData;
  }
}
