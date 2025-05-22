import mongoose, { Schema } from "mongoose";

interface Creator {
  fullName: string;
  creatorName: string;
  creatorEmail: string;
  creatorPhone: string;
  creatorImage: string;
  creatorType: string;
  creatorBio: string;
  creatorLocation: string;
  creatorAge: number;
  creatorGender: string;
  creatorCategory: string;
  // links to social media
  yt: string;
  insta: string;
  fb: string;
  twitter: string;
  tiktok: string;
  snap: string;
  discord: string;
  linkedin: string;
}

const CreatorSchema = new Schema<Creator>({
  fullName: { type: String, required: true },
  creatorName: { type: String },
  creatorEmail: { type: String, unique: true },
  creatorPhone: { type: String },
  creatorImage: { type: String },
  creatorType: { type: String },
  creatorBio: { type: String },
  creatorLocation: { type: String },
  creatorAge: { type: Number },
  creatorGender: { type: String },
  creatorCategory: { type: String },
  //links to social mediaw
  yt: { type: String },
  insta: { type: String },
  fb: { type: String },
  twitter: { type: String },
  tiktok: { type: String },
  snap: { type: String },
  discord: { type: String },
  linkedin: { type: String },
});
export default mongoose.model<Creator>("Creator", CreatorSchema);
export { Creator };
