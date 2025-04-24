// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import cloudinary from './cloudinary.config';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

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

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cloudinary from './cloudinary.config';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import os from 'os';

// ใช้ temporary directory ของระบบปฏิบัติการ
const uploadDir = os.tmpdir();

// แก้ไขตรงนี้โดยกำหนด params ที่ถูกต้องตาม type definition
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        // ใส่ folder ใน callback แทน
        public_id: (req: any, file: { originalname: any; }) => `house_image/${Date.now()}-${file.originalname}`,
        // หรือถ้าต้องการใช้แบบอื่น สามารถตั้งค่าเพิ่มเติมได้ตาม documentation
        allowedFormats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    } as any // ใช้ as any ชั่วคราวเพื่อแก้ปัญหา TypeScript
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png/;
      const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimeType = fileTypes.test(file.mimetype);
  
      if (extName && mimeType) {
        return cb(null, true);
      } else {
        return cb(new Error('Only JPEG, JPG, or PNG images are allowed'));
      }
    }
});

export default upload;
