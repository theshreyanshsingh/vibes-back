import { Request, Response } from "express";
import Offer from "../models/offer.js";
import { pre_s3, uploads3 } from "../utils/s3.config.js";
import { ADS_BUCKET, BUCKET_NAME, BUCKET_URL } from "../utils/config.js";

interface OfferRequestBody {
  id?: string; // Optional ID field
  offerName: string;
  offerDescription: string;
  offerImage: string;
  offerType: string;
  offerCategory: string;
  offerStartDate: Date;
  offerEndDate: Date;
  offerPrice: number;
  offerDiscount: number;
  status: string;
}

interface OfferBody {
  id: string;
  offerName: string;
  offerDescription: string;
  offerType: string;
  type: string;
  offerCategory: string;
  offerStartDate?: string | string[];
  offerEndDate?: string | string[];
  offerPrice: number;
  offerDiscount: number;
  status?: string;
  validityPeriod?: string;
  offerImage?: string;
}

/**
 * Creates a new offer with proper date validation
 * @param req Request object containing offer details
 * @param res Response object
 */
export const postOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      id,
      offerName,
      offerDescription,
      offerType,
      type,
      offerCategory,
      offerStartDate,
      offerEndDate,
      offerPrice,
      offerDiscount,
      status = "active",

      validityPeriod,
    } = req.body as OfferBody;
    console.log(req.body, "req.body");
    // Validate required fields
    if (!id || !offerName || !offerType) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    let startDate: Date;
    let endDate: Date;

    console.log("Request body:", req.body);

    // Handle date setting based on validityPeriod or explicit dates
    if (validityPeriod !== undefined && validityPeriod !== "") {
      const days = parseInt(validityPeriod, 10);

      if (isNaN(days) || days <= 0) {
        res.status(400).json({
          message: "Validity period must be a positive number",
        });
        return;
      }

      // Use current date as start date
      startDate = new Date();
      // Add validity period (days) to start date
      endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

      console.log(
        `Using validity period: ${days} days, Start: ${startDate}, End: ${endDate}`
      );
    } else {
      // No validity period provided, use explicit dates
      if (!offerStartDate || !offerEndDate) {
        res.status(400).json({
          message:
            "Either validityPeriod or both offerStartDate and offerEndDate must be provided",
        });
        return;
      }

      // Handle array or string inputs for dates
      const startDateValue = Array.isArray(offerStartDate)
        ? offerStartDate[0]
        : offerStartDate;
      const endDateValue = Array.isArray(offerEndDate)
        ? offerEndDate[0]
        : offerEndDate;

      // Parse dates and validate
      startDate = new Date(startDateValue);
      endDate = new Date(endDateValue);

      if (isNaN(startDate.getTime())) {
        res.status(400).json({
          message: "Invalid start date format",
          providedValue: startDateValue,
        });
        return;
      }

      if (isNaN(endDate.getTime())) {
        res.status(400).json({
          message: "Invalid end date format",
          providedValue: endDateValue,
        });
        return;
      }

      if (endDate <= startDate) {
        res.status(400).json({
          message: "End date must be after start date",
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
        return;
      }

      console.log(
        `Using explicit dates - Start: ${startDate}, End: ${endDate}`
      );
    }
    let offerImage = "";
    console.log(req.file);
    if (req.file) {
      offerImage = req.file.originalname;
      await uploads3(
        ADS_BUCKET,
        offerImage,
        req.file.buffer,
        req.file.mimetype
      );
    }

    // Create and save offer
    const offer = new Offer({
      id,
      offerName,
      offerDescription,
      offerType,
      offerCategory,
      offerStartDate: startDate,
      offerEndDate: endDate,
      offerPrice,
      type,
      offerDiscount,
      offerImage,
      status,
    });

    await offer.save();
    res.status(201).json({
      success: true,
      offer,
      message: "Offer created successfully",
    });
  } catch (error) {
    console.error("Error creating offer:", error);

    // Check if it's a MongoDB validation error
    if (
      error instanceof Error &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      res.status(400).json({
        message: "Validation error",
        details: error.message,
      });
      return;
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

export const presigned = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileName, fileType } = req.body;

    const params = {
      Bucket: BUCKET_NAME,
      Key: `projects}/uploads/${fileName}`,
      Expires: 60,
      ContentType: fileType,
    };

    const uploadURL = await pre_s3.getSignedUrlPromise("putObject", params);
    res.json({
      uploadURL,
      url: `${BUCKET_URL}/projects/uploads/${fileName}`,
      key: params.Key,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to generate pre-signed URL" });
  }
};

// export const getOffer = async (req: Request, res: Response) => {
//   try {
//     const currentDate = new Date();

//     const offers = await Offer.find({
//       status: "active",
//       offerStartDate: { $lte: currentDate },
//       offerEndDate: { $gte: currentDate },
//     });
//     // Process the offers to include image URLs and remaining time
//     const processedOffers = offers.map((offer) => {
//       const offerObj = offer.toObject();

//       // Add full image URL
//       if (offerObj.offerImage) {
//         offerObj.offerImage = `${BUCKET_URL}${offerObj.offerImage}`;
//       }

//       return offerObj;
//     });

//     res.status(200).json(processedOffers);
//   } catch (error) {
//     console.error("Error fetching offers:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
export const getOffer = async (req: Request, res: Response) => {
  try {
    const { city } = req.query;

    const currentDate = new Date();

    const offers = await Offer.find({
      status: "active",
      // offerStartDate: { $lte: currentDate },
      offerEndDate: { $gte: currentDate },
    })
      .select(
        "_id id offerName offerDescription offerImage offerType offerCategory offerStartDate offerEndDate offerPrice offerDiscount status link"
      )
      .populate("id", " location city");

    const filteredOffers = offers.filter(
      (offer) => offer.id?.city?.toLowerCase() === city
    );
    // Process the offers to include image URLs and remaining time
    const processedOffers = filteredOffers.map((offer) => {
      // Only seelct those offers whose id.location is equal to the city provided in the request body

      const offerObj = offer.toObject();

      // Add full image URL
      if (offerObj.offerImage) {
        offerObj.offerImage = `${BUCKET_URL}${offerObj.offerImage}`;
      }

      return offerObj;
    });

    res.status(200).json(processedOffers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllOffers = async (req: Request, res: Response) => {
  try {
    const offers = await Offer.find();

    const processedOffers = offers.map((offer) => {
      const offerObj = offer.toObject();

      const url = BUCKET_URL + offerObj.offerImage;

      return {
        ...offerObj,
        url,
      };
    });

    res.status(200).json({ success: true, offers: processedOffers });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteOffer = async (req: Request, res: Response) => {
  try {
    const offerId = req.params.id;
    await Offer.findByIdAndDelete(offerId);
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOfferStatus = async (req: Request, res: Response) => {
  try {
    const offerId = req.params.id;
    const { status } = req.body;

    if (!status || !["active", "inactive", "expired"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      offerId,
      { status },
      { new: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json({ success: true, offer: updatedOffer });
  } catch (error) {
    console.error("Error updating offer status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
