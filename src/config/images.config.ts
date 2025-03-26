import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cloudinary from './cloudinary.config';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Define the absolute path for the 'uploads' directory
const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure the 'uploads' directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage1 = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        public_id:(req, file) => file.originalname,
    },
});

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);  // Save images to the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);  // Use timestamp + original file name
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extName && mimeType) {
            return cb(null, true);  // File type is allowed
        } else {
            return cb(new Error('Only JPEG, JPG, or PNG images are allowed'));  // Reject invalid file type
        }
    }
});

export default upload;
