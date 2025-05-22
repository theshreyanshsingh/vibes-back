"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOfferStatus = exports.deleteOffer = exports.getAllOffers = exports.getOffer = exports.postOffer = void 0;
const offer_js_1 = __importDefault(require("../models/offer.js"));
const s3_config_js_1 = require("../utils/s3.config.js");
const config_js_1 = require("../utils/config.js");
/**
 * Creates a new offer with proper date validation
 * @param req Request object containing offer details
 * @param res Response object
 */
const postOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, offerName, offerDescription, offerType, type, offerCategory, offerStartDate, offerEndDate, offerPrice, offerDiscount, status = "active", validityPeriod, } = req.body;
        console.log(req.body, "req.body");
        // Validate required fields
        if (!id || !offerName || !offerType) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        let startDate;
        let endDate;
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
            console.log(`Using validity period: ${days} days, Start: ${startDate}, End: ${endDate}`);
        }
        else {
            // No validity period provided, use explicit dates
            if (!offerStartDate || !offerEndDate) {
                res.status(400).json({
                    message: "Either validityPeriod or both offerStartDate and offerEndDate must be provided",
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
            console.log(`Using explicit dates - Start: ${startDate}, End: ${endDate}`);
        }
        let offerImage = "";
        console.log(req.file);
        if (req.file) {
            offerImage = req.file.originalname;
            yield (0, s3_config_js_1.uploads3)(config_js_1.ADS_BUCKET, offerImage, req.file.buffer, req.file.mimetype);
        }
        // Create and save offer
        const offer = new offer_js_1.default({
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
        yield offer.save();
        res.status(201).json({
            success: true,
            offer,
            message: "Offer created successfully",
        });
    }
    catch (error) {
        console.error("Error creating offer:", error);
        // Check if it's a MongoDB validation error
        if (error instanceof Error &&
            "name" in error &&
            error.name === "ValidationError") {
            res.status(400).json({
                message: "Validation error",
                details: error.message,
            });
            return;
        }
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.postOffer = postOffer;
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
const getOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { city } = req.query;
        const currentDate = new Date();
        const offers = yield offer_js_1.default.find({
            status: "active",
            // offerStartDate: { $lte: currentDate },
            offerEndDate: { $gte: currentDate },
        })
            .select("_id id offerName offerDescription offerImage offerType offerCategory offerStartDate offerEndDate offerPrice offerDiscount status link")
            .populate("id", " location city");
        const filteredOffers = offers.filter((offer) => { var _a, _b; return ((_b = (_a = offer.id) === null || _a === void 0 ? void 0 : _a.city) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === city; });
        // Process the offers to include image URLs and remaining time
        const processedOffers = filteredOffers.map((offer) => {
            // Only seelct those offers whose id.location is equal to the city provided in the request body
            const offerObj = offer.toObject();
            // Add full image URL
            if (offerObj.offerImage) {
                offerObj.offerImage = `${config_js_1.BUCKET_URL}${offerObj.offerImage}`;
            }
            return offerObj;
        });
        res.status(200).json(processedOffers);
    }
    catch (error) {
        console.error("Error fetching offers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getOffer = getOffer;
const getAllOffers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const offers = yield offer_js_1.default.find();
        const processedOffers = offers.map((offer) => {
            const offerObj = offer.toObject();
            const url = config_js_1.BUCKET_URL + offerObj.offerImage;
            return Object.assign(Object.assign({}, offerObj), { url });
        });
        res.status(200).json({ success: true, offers: processedOffers });
    }
    catch (error) {
        console.error("Error fetching offers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllOffers = getAllOffers;
const deleteOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const offerId = req.params.id;
        yield offer_js_1.default.findByIdAndDelete(offerId);
        res.status(200).json({ message: "Offer deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting offer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteOffer = deleteOffer;
const updateOfferStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const offerId = req.params.id;
        const { status } = req.body;
        if (!status || !["active", "inactive", "expired"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        const updatedOffer = yield offer_js_1.default.findByIdAndUpdate(offerId, { status }, { new: true });
        if (!updatedOffer) {
            return res.status(404).json({ message: "Offer not found" });
        }
        res.status(200).json({ success: true, offer: updatedOffer });
    }
    catch (error) {
        console.error("Error updating offer status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateOfferStatus = updateOfferStatus;
