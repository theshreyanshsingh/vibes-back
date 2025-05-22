import mongoose, { Document, Schema } from "mongoose";

interface User extends Document {
  fullName: string;
  userName: string;
  type: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  location: string; //city
  pincode: string;
  bio: string;
  coins: number;
  city: string;
  state: string;
  businessType?: string;
  offerId: mongoose.Schema.Types.ObjectId;
  IPAddress?: string;
  offerCart?: mongoose.Schema.Types.ObjectId[];
  ouroffers?: mongoose.Schema.Types.ObjectId[]; //For Creators and Stores
  // membershipId?: mongoose.Schema.Types.ObjectId;
  memberships?: {
    membership: mongoose.Schema.Types.ObjectId;
    ending: string;
    status: boolean;
    paymentdetails: {
      mode: string;
      amount: number;
      gstamount: number;
    };
  };
  gmaplink?: string;
}
const UserSchema = new Schema<User>({
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
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
  offerCart: { type: Array }, //For Customers
  ouroffers: { type: Array }, //For Creators and Stores
  memberships: {
    membership: { type: mongoose.Schema.Types.ObjectId, ref: "Membership" },
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

const UserModel = mongoose.model<User>("User", UserSchema);
export default UserModel;
