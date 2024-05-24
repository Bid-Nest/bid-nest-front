import mongoose, { Document, Schema } from "mongoose";
import crypto from "crypto";

interface IUser extends Document {
  name: string;
  email: string;
  hashed_password: string;
  salt: string;
  updated?: Date;
  created: Date;
  seller: boolean;
  _password?: string;
  authenticate: (plainText: string) => boolean;
  encryptPassword: (password: string) => string;
  genSalt: () => string;
}

const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    match: [/.+@.+\..+/, "Please fill a valid email address"],
    required: [true, "Email is required"],
  },
  hashed_password: {
    type: String,
    required: [true, "Password is required"],
  },
  salt: {
    type: String,
  },
  updated: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  seller: {
    type: Boolean,
    default: false,
  }
});

userSchema
  .virtual("password")
  .set(function (this: IUser, password: string) {
    this._password = password;
    this.salt = this.genSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function (this: IUser) {
    return this._password;
  });

userSchema.path("hashed_password").validate(function (this: IUser) {
  if (this._password && this._password.length < 6) {
    this.invalidate("password", "Password must be at least 6 characters.");
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "Password is required");
  }
});

userSchema.methods = {
  authenticate: function (this: IUser, plainText: string): boolean {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (this: IUser, password: string): string {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  genSalt: function (this: IUser): string {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

export default mongoose.model<IUser>("User", userSchema);
