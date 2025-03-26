// import { Request, Response } from "express";

// export const uploadImage = async (req: Request, res: Response): Promise<void> => {
//   try {
//     if (!req.file) {
//       res.status(400).json({ message: "No file uploaded" });
//       return;
//     }

//     const filePath = req.file.path; // Get the uploaded file path

//     res.status(200).json({
//       message: "File uploaded successfully",
//       filePath,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error uploading file", error });
//   }
// };


import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary.config'; // นำเข้า Cloudinary Configuration
import multer from 'multer';
import streamifier from 'streamifier'; // นำเข้า streamifier เพื่อแปลง buffer เป็น stream

// ตั้งค่า multer สำหรับการจัดการการอัปโหลดไฟล์ภาพ
const storage = multer.memoryStorage(); // เก็บไฟล์ภาพในหน่วยความจำ (ไม่เก็บใน server)
const upload = multer({ storage }).single('image'); // รับไฟล์ภาพเดียว

// ฟังก์ชันจัดการการอัปโหลดภาพ
export const uploadImage = async (req: Request, res: Response) => {
  try {
    // ใช้ multer จัดการการอัปโหลดไฟล์
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).send('Error uploading file');
      }

      const file = req.file;
      if (!file) {
        return res.status(400).send('No file uploaded');
      }

      // แปลง buffer เป็น stream ก่อนอัปโหลด
      const stream = streamifier.createReadStream(file.buffer);

      // อัปโหลดภาพไปยัง Cloudinary
      const result = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' }, // ตรวจจับประเภทไฟล์อัตโนมัติ
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
        }
      );

      // ส่งไฟล์ไปยัง Cloudinary stream
      stream.pipe(result);
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Internal Server Error');
  }
};

