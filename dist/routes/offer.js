"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const offer_js_1 = require("../controllers/offer.js");
// import { postOffer } from "./controllers/offerController";
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = express_1.default.Router();
// ✅ Ensure that "offerImage" matches what the frontend is sending
router.post("/postOffer", upload.single("offerImage"), offer_js_1.postOffer);
router.get("/getOffer", offer_js_1.getOffer);
router.get("/getAllOffers", offer_js_1.getAllOffers);
exports.default = router;
