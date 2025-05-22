import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import storeRouter from "./routes/store.js";
import offerRouter from "./routes/offer.js";
import creatorrouter from "./routes/creator.js";
import morgan from "morgan";
import userRouter from "./routes/user.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", storeRouter);
app.use("/api", offerRouter);
app.use("/api", creatorrouter);
app.use("/api", userRouter);
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Hello, Express with TypeScript and MongoDB!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
