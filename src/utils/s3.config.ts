import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWS_ACCESS_KEY, AWS_SECRET_KEY, BUCKET_REGION } from "./config";

const s3 = new S3Client({
  region: BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});
const deleteFiles3 = async (bucket: string, key: string) => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
};
const uploads3 = async (
  bucket: string,
  key: string,
  data: Buffer,
  ContentType: string
) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: data,
      ContentType: ContentType,
    })
  );
};

async function generatePresignedUrl(
  bucketName: string,
  key: string,
  contentType: string
) {
  const params = {
    Bucket: bucketName,
    Key: key,
    ContentType: contentType, // Replace with the appropriate content type for your file
  };

  // Create the PutObjectCommand
  const command = new PutObjectCommand(params);

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

  console.log("Pre-signed URL for file upload:", signedUrl);
  return signedUrl;
}

export { s3, deleteFiles3, uploads3, generatePresignedUrl };
