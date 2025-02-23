import mongoose from 'mongoose';
import Shop from 'models/shopModel';
import fs from 'fs';
import path from 'path';
import { IShop } from 'interfaces/Shop';

const defaultImagePath = path.join(
  __dirname,
  'public/images/defaultShopImage.jpg',
);

class ShopService {
  private safeDir: string;

  constructor() {
    this.safeDir = path.resolve(__dirname, 'uploads');
  }

  private resolveFilePath(filePath: string): string {
    const resolvedPath = path.resolve(this.safeDir, filePath);
    if (!resolvedPath.startsWith(this.safeDir)) {
      throw new Error('Invalid file path');
    }
    return resolvedPath;
  }

  private async readImageFile(
    imageFile?: Express.Multer.File,
  ): Promise<Buffer | null> {
    if (!imageFile) return null;

    const resolvedPath = this.resolveFilePath(imageFile.path);
    return fs.readFileSync(resolvedPath);
  }

  async createShop(
    userId: string,
    shopData: IShop,
    imageFile?: Express.Multer.File,
  ) {
    const imageData = await this.readImageFile(imageFile);

    const shop = new Shop({
      ...shopData,
      owner: new mongoose.Types.ObjectId(userId),
      image: imageData
        ? { data: imageData, contentType: imageFile?.mimetype }
        : null,
    });

    return await shop.save();
  }

  async getShopById(shopId: string) {
    return await Shop.findById(shopId).populate('owner', '_id name').exec();
  }

  async getShopPhoto(shopId: string) {
    const shop = await Shop.findById(shopId);

    if (shop && shop.image && shop.image.data) {
      return {
        imageData: shop.image.data,
        contentType: shop.image.contentType,
      };
    }
    return defaultImagePath;
  }

  async updateShopById(
    shopId: string,
    updateData: any,
    imageFile?: Express.Multer.File,
  ) {
    const shop = await Shop.findOne({ _id: shopId });

    if (shop) {
      if (imageFile) {
        const imageData = await this.readImageFile(imageFile);
        shop.image = { data: imageData, contentType: imageFile.mimetype };
      }

      shop.set({ ...updateData });
      return await shop.save();
    }

    return null;
  }

  async deleteShopById(shopId: string) {
    return await Shop.findByIdAndDelete(shopId);
  }

  async getAllShops() {
    return await Shop.find();
  }

  async getShopByOwner(ownerId: string) {
    return await Shop.find({ owner: ownerId })
      .populate('owner', '_id name')
      .exec();
  }

  async isShopOwner(userId: string) {
    return await Shop.findOne({ owner: userId });
  }
}

export default new ShopService();
