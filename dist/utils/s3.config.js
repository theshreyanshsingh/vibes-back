"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploads3 = exports.deleteFiles3 = exports.s3 = void 0;
exports.generatePresignedUrl = generatePresignedUrl;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const config_1 = require("./config");
const s3 = new client_s3_1.S3Client({
    region: config_1.BUCKET_REGION,
    credentials: {
        accessKeyId: config_1.AWS_ACCESS_KEY,
        secretAccessKey: config_1.AWS_SECRET_KEY,
    },
});
exports.s3 = s3;
const deleteFiles3 = (bucket, key) => __awaiter(void 0, void 0, void 0, function* () {
    yield s3.send(new client_s3_1.DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
    }));
});
exports.deleteFiles3 = deleteFiles3;
const uploads3 = (bucket, key, data, ContentType) => __awaiter(void 0, void 0, void 0, function* () {
    yield s3.send(new client_s3_1.PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: data,
        ContentType: ContentType,
    }));
});
exports.uploads3 = uploads3;
function generatePresignedUrl(bucketName, key, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            Bucket: bucketName,
            Key: key,
            ContentType: contentType, // Replace with the appropriate content type for your file
        };
        // Create the PutObjectCommand
        const command = new client_s3_1.PutObjectCommand(params);
        const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 3600 });
        console.log("Pre-signed URL for file upload:", signedUrl);
        return signedUrl;
    });
}
