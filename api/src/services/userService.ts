import User from 'models/userModel';

export class UserService {
  public async getUserById(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  public async readUserProfile(userId: string) {
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
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
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
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new Error('User not found');
    }

    return { message: 'User deleted successfully' };
  }
}
