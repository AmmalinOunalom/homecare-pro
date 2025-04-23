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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = __importDefault(require("./cloudinary.config"));
// ใช้ CloudinaryStorage อย่างเดียว
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.default,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        return {
            folder: 'homecare/house_images', // ตั้งชื่อโฟลเดอร์ใน Cloudinary ได้
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
            format: file.mimetype.split('/')[1], // กำหนดฟอร์แมต (jpg, png, ฯลฯ)
            transformation: [{ width: 800, height: 600, crop: 'limit' }] // ตัวเลือกเสริม
        };
    }),
});
// ตรวจสอบไฟล์เฉพาะรูปภาพ
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาด 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const ext = allowedTypes.test(file.originalname.toLowerCase());
        const mime = allowedTypes.test(file.mimetype);
        if (ext && mime) {
            cb(null, true);
        }
        else {
            cb(new Error('Only JPEG, JPG, or PNG images are allowed'));
        }
    },
});
exports.default = upload;
