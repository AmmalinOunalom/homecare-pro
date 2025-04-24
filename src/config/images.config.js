"use strict";
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import cloudinary from './cloudinary.config';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // Define the absolute path for the 'uploads' directory
// const uploadDir = path.join(__dirname, '..', 'uploads');
// // Ensure the 'uploads' directory exists, if not, create it
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }
// const storage1 = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         public_id:(req, file) => file.originalname,
//     },
// });
// // Configure storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);  // Save images to the 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);  // Use timestamp + original file name
//     }
// });
// const upload = multer({
//     storage: storage,  // เก็บไฟล์ในเครื่องก่อน
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//     fileFilter: (req, file, cb) => {
//       const fileTypes = /jpeg|jpg|png/;
//       const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
//       const mimeType = fileTypes.test(file.mimetype);
//       if (extName && mimeType) {
//         return cb(null, true);  // File type is allowed
//       } else {
//         return cb(new Error('Only JPEG, JPG, or PNG images are allowed'));  // Reject invalid file type
//       }
//     }
//   });
// export default upload;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_config_1 = __importDefault(require("./cloudinary.config"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const os_1 = __importDefault(require("os"));
// ใช้ temporary directory ของระบบปฏิบัติการ
const uploadDir = os_1.default.tmpdir();
// แก้ไขตรงนี้โดยกำหนด params ที่ถูกต้องตาม type definition
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.default,
    params: {
        // ใส่ folder ใน callback แทน
        public_id: (req, file) => `house_image/${Date.now()}-${file.originalname}`,
        // หรือถ้าต้องการใช้แบบอื่น สามารถตั้งค่าเพิ่มเติมได้ตาม documentation
        allowedFormats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    } // ใช้ as any ชั่วคราวเพื่อแก้ปัญหา TypeScript
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (extName && mimeType) {
            return cb(null, true);
        }
        else {
            return cb(new Error('Only JPEG, JPG, or PNG images are allowed'));
        }
    }
});
exports.default = upload;
