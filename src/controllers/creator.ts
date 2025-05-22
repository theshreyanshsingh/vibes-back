import { Request, Response } from "express";
import Creator from "../models/creator.js";
import { ADS_BUCKET, BUCKET_URL } from "../utils/config.js";
import { uploads3 } from "../utils/s3.config";
import UserModel from "../models/user.js";
import offer from "../models/offer.js";
import Qurey from "../models/qurey.js";

export const postCreator = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      creatorName,
      creatorEmail,
      creatorPhone,
      creatorType,
      creatorBio,
      creatorLocation,
      creatorAge,
      creatorGender,
      creatorCategory,
      // links to social media
      yt,
      insta,
      fb,
      twitter,
      tiktok,
      snap,
      discord,
      linkedin,
    } = req.body;
    console.log(req.body);
    const creator = new Creator({
      fullName,
      creatorName,
      creatorEmail,
      creatorPhone,
      creatorType,
      creatorBio,
      creatorLocation,
      creatorAge,
      creatorGender,
      creatorCategory,
      // links to social media
      yt,
      insta,
      fb,
      twitter,
      tiktok,
      snap,
      discord,
      linkedin,
    });

    if (req.file) {
      let objectname = req.file.originalname;
      console.log("objectname", objectname);
      uploads3(ADS_BUCKET, objectname, req.file.buffer, req.file.mimetype);
      creator.creatorImage = objectname;
    }

    await creator.save();
    res.status(201).json({ message: "Creator created successfully" });
    console.log(
      fullName,
      creatorName,
      creatorEmail,
      creatorPhone,
      creatorType,
      creatorBio,
      creatorLocation,
      creatorAge,
      creatorGender,
      creatorCategory,
      // links to social media
      yt,
      insta,
      fb,
      twitter,
      tiktok,
      snap,
      discord,
      linkedin
    );
  } catch (error) {
    console.error("Error creating creator:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getCreator = async (req: Request, res: Response): Promise<any> => {
  try {
    const { city } = req.query;
    console.log(req.query, "city");
    if (!city) {
      return res.status(304).json({ message: "City is required" });
    }
    const creators = await Creator.find({ location: city });
    console.log(creators, "creators");
    creators.forEach((creator) => {
      creator.creatorImage = `${BUCKET_URL}${creator.creatorImage}`;
    });
    // const processedCreators = creators.map((creators) => {
    //   console.log(creators);
    //   // const creator = creators.toObject();

    //   // Add full image URL
    //   // if (creator.creatorImage) {
    //   creators.creatorImage = `${BUCKET_URL}${creators.creatorImage}`;
    //   // }
    // });
    console.log(creators, "creators");
    res.status(200).json({ success: true, creators });
  } catch (error) {
    console.error("Error fetching creators:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getCreatorsAdmin = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const creators = await Creator.find();
    const processedCreators = creators.map((creator) => ({
      ...creator.toObject(),
      imageUrl: `${BUCKET_URL}${creator.creatorImage}`,
    }));
    console.log(processedCreators, "processedCreators");

    res
      .status(200)
      .json({ success: true, processedCreators: processedCreators });
  } catch (error) {
    console.error("Error fetching creators:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// export const deleteCreator = async (req: Request, res: Response) => {
//   try {
//     const creatorId = req.params.id;
//     await Creator.findByIdAndDelete(creatorId);
//     res.status(200).json({ message: "Creator deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting creator:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// controllers/creatorController.js

export const deleteCreator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Assuming you're using MongoDB + Mongoose
    const deleted = await Creator.findByIdAndDelete(id);
    console.log(deleted);
    if (!deleted) {
      res.status(404).json({ message: "Creator not found" });
    }

    res.status(200).json({ message: "Creator deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchCreators = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const regex = new RegExp(query, "i"); // case-insensitive search

    const results = await Creator.find({
      $or: [
        { fullName: regex },
        { creatorName: regex },
        { creatorEmail: regex },
      ],
    });

    return res.status(200).json(results);
  } catch (error) {
    console.error("Search Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Apis for admin
export const deletestore = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // const offers=await offer.find({id:id})
    await offer.deleteMany({ id: id });
    // Assuming you're using MongoDB + Mongoose
    const store = await UserModel.findByIdAndDelete(id);

    if (!store) {
      res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json({ message: "Creator deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Assuming you're using MongoDB + Mongoose
    const Offer = await offer.findByIdAndDelete(id);

    if (!Offer) {
      res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const contactus = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      userName,
      Phone,
      Email,
      businessType,
      message,
      natureofInquiry,
      businessAddress,
    } = req.body;

    const contact = new Qurey({
      fullName,
      userName,
      Phone,
      Email,
      businessType,
      message,
      natureofInquiry,
      businessAddress,
    });
    await contact.save();
    res.status(200).json({
      success: true,
      message: "Contact us added successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getContactus = async (req: Request, res: Response) => {
  try {
    const contact = await Qurey.find();
    res.status(200).json({ success: true, contact });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
