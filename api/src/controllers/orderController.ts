import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { handleError } from 'utils/errorHandler';
import { OrderService } from 'services/orderService'; // Import the refactored OrderService

export class OrderController {
  public static async createOrder(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      req.body.order.user = userId;
      const result = await OrderService.createOrder(req.body.order);
      return res.status(201).json(result);
    } catch (error) {
      return handleError(res, error, 'Error creating order:');
    }
  }

  public static async getOrderByShop(req: Request, res: Response) {
    try {
      const shopId = req.params.shopId;
      const orders = await OrderService.getOrdersByShop(shopId);
      if (!orders || orders.length === 0) {
        return res
          .status(404)
          .json({ error: 'No orders found for the specified shop' });
      }
      return res.status(200).json(orders);
    } catch (error) {
      return handleError(res, error, 'Error fetching orders by shop:');
    }
  }
  public static async getOrderById(req: Request, res: Response) {
    try {
      const orderId = req.params.orderId;
      const order = await OrderService.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.status(200).json(order);
    } catch (error) {
      return handleError(res, error, 'Error fetching order by ID:');
    }
  }

  public static async getOrderByUser(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const orders = await OrderService.getOrdersByUser(userId);
      return res.status(200).json(orders);
    } catch (error) {
      return handleError(res, error, 'Error fetching orders by user:');
    }
  }

  public static getOrderStatusValues(_req: Request, res: Response) {
    try {
      const statusValues = OrderService.getOrderStatusValues();
      return res.status(200).json(statusValues);
    } catch (error) {
      return handleError(res, error, 'Error retrieving order status values:');
    }
  }
}
