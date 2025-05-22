"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    fullName: { type: String },
    userName: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ["guest", "user", "creator", "store"],
        default: "guest",
    },
    phone: { type: String },
    email: { type: String },
    age: { type: String },
    gender: { type: String },
    location: { type: String }, //city
    pincode: { type: String },
    businessType: { type: String },
    bio: { type: String },
    coins: { type: Number },
    city: { type: String },
    state: { type: String },
    IPAddress: { type: String },
    offerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Offer" },
    offerCart: { type: Array }, //For Customers
    ouroffers: { type: Array }, //For Creators and Stores
    memberships: {
        membership: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Membership" },
        ending: { type: String },
        status: { type: Boolean, default: false },
        paymentdetails: {
            mode: { type: String },
            amount: { type: Number },
            gstamount: { type: Number },
        },
    },
    gmaplink: { type: String },
    // membershipId: { type: mongoose.Schema.Types.ObjectId, ref: "Membership" },
});
const UserModel = mongoose_1.default.model("User", UserSchema);
exports.default = UserModel;
