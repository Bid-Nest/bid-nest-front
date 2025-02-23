import { Request, Response } from 'express';
import services from 'services/index';
import { handleError } from 'utils/errorHandler';

export class AuctionController {
  public async createAuction(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const result = await services.auction.createAuctionService(
        userId,
        req.body,
        req.file,
      );
      return res.status(201).json(result);
    } catch (error) {
      return handleError(res, error, 'Error creating auction:');
    }
  }

  public async getAuctionById(req: Request, res: Response) {
    try {
      const auctionId = req.params.auctionId;

      const auction = await services.auction.getAuctionByIdService(auctionId);
      if (!auction) {
        return res.status(404).json({ error: 'Auction not found' });
      }
      return res.status(200).json(auction);
    } catch (error) {
      return handleError(res, error, 'Error fetching auction:');
    }
  }

  public async getAuctionsBySeller(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const auctions =
        await services.auction.getAuctionsBySellerService(userId);
      if (auctions.length === 0) {
        return res
          .status(404)
          .json({ error: 'No auctions found for this seller' });
      }
      return res.status(200).json(auctions);
    } catch (error) {
      return handleError(res, error, 'Error fetching auctions by seller:');
    }
  }

  public async getAuctionPhoto(req: Request, res: Response) {
    try {
      const auctionId = req.params.auctionId;
      const photo = await services.auction.getAuctionPhotoService(auctionId);
      if (!photo) {
        return res.status(404).json({ error: 'Auction not found' });
      }
      if (photo.path) {
        return res.status(200).sendFile(photo.path);
      } else {
        res.set('Content-Type', photo.contentType);
        return res.status(200).send(photo.data);
      }
    } catch (error) {
      return handleError(res, error, 'Error fetching auction photo:');
    }
  }

  public async updateAuctionById(req: Request, res: Response) {
    try {
      const auctionId = req.params.auctionId;
      const updatedAuction = await services.auction.updateAuctionByIdService(
        auctionId,
        req.body,
        req.file,
      );
      if (!updatedAuction) {
        return res.status(404).json({ error: 'Auction not found' });
      }
      return res.status(200).json(updatedAuction);
    } catch (error) {
      return handleError(res, error, 'Error updating auction:');
    }
  }

  public async deleteAuctionById(req: Request, res: Response) {
    try {
      const auctionId = req.params.auctionId;
      const result = await services.auction.deleteAuctionByIdService(auctionId);
      if (!result) {
        return res.status(404).json({ error: 'Auction not found' });
      }
      return res.status(200).json({ message: 'Auction deleted successfully' });
    } catch (error) {
      return handleError(res, error, 'Error deleting auction:');
    }
  }

  public async getOpenAuctions(_req: Request, res: Response) {
    try {
      const openAuctions = await services.auction.getOpenAuctionsService();
      return res.status(200).json(openAuctions);
    } catch (error) {
      return handleError(res, error, 'Error fetching open auctions:');
    }
  }

  public async getAllAuctions(_req: Request, res: Response) {
    try {
      const auctions = await services.auction.getAllAuctionsService();
      return res.status(200).json(auctions);
    } catch (error) {
      return handleError(res, error, 'Error fetching all auctions:');
    }
  }

  public async getAuctionsByBidder(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const auctions =
        await services.auction.getAuctionsByBidderService(userId);
      return res.status(200).json(auctions);
    } catch (error) {
      return handleError(res, error, 'Error fetching auctions by bidder:');
    }
  }
}
