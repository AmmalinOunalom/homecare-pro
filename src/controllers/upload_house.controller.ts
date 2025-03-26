import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary.config'; // Import Cloudinary Configuration
import multer from 'multer';
import streamifier from 'streamifier'; // Convert buffer to stream

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload_house = multer({ storage }).single('house_image'); // Accept single file

// Function to handle house image upload
export const upload_house_image = async (req: Request, res: Response) => {
  try {
    // Use multer to handle file upload
    upload_house(req, res, async (err) => {
      if (err) {
        return res.status(400).send('Error uploading file');
      }

      const file = req.file;
      if (!file) {
        return res.status(400).send('No file uploaded');
      }

      // Convert buffer to stream before uploading
      const stream = streamifier.createReadStream(file.buffer);

      // Upload image to Cloudinary
      const result = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' }, // Auto-detect file type
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            return res.status(500).send('Failed to upload image');
          }

          // Ensure result is valid
          if (!result) {
            return res.status(500).send('Failed to upload image, result is undefined');
          }

          // Return uploaded image URL
          res.status(200).send({
            message: 'House image uploaded successfully',
            image_url: result.secure_url, // Uploaded image URL
          });
        }
      );

      // Pipe the file stream to Cloudinary
      stream.pipe(result);
    });
  } catch (error) {
    console.error('Error uploading house image:', error);
    res.status(500).send('Internal Server Error');
  }
};
