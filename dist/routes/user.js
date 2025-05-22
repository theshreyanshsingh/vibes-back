"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_js_1 = require("../controllers/user.js");
const userRouter = require("express").Router();
userRouter.post("/createuser", user_js_1.createUser);
userRouter.post("/createGuestUser", user_js_1.createGuestUser);
userRouter.get("/getUser", user_js_1.getUser);
exports.default = userRouter;
