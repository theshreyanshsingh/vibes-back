import { createGuestUser, createUser, getUser } from "../controllers/user.js";

const userRouter = require("express").Router();

userRouter.post("/createuser", createUser);
userRouter.post("/createGuestUser", createGuestUser);
userRouter.get("/getUser", getUser);
export default userRouter;
