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
const OfferSchema = new mongoose_1.Schema({
    id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: "User" },
    offerName: {
        type: String,
    },
    offerDescription: {
        type: String,
    },
    offerImage: {
        type: String,
    },
    type: {
        type: String,
        enum: ["online", "offline"],
    },
    offerType: {
        type: String,
        enum: ["trending", "hot", "regular", "flash", "event"],
    },
    offerCategory: {
        type: String,
    },
    offerStartDate: {
        type: Date,
    },
    offerEndDate: {
        type: Date,
    },
    offerPrice: {
        type: Number,
    },
    offerDiscount: {
        type: Number,
    },
    storeName: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "inactive", "expired"],
        default: "active",
    },
    link: {
        type: String,
    },
}, {
    timestamps: true,
});
// Set up an index for efficient queries on date fields
OfferSchema.index({ offerEndDate: 1 });
OfferSchema.index({ offerStartDate: 1 });
OfferSchema.index({ status: 1 });
// Middleware to auto-update status based on dates
OfferSchema.pre("find", function () {
    const currentDate = new Date();
    this.where({
        status: "active",
        offerEndDate: { $gte: currentDate },
    });
});
exports.default = mongoose_1.default.model("Offer", OfferSchema);
