import User from 'models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from 'config/index';
import { IUser } from 'interfaces/User';

export class AuthService {
  static async register(userData: IUser) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) throw new Error('Email already exists');

    const salt = await bcrypt.genSalt(config.saltRounds);
    const hashedPassword = await bcrypt.hash(userData.password!, salt);

    const user = new User({
      ...userData,
      salt,
      hashed_password: hashedPassword,
    });
    await user.save();

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      seller: user.seller,
    };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) throw new Error('Password does not match');

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        seller: user.seller,
      },
      config.jwtSecret!,
      { expiresIn: config.tokenDuration },
    );

    return { token, user };
  }
}
