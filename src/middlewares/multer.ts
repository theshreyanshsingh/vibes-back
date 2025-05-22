import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

// Export the upload instance
export default upload;
