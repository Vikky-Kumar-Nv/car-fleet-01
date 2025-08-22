// src/middleware/upload.middleware.ts
import multer from 'multer';
import path from 'path';
import { config } from '../../config';

const storage = multer.diskStorage({
  destination: config.uploadDir,
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

export const upload = multer({ storage }).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'licenseDocument', maxCount: 1 },
  { name: 'policeVerificationDocument', maxCount: 1 },
  { name: 'document', maxCount: 1 },
]);