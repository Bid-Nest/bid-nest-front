import mongoose, { Document, Types } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  name: string;
  email: string;
  hashed_password: string;
  salt: string;
  updated?: Date;
  created: Date;
  seller: boolean;
  password?: string;
  authenticate: (plainText: string) => boolean;
  encryptPassword: (password: string) => string;
  genSalt: () => string;
  _id: mongoose.Types.ObjectId;
}

export interface IShop extends Document {
  name: string;
  image?: {
    data: Buffer;
    contentType: string;
  };
  description?: string;
  updated?: Date;
  created: Date;
  owner: mongoose.Types.ObjectId;
}

export interface IProduct extends Document {
  name: string;
  image: {
    data: Buffer;
    contentType: string;
  };
  description?: string;
  category?: string;
  quantity: number;
  price: number;
  updated?: Date;
  created: Date;
  shop: Types.ObjectId;
}

export interface ICartItem extends Document {
  product: Types.ObjectId;
  quantity: number;
  shop: Types.ObjectId;
  status:
    | 'Not processed'
    | 'Processing'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled';
}

export interface IOrder extends Document {
  products: Types.DocumentArray<ICartItem>;
  customer_name: string;
  customer_email: string;
  delivery_address: {
    street: string;
    city: string;
    state?: string;
    zipcode: string;
    country: string;
  };
  payment_id?: never;
  updated?: Date;
  created: Date;
  user: Types.ObjectId;
}

export interface IDecodedToken {
  _id: string;
  name: string;
  email: string;
  seller: boolean;
  iat: number;
  exp: number;
}

// IBidInfo Interface
export interface IBidInfo {
  bidder: string;
  bid: number;
  timestamp: Date;
}

export interface IAuction extends Document {
  itemName: string;
  description?: string;
  image: {
    data: Buffer;
    contentType: string;
  };
  updated?: Date;
  created: Date;
  bidStart: Date;
  bidEnd: Date;
  seller: Types.ObjectId;
  startingBid: number;
  bids: {
    bidder: Types.ObjectId;
    bid: number;
    time: Date;
  }[];
}

export interface IUserRequest extends Request {
  user?: IUser;
}

export interface IShopRequest extends Request {
  user: IUser;
  shop: IShop;
}

export interface ISearchRequest extends Request {
  query: {
    productName?: string;
    category?: string;
  };
}

export interface ICSRFTokenRequest extends Request {
  csrfToken: () => string;
}

export interface IAuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    seller: boolean;
    iat: number;
    exp: number;
  };
}
