import User from 'models/userModel';
import sanitize from 'mongo-sanitize';
import { Types } from 'mongoose';

export class UserService {
  private isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }
  public async getUserById(userId: string) {
    if (!this.isValidObjectId(userId)) {
      throw new Error('Invalid user ID');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  public async readUserProfile(userId: string) {
    if (!this.isValidObjectId(userId)) {
      throw new Error('Invalid user ID');
    }

    const user = await User.findById(userId, { hashed_password: 0, salt: 0 });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  public async getAllUsers() {
    return await User.find();
  }

  public async updateUserById(userId: string, updateData: any) {
    if (!this.isValidObjectId(userId)) {
      throw new Error('Invalid user ID');
    }

    if (typeof updateData !== 'object' || Array.isArray(updateData)) {
      throw new Error('Invalid update data');
    }

    const sanitizedUpdateData = sanitize(updateData);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: sanitizedUpdateData },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }

  public async deleteUserById(userId: string) {
    if (!this.isValidObjectId(userId)) {
      throw new Error('Invalid user ID');
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new Error('User not found');
    }

    return { message: 'User deleted successfully' };
  }
}
