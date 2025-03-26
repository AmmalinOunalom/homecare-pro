"use strict";
// import { Request, Response } from "express";
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
exports.uploadImage = void 0;
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config")); // นำเข้า Cloudinary Configuration
const multer_1 = __importDefault(require("multer"));
const streamifier_1 = __importDefault(require("streamifier")); // นำเข้า streamifier เพื่อแปลง buffer เป็น stream
// ตั้งค่า multer สำหรับการจัดการการอัปโหลดไฟล์ภาพ
const storage = multer_1.default.memoryStorage(); // เก็บไฟล์ภาพในหน่วยความจำ (ไม่เก็บใน server)
const upload = (0, multer_1.default)({ storage }).single('image'); // รับไฟล์ภาพเดียว
// ฟังก์ชันจัดการการอัปโหลดภาพ
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ใช้ multer จัดการการอัปโหลดไฟล์
        upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(400).send('Error uploading file');
            }
            const file = req.file;
            if (!file) {
                return res.status(400).send('No file uploaded');
            }
            // แปลง buffer เป็น stream ก่อนอัปโหลด
            const stream = streamifier_1.default.createReadStream(file.buffer);
            // อัปโหลดภาพไปยัง Cloudinary
            const result = cloudinary_config_1.default.uploader.upload_stream({ resource_type: 'auto' }, // ตรวจจับประเภทไฟล์อัตโนมัติ
            (error, result) => {
                if (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    return res.status(500).send('Failed to upload image');
                }
                // ตรวจสอบว่า result มีค่าก่อนใช้งาน
                if (!result) {
                    return res.status(500).send('Failed to upload image, result is undefined');
                }
                // ส่ง URL ของภาพที่อัปโหลดไปแล้ว
                res.status(200).send({
                    message: 'Image uploaded successfully',
                    image_url: result.secure_url, // URL ของภาพที่อัปโหลด
                });
            });
            // ส่งไฟล์ไปยัง Cloudinary stream
            stream.pipe(result);
        }));
    }
    catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.uploadImage = uploadImage;
