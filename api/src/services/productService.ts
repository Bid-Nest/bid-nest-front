import mongoose, { Types } from 'mongoose';
import fs from 'fs';
import path from 'path';
import { IProduct } from 'interfaces/Product';
import { Product } from 'models/productModel';
import { escapeRegExp } from 'utils/stringUtils';

const defaultImagePath = path.join(
  __dirname,
  'public/images/defaultProductImage.jpg',
);
const safeUploadDir = path.resolve(__dirname, '../../uploads');

export class ProductService {
  private static handleImageUpload(
    file: Express.Multer.File | undefined,
  ): { data: Buffer; contentType: string } | null {
    if (!file) return null;
    const resolvedPath = path.resolve(file.path);
    if (!resolvedPath.startsWith(safeUploadDir)) {
      throw new Error('Invalid file path');
    }
    const imageData = fs.readFileSync(resolvedPath);
    return {
      data: imageData,
      contentType: file.mimetype,
    };
  }

  public static async createProduct(
    productData: Partial<IProduct>,
    shopId: string,
    file: Express.Multer.File | undefined,
  ): Promise<IProduct> {
    const imageData = this.handleImageUpload(file);

    const newProduct = new Product({
      ...productData,
      shop: new mongoose.Types.ObjectId(shopId),
      image: imageData,
    });

    return await newProduct.save();
  }

  public static async getProductById(
    productId: string,
  ): Promise<IProduct | null> {
    return await Product.findById(productId);
  }

  public static async getProductPhoto(productId: string): Promise<Buffer> {
    const product = await Product.findById(productId);
    if (product?.image?.data) {
      return product.image.data;
    }
    return fs.readFileSync(defaultImagePath);
  }

  public static async updateProductById(
    productId: string,
    shopId: string,
    updatedData: Partial<IProduct>,
    file: Express.Multer.File | undefined,
  ): Promise<IProduct | null> {
    if (file) {
      const imageData = this.handleImageUpload(file);
      updatedData.image = imageData;
    }

    const updateFields: Partial<IProduct> = {};
    if (updatedData.name && typeof updatedData.name === 'string') {
      updateFields['name'] = updatedData.name;
    }
    if (updatedData.price && typeof updatedData.price === 'number') {
      updateFields['price'] = updatedData.price;
    }
    if (
      updatedData.description &&
      typeof updatedData.description === 'string'
    ) {
      updateFields['description'] = updatedData.description;
    }
    if (updatedData.image) {
      updateFields['image'] = updatedData.image;
    }

    return await Product.findOneAndUpdate(
      { _id: productId, shop: shopId },
      { $set: updateFields },
      { new: true, runValidators: true },
    );
  }

  public static async deleteProductById(
    productId: string,
    shopId: string,
  ): Promise<any> {
    return await Product.deleteOne({ _id: productId, shop: shopId });
  }

  public static async getAllProducts(): Promise<IProduct[]> {
    return await Product.find();
  }

  public static async getFilteredProducts(
    queryParams: any,
  ): Promise<IProduct[]> {
    const query: {
      name?: RegExp;
      category?: string;
    } = {};

    if (queryParams.productName) {
      const sanitizedName = escapeRegExp(queryParams.productName);
      query.name = new RegExp(sanitizedName, 'i');
    }

    if (queryParams.category) {
      query.category = queryParams.category;
    }

    return await Product.find(query).populate('shop', '_id name').exec();
  }

  public static async getProductByShop(shopId: string): Promise<IProduct[]> {
    return await Product.find({ shop: shopId })
      .populate('shop', '_id name')
      .select('-image')
      .exec();
  }

  public static async getLatestProducts(): Promise<IProduct[]> {
    return await Product.find({})
      .sort({ created: -1 })
      .limit(5)
      .populate('shop', '_id name')
      .exec();
  }

  public static async getRelatedProducts(
    productId: string,
  ): Promise<IProduct[]> {
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) throw new Error('Product not found');

    const currentShopId = currentProduct.shop;
    const currentCategory = currentProduct.category;

    const query: {
      _id: { $ne: Types.ObjectId | string };
      shop: Types.ObjectId | undefined;
      category?: string;
    } = {
      _id: { $ne: productId },
      shop: currentShopId,
    };

    if (currentCategory) {
      query.category = currentCategory;
    }

    return await Product.find(query)
      .limit(5)
      .populate('shop', '_id name')
      .exec();
  }

  public static async getProductCategories(): Promise<string[]> {
    return await Product.distinct('category', {});
  }
}
