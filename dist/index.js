"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const store_js_1 = __importDefault(require("./routes/store.js"));
const offer_js_1 = __importDefault(require("./routes/offer.js"));
const creator_js_1 = __importDefault(require("./routes/creator.js"));
const morgan_1 = __importDefault(require("morgan"));
const user_js_1 = __importDefault(require("./routes/user.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use("/api", store_js_1.default);
app.use("/api", offer_js_1.default);
app.use("/api", creator_js_1.default);
app.use("/api", user_js_1.default);
// Connect to MongoDB
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
app.get("/", (req, res) => {
    res.send("Hello, Express with TypeScript and MongoDB!");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
