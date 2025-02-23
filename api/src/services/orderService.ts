import mongoose from 'mongoose';
import { Order } from 'models/orderModel';
import { CartItem } from 'models/cartItemModel';

export class OrderService {
  public static async createOrder(orderData: any) {
    const order = new Order(orderData);
    return await order.save();
  }

  public static async getOrdersByShop(shopId: mongoose.Types.ObjectId) {
    return await Order.find({ 'products.shop': shopId })
      .populate({ path: 'products.product', select: '_id name price' })
      .sort('-created')
      .exec();
  }

  public static async getOrderById(orderId: mongoose.Types.ObjectId) {
    return await Order.findById(orderId)
      .populate('products.product', 'name price')
      .populate('products.shop', 'name')
      .exec();
  }

  public static async getOrdersByUser(userId: mongoose.Types.ObjectId) {
    return await Order.find({ user: userId }).sort('-created').exec();
  }

  public static getOrderStatusValues() {
    type SchemaTypeWithEnumValues = mongoose.Schema.Types.String & {
      enumValues: string[];
    };
    const statusPath = CartItem.schema.path(
      'status',
    ) as SchemaTypeWithEnumValues;
    return statusPath.enumValues;
  }
}
