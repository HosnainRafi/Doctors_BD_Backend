import { Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  isActive?: boolean;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}
