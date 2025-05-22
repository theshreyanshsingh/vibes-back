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
exports.getStore = exports.postStore = void 0;
const Store_1 = __importDefault(require("../models/Store"));
const postStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storeName, ownerName, Email, Phone, offerId } = req.body;
        console.log(req.body);
        const store = new Store_1.default({
            storeName,
            ownerName,
            Email,
            Phone,
        });
        yield store.save();
        res
            .status(201)
            .json({ success: true, message: "Store created successfully" });
    }
    catch (error) {
        console.error("Error creating store:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.postStore = postStore;
const getStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stores = yield Store_1.default.find().populate("offerId");
        res.status(200).json(stores);
    }
    catch (error) {
        console.error("Error fetching stores:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getStore = getStore;
