import express from "express";
import multer from "multer";
import {
  deleteCreator,
  getCreator,
  postCreator,
  getCreatorsAdmin,
  contactus,
  getContactus,
  searchCreators,
  deletestore,
} from "../controllers/creator.js";
import { deleteOffer } from "../controllers/offer.js";

const upload = multer({ storage: multer.memoryStorage() });

const creatorrouter = express.Router();

creatorrouter.post("/postCreator", upload.single("creatorImage"), postCreator);
creatorrouter.get("/getCreators", getCreator);
creatorrouter.get("/getCreatorsAdmin", getCreatorsAdmin);
creatorrouter.post("/deleteCreator/:id", deleteCreator);
creatorrouter.get("/searchCreators", searchCreators);
creatorrouter.post("/qurey", contactus);
creatorrouter.get("/getQurey", getContactus);
creatorrouter.post("/deletestore/:id", deletestore);
creatorrouter.post("/deleteOffer/:id", deleteOffer);

export default creatorrouter;
