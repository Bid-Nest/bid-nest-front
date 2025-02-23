import { Request, Response, NextFunction } from 'express';
import { handleError } from 'utils/errorHandler';
import { isValidObjectId } from 'utils/isValidObjectId';
import { IAuthRequest } from 'interfaces/requests/AuthRequest';

export class ShopController {
  async createShop(req: IAuthRequest, res: Response) {
    try {
      if (!req.user || !req.user._id) {
        return res.status(400).json({ error: 'User information is missing' });
      }

      const result = await ShopService.createShop(
        req.user._id,
        req.body,
        req.file,
      );
      return res.status(201).json(result);
    } catch (error) {
      return handleError(res, error, 'Error creating shop');
    }
  }

  async getShopById(req: Request, res: Response) {
    try {
      const shopId = req.params.shopId;
      const shop = await ShopService.getShopById(shopId);
      if (!shop) {
        return res.status(404).json({ error: 'Shop not found' });
      }
      return res.status(200).json(shop);
    } catch (error) {
      return handleError(res, error, 'Error retrieving shop by ID');
    }
  }

  async getShopPhoto(req: Request, res: Response) {
    try {
      const shopId = req.params.shopId;
      const photo = await ShopService.getShopPhoto(shopId);
      if (typeof photo === 'string') {
        return res.status(200).sendFile(photo);
      }

      res.set('Content-Type', photo.contentType);
      return res.status(200).send(photo.imageData);
    } catch (error) {
      return handleError(res, error, 'Error retrieving shop photo');
    }
  }

  async updateShopById(req: Request, res: Response) {
    try {
      const shopId = req.params.shopId;
      const updatedShop = await ShopService.updateShopById(
        shopId,
        req.body,
        req.file,
      );
      if (!updatedShop) {
        return res.status(404).json({ error: 'Shop not found' });
      }

      return res.status(200).json(updatedShop);
    } catch (error) {
      return handleError(res, error, 'Error updating shop by ID');
    }
  }

  async deleteShopById(req: Request, res: Response) {
    try {
      const shopId = req.params.shopId;
      const deletedShop = await ShopService.deleteShopById(shopId);
      if (!deletedShop) {
        return res.status(404).json({ error: 'Shop not found' });
      }

      return res.status(200).json(deletedShop);
    } catch (error) {
      return handleError(res, error, 'Error deleting shop by ID');
    }
  }

  async getAllShops(_req: Request, res: Response) {
    try {
      const shops = await ShopService.getAllShops();
      return res.status(200).json(shops);
    } catch (error) {
      return handleError(res, error, 'Error retrieving all shops');
    }
  }

  async getShopByOwner(req: IAuthRequest, res: Response) {
    try {
      const userId = req.params.userId;
      const shops = await ShopService.getShopByOwner(userId);
      return res.status(200).json(shops);
    } catch (error) {
      return handleError(res, error, 'Error retrieving shops by owner');
    }
  }

  async isShopOwner(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
      const shop = await ShopService.isShopOwner(userId as string);
      if (!shop) {
        return res.status(403).json({ error: 'User is not the shop owner' });
      }

      next();
    } catch (error) {
      return handleError(res, error, 'Error checking shop ownership');
    }
  }
}
