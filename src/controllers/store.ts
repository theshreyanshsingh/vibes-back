import { Request, Response } from "express";
import Createstore from "../models/Store";

interface StoreRequestBody {
  storeName: string;
  ownerName: string;
  Email: string;
  Phone: string;
  offerId: string;
}

export const postStore = async (
  req: Request<{}, {}, StoreRequestBody>,
  res: Response
) => {
  try {
    const { storeName, ownerName, Email, Phone, offerId } = req.body;
    console.log(req.body);
    const store = new Createstore({
      storeName,
      ownerName,
      Email,
      Phone,
    });
    await store.save();
    res
      .status(201)
      .json({ success: true, message: "Store created successfully" });
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStore = async (req: Request, res: Response) => {
  try {
    const stores = await Createstore.find().populate("offerId");
    res.status(200).json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
