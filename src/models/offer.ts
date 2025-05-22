import mongoose, { Schema, Document } from "mongoose";

export interface IOffer extends Document {
  id: mongoose.Schema.Types.ObjectId;
  offerName: string;
  offerDescription: string;
  offerImage: string;
  offerType: string;
  offerCategory: string;
  offerStartDate: Date;
  offerEndDate: Date;
  offerPrice: number;
  offerDiscount: number;
  storeName?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  link: string;
}

const OfferSchema = new Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
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
  },
  {
    timestamps: true,
  }
);

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

export default mongoose.model<IOffer>("Offer", OfferSchema);
