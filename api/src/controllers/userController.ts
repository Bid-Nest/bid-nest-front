import { Request, Response, NextFunction } from 'express';
import { IUserRequest } from 'interfaces/requests/UserRequest';
import { UserService } from 'services/UserService';

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.getUserById(req.params.userId);
      res.status(200).json(user);
    } catch (error) {
      console.error('Error retrieving user:', error);
      res
        .status(500)
        .json({ error: error.message || 'Failed to retrieve user' });
    }
  }

  async readUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.readUserProfile(req.params.userId);
      res.status(200).json(user);
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      res
        .status(500)
        .json({ error: error.message || 'Failed to retrieve user profile' });
    }
  }

  async getAllUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error retrieving all users:', error);
      res
        .status(500)
        .json({ error: error.message || 'Failed to retrieve all users' });
    }
  }

  async updateUserById(req: Request, res: Response): Promise<void> {
    try {
      const updatedUser = await this.userService.updateUserById(
        req.params.userId,
        req.body,
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: error.message || 'Failed to update user' });
    }
  }

  async deleteUserById(req: Request, res: Response): Promise<void> {
    try {
      await this.userService.deleteUserById(req.params.userId);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: error.message || 'Failed to delete user' });
    }
  }
}
