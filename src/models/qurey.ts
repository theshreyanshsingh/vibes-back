import mongoose, { Document, Schema } from "mongoose";

const qureySchema = new Schema({
  fullName: { type: String },
  userName: { type: String },
  Email: { type: String },
  Phone: { type: String },
  businessType: { type: String },
  businessAddress: { type: String },
  natureofInquiry: { type: String },
  message: { type: String },
});
const Qurey = mongoose.model("Qurey", qureySchema);

export default Qurey;
