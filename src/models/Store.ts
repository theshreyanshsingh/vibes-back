import mongoose, { Document, Schema } from "mongoose";

const createstoreSchema = new Schema({
  storeName: { type: String, unique: true },
  ownerName: { type: String },
  Email: { type: String },
  Phone: { type: String },
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
});
const Createstore = mongoose.model("Createstore", createstoreSchema);

export default Createstore;
