import express from "express";
import multer from "multer";
import {
  getAllOffers,
  getOffer,
  postOffer,
  presigned,
} from "../controllers/offer.js";
// import { postOffer } from "./controllers/offerController";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// ✅ Ensure that "offerImage" matches what the frontend is sending
router.post("/postOffer", upload.single("offerImage"), postOffer);
router.get("/getOffer", getOffer);
router.get("/getAllOffers", getAllOffers);
router.post("/get-presigned-url", presigned);

export default router;
