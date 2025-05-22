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
exports.getContactus = exports.contactus = exports.deleteOffer = exports.deletestore = exports.searchCreators = exports.deleteCreator = exports.getCreatorsAdmin = exports.getCreator = exports.postCreator = void 0;
const creator_js_1 = __importDefault(require("../models/creator.js"));
const config_js_1 = require("../utils/config.js");
const s3_config_1 = require("../utils/s3.config");
const user_js_1 = __importDefault(require("../models/user.js"));
const offer_js_1 = __importDefault(require("../models/offer.js"));
const qurey_js_1 = __importDefault(require("../models/qurey.js"));
const postCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, creatorName, creatorEmail, creatorPhone, creatorType, creatorBio, creatorLocation, creatorAge, creatorGender, creatorCategory, 
        // links to social media
        yt, insta, fb, twitter, tiktok, snap, discord, linkedin, } = req.body;
        console.log(req.body);
        const creator = new creator_js_1.default({
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
            (0, s3_config_1.uploads3)(config_js_1.ADS_BUCKET, objectname, req.file.buffer, req.file.mimetype);
            creator.creatorImage = objectname;
        }
        yield creator.save();
        res.status(201).json({ message: "Creator created successfully" });
        console.log(fullName, creatorName, creatorEmail, creatorPhone, creatorType, creatorBio, creatorLocation, creatorAge, creatorGender, creatorCategory, 
        // links to social media
        yt, insta, fb, twitter, tiktok, snap, discord, linkedin);
    }
    catch (error) {
        console.error("Error creating creator:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.postCreator = postCreator;
const getCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { city } = req.query;
        console.log(req.query, "city");
        if (!city) {
            return res.status(304).json({ message: "City is required" });
        }
        const creators = yield creator_js_1.default.find({ location: city });
        console.log(creators, "creators");
        creators.forEach((creator) => {
            creator.creatorImage = `${config_js_1.BUCKET_URL}${creator.creatorImage}`;
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
    }
    catch (error) {
        console.error("Error fetching creators:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCreator = getCreator;
const getCreatorsAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creators = yield creator_js_1.default.find();
        const processedCreators = creators.map((creator) => (Object.assign(Object.assign({}, creator.toObject()), { imageUrl: `${config_js_1.BUCKET_URL}${creator.creatorImage}` })));
        console.log(processedCreators, "processedCreators");
        res
            .status(200)
            .json({ success: true, processedCreators: processedCreators });
    }
    catch (error) {
        console.error("Error fetching creators:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCreatorsAdmin = getCreatorsAdmin;
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
const deleteCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Assuming you're using MongoDB + Mongoose
        const deleted = yield creator_js_1.default.findByIdAndDelete(id);
        console.log(deleted);
        if (!deleted) {
            res.status(404).json({ message: "Creator not found" });
        }
        res.status(200).json({ message: "Creator deleted successfully" });
    }
    catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.deleteCreator = deleteCreator;
const searchCreators = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        if (!query || typeof query !== "string") {
            return res.status(400).json({ message: "Search query is required" });
        }
        const regex = new RegExp(query, "i"); // case-insensitive search
        const results = yield creator_js_1.default.find({
            $or: [
                { fullName: regex },
                { creatorName: regex },
                { creatorEmail: regex },
            ],
        });
        return res.status(200).json(results);
    }
    catch (error) {
        console.error("Search Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.searchCreators = searchCreators;
// Apis for admin
const deletestore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // const offers=await offer.find({id:id})
        yield offer_js_1.default.deleteMany({ id: id });
        // Assuming you're using MongoDB + Mongoose
        const store = yield user_js_1.default.findByIdAndDelete(id);
        if (!store) {
            res.status(404).json({ message: "Store not found" });
        }
        res.status(200).json({ message: "Creator deleted successfully" });
    }
    catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.deletestore = deletestore;
const deleteOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Assuming you're using MongoDB + Mongoose
        const Offer = yield offer_js_1.default.findByIdAndDelete(id);
        if (!Offer) {
            res.status(404).json({ message: "Offer not found" });
        }
        res.status(200).json({ message: "Offer deleted successfully" });
    }
    catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.deleteOffer = deleteOffer;
const contactus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, userName, Phone, Email, businessType, message, natureofInquiry, businessAddress, } = req.body;
        const contact = new qurey_js_1.default({
            fullName,
            userName,
            Phone,
            Email,
            businessType,
            message,
            natureofInquiry,
            businessAddress,
        });
        yield contact.save();
        res.status(200).json({
            success: true,
            message: "Contact us added successfully",
        });
    }
    catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.contactus = contactus;
const getContactus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contact = yield qurey_js_1.default.find();
        res.status(200).json({ success: true, contact });
    }
    catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getContactus = getContactus;
