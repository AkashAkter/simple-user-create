import { IUser, ILoginUserInput, IUserLoginResponse } from "./user.interface";
import User from "./user.model";
import ApiError from "../../utils/ApiError";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../../../config";

const createUser = async (userData: IUser): Promise<IUser> => {
  const existingUser = await User.isUserExist(userData.email);
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "Email already exists");
  }

  // Set default role if not provided
  if (!userData.role) {
    userData.role = "regular";
  }

  const user = await User.create(userData);
  return user;
};

const loginUser = async (
  payload: ILoginUserInput
): Promise<IUserLoginResponse> => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordMatched(password);
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  const tokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(tokenPayload, config.jwt.secret);

  return {
    accessToken: token,
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const UserService = {
  createUser,
  loginUser,
};
