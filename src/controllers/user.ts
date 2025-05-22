import { Request, Response } from "express";
import UserModel from "../models/user.js";

interface CreateUserRequestBody {
  fullName: string;
  userName: string;
  type: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  IPAddress?: string;
  offerId?: string;
  location: string;
  city: string;
  state: string;
  pincode: string;
  gmaplink: string;
  bio: string;
  coins: number;
  businessType?: string;
}

export const createUser = async (
  req: Request<{}, {}, CreateUserRequestBody>,
  res: Response
) => {
  try {
    const {
      fullName,
      userName,
      type,
      email,
      phone,
      age,
      gender,
      location,
      bio,
      coins,
      businessType,
      city,
      state,
      pincode,
      gmaplink,
    } = req.body;
    console.log(req.body);
    const user = new UserModel({
      fullName,
      userName,
      type,
      email,
      phone,
      age,
      gender,
      location,
      pincode,
      bio,
      coins,
      businessType,
      city,
      state,
      gmaplink,
    });
    await user.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//guest user
export const createGuestUser = async (
  req: Request<{}, {}, CreateUserRequestBody>,
  res: Response
) => {
  console.log("hii");
  try {
    const { IPAddress } = req.body;
    const userName = "guest" + Math.floor(Math.random() * 1000000);
    console.log(req.body, userName);
    const user = new UserModel({
      userName,
      IPAddress,
      type: "guest",
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: "Guest User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error creating guest user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
