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
exports.getUser = exports.createGuestUser = exports.createUser = void 0;
const user_js_1 = __importDefault(require("../models/user.js"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, userName, type, email, phone, age, gender, location, bio, coins, businessType, city, state, pincode, gmaplink, } = req.body;
        console.log(req.body);
        const user = new user_js_1.default({
            fullName,
            userName,
            type,
            email,
            phone,
            age,
            gender,
            location,
            pincode,
            bio,
            coins,
            businessType,
            city,
            state,
            gmaplink,
        });
        yield user.save();
        res
            .status(201)
            .json({ success: true, message: "User created successfully" });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createUser = createUser;
//guest user
const createGuestUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hii");
    try {
        const { IPAddress } = req.body;
        const userName = "guest" + Math.floor(Math.random() * 1000000);
        console.log(req.body, userName);
        const user = new user_js_1.default({
            userName,
            IPAddress,
            type: "guest",
        });
        yield user.save();
        res.status(201).json({
            success: true,
            message: "Guest User created successfully",
            data: user,
        });
    }
    catch (error) {
        console.error("Error creating guest user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createGuestUser = createGuestUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_js_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUser = getUser;
