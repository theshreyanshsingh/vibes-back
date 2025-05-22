import dotenv from "dotenv";

dotenv.config();
export const PORT: number | undefined | string = process.env.PORT;
export const DATABASE: string = process.env.DATABASE || "";
export const BUCKET_REGION: string = process.env.BUCKET_REGION || "";
export const AWS_ACCESS_KEY: string = process.env.AWS_ACCESS_KEY || "";
export const AWS_SECRET_KEY: string = process.env.AWS_SECRET_KEY || "";
export const MY_SECRET_KEY = process.env.MY_SECRET_KEY || "";
export const BUCKET_NAME = process.env.BUCKET_NAME || "bucage";
export const POST_BUCKET = process.env.POST_BUCKET || "post-ing";
export const PRODUCT_BUCKET = process.env.PRODUCT_BUCKET || "product-s";
export const ADS_BUCKET = process.env.ADS_BUCKET || "offervibes";
export const URL = process.env.URL || "https://dn3w8358m09e7.cloudfront.net/";
export const AD_URL = "https://dp5wpbz0px6y7.cloudfront.net/";
export const POST_URL =
  process.env.POST_URL || "https://dt46iilh1kepb.cloudfront.net/";
export const PRODDB = process.env.PRODDB;
export const NEXO_BUCKET = process.env.NEXO_BUCKET || "nexoo";
export const NEXO_URL =
  process.env.Nexoo_URL || "https://d3o079xut1n1hu.cloudfront.net/";
export const TESTDB =
  process.env.TESTDB ||
  "mongodb://admin:admin123@13.201.18.253:27017/?authMechanism=DEFAULT";
export const PRODUCT_URL =
  process.env.PRODUCT_URL || "https://d2a79j8kmqfrmq.cloudfront.net/";
export const MSG_URL =
  process.env.MSG_URL || "https://d3k9hx3li2ssij.cloudfront.net/";
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
export const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET || "";
export const MESSAGE_BUCKET = process.env.MESSAGE_BUCKET || "";
export const ADSPACE_PHONE_PAY_KEY = process.env.ADSPACE_PHONE_PAY_KEY;
export const ADSPACE_MERCHANT_ID = process.env.ADSPACE_MERCHANT_ID;
export const Prosite_URL = process.env.Prosite_URL;
export const BUCKET_URL = process.env.BUCKET_URL;
