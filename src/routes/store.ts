import { getStore, postStore } from "../controllers/store.js";

const storeRouter = require("express").Router();

storeRouter.post("/createstore", postStore);
storeRouter.get("/getstore", getStore);
export default storeRouter;
