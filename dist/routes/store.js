"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_js_1 = require("../controllers/store.js");
const storeRouter = require("express").Router();
storeRouter.post("/createstore", store_js_1.postStore);
storeRouter.get("/getstore", store_js_1.getStore);
exports.default = storeRouter;
