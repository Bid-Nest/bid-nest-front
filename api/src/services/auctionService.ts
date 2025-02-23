import fs from 'fs';
import { Auction } from 'models/auctionModel';
import mongoose from 'mongoose';
import path from 'path';
import { IAuction } from 'interfaces/Auction';

const defaultImagePath = path.join(
  __dirname,
  'public/images/defaultAuctionImage.jpg',
);

eaxport class AuctionService {
  public async createAuction(
    userId: string,
    body: any,
    file: Express.Multer.File | undefined,
  ) {
    let imageData = null;
    if (file) {
      const safeRoot = path.resolve(__dirname, '../../uploads');
      const resolvedPath = path.resolve(file.path);
      if (resolvedPath.startsWith(safeRoot)) {
        imageData = fs.readFileSync(resolvedPath);
      } else {
        throw new Error('Invalid file path');
      }
    }

    const auctionData = {
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

  public async getAuctionById(auctionId: string) {
    return Auction.findById(auctionId)
      .populate('seller', '_id name')
      .populate('bids.bidder', '_id name')
      .exec();
  }

  public async getAuctionsBySeller(userId: string) {
    return Auction.find({ seller: userId })
      .populate('seller', '_id name')
      .populate('bids.bidder', '_id name')
      .exec();
  }

  public async getAuctionPhoto(auctionId: string) {
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return null;
    }

    if (auction.image && auction.image.data) {
      return {
        data: auction.image.data,
        contentType: auction.image.contentType,
      };
    } else {
      return { path: defaultImagePath };
    }
  }

  public async updateAuctionById(
    auctionId: string,
    body: Partial<IAuction>,
    file: Express.Multer.File | undefined,
  ) {
    const updateAuctionData: Partial<IAuction> = this.validateAuctionData(body);

    if (file) {
      let imageData = null;
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

  public async deleteAuctionById(auctionId: string) {
    const auction = await Auction.findOne({ _id: auctionId });
    if (!auction) {
      return null;
    }
    return Auction.deleteOne({ _id: auctionId });
  }

  public async getOpenAuctions() {
    return Auction.find({ bidEnd: { $gt: new Date() } })
      .sort('bidStart')
      .populate('seller', '_id name')
      .populate('bids.bidder', '_id name')
      .exec();
  }

  public async getAllAuctions() {
    return Auction.find({}).exec();
  }

  public async getAuctionsByBidder(userId: string) {
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

