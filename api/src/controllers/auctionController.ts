import { Request, Response } from 'express';
import { IAuctionService } from 'types/index';

export class AuctionController {
  constructor(private readonly auctionService: IAuctionService) {}

  async createAuction(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const result = await this.auctionService.createAuction(
        userId,
        req.body,
        req.file,
      );
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating auction:', error);
      res.status(500).json({ error: 'Failed to create auction' });
    }
  }

  async getAuctionById(req: Request, res: Response): Promise<void> {
    try {
      const auctionId = req.params.auctionId;
      const auction = await this.auctionService.getAuctionById(auctionId);
      if (!auction) {
        res.status(404).json({ error: 'Auction not found' });
        return;
      }
      res.status(200).json(auction);
    } catch (error) {
      console.error('Error fetching auction:', error);
      res.status(500).json({ error: 'Failed to fetch auction' });
    }
  }

  async getAuctionsBySeller(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const auctions = await this.auctionService.getAuctionsBySeller(userId);
      if (auctions.length === 0) {
        res.status(404).json({ error: 'No auctions found for this seller' });
        return;
      }
      res.status(200).json(auctions);
    } catch (error) {
      console.error('Error fetching auctions by seller:', error);
      res.status(500).json({ error: 'Failed to fetch auctions by seller' });
    }
  }

  async getAuctionPhoto(req: Request, res: Response): Promise<void> {
    try {
      const auctionId = req.params.auctionId;
      const photo = await this.auctionService.getAuctionPhoto(auctionId);
      if (!photo) {
        res.status(404).json({ error: 'Auction not found' });
        return;
      }
      if ('path' in photo) {
        res.status(200).sendFile(photo.path);
      } else {
        res.set('Content-Type', photo.contentType);
        res.status(200).send(photo.data);
      }
    } catch (error) {
      console.error('Error fetching auction photo:', error);
      res.status(500).json({ error: 'Failed to fetch auction photo' });
    }
  }

  async updateAuctionById(req: Request, res: Response): Promise<void> {
    try {
      const auctionId = req.params.auctionId;
      const updatedAuction = await this.auctionService.updateAuctionById(
        auctionId,
        req.body,
        req.file,
      );
      if (!updatedAuction) {
        res.status(404).json({ error: 'Auction not found' });
        return;
      }
      res.status(200).json(updatedAuction);
    } catch (error) {
      console.error('Error updating auction:', error);
      res.status(500).json({ error: 'Failed to update auction' });
    }
  }

  async deleteAuctionById(req: Request, res: Response): Promise<void> {
    try {
      const auctionId = req.params.auctionId;
      const result = await this.auctionService.deleteAuctionById(auctionId);
      if (!result) {
        res.status(404).json({ error: 'Auction not found' });
        return;
      }
      res.status(200).json({ message: 'Auction deleted successfully' });
    } catch (error) {
      console.error('Error deleting auction:', error);
      res.status(500).json({ error: 'Failed to delete auction' });
    }
  }

  async getOpenAuctions(_req: Request, res: Response): Promise<void> {
    try {
      const openAuctions = await this.auctionService.getOpenAuctions();
      res.status(200).json(openAuctions);
    } catch (error) {
      console.error('Error fetching open auctions:', error);
      res.status(500).json({ error: 'Failed to fetch open auctions' });
    }
  }

  async getAllAuctions(_req: Request, res: Response): Promise<void> {
    try {
      const auctions = await this.auctionService.getAllAuctions();
      res.status(200).json(auctions);
    } catch (error) {
      console.error('Error fetching all auctions:', error);
      res.status(500).json({ error: 'Failed to fetch all auctions' });
    }
  }

  async getAuctionsByBidder(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const auctions = await this.auctionService.getAuctionsByBidder(userId);
      res.status(200).json(auctions);
    } catch (error) {
      console.error('Error fetching auctions by bidder:', error);
      res.status(500).json({ error: 'Failed to fetch auctions by bidder' });
    }
  }
}
