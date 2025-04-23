import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.config';

// ใช้ CloudinaryStorage อย่างเดียว
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'homecare/house_images', // ตั้งชื่อโฟลเดอร์ใน Cloudinary ได้
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      format: file.mimetype.split('/')[1], // กำหนดฟอร์แมต (jpg, png, ฯลฯ)
      transformation: [{ width: 800, height: 600, crop: 'limit' }] // ตัวเลือกเสริม
    };
  },
});

// ตรวจสอบไฟล์เฉพาะรูปภาพ
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาด 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const ext = allowedTypes.test(file.originalname.toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, or PNG images are allowed'));
    }
  },
});

export default upload;
