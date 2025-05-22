"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MembershipSchema = new mongoose_1.Schema({
    title: { type: String },
    type: { type: String },
    description: { type: String },
    price: { type: Number },
    duration: { type: Number }, // in days
    discount: { type: Number },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
});
