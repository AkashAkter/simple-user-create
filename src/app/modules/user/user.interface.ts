import mongoose, { Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "regular" | "admin"; // required now
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILoginUserInput {
  email: string;
  password: string;
}

export interface IUserLoginResponse {
  accessToken: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: "regular" | "admin"; // Make sure role here is strict
  };
}

export interface IUserMethods {
  isPasswordMatched(password: string): Promise<boolean>;
}

export type UserModel = {
  isUserExist(
    email: string
  ): Promise<Pick<IUser, "email" | "password"> & { _id: Types.ObjectId }>;
} & mongoose.Model<IUser, object, IUserMethods>;
