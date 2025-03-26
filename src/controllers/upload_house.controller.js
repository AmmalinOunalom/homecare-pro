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
exports.upload_house_image = void 0;
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config")); // Import Cloudinary Configuration
const multer_1 = __importDefault(require("multer"));
const streamifier_1 = __importDefault(require("streamifier")); // Convert buffer to stream
// Configure multer to store files in memory
const storage = multer_1.default.memoryStorage();
const upload_house = (0, multer_1.default)({ storage }).single('house_image'); // Accept single file
// Function to handle house image upload
const upload_house_image = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use multer to handle file upload
        upload_house(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(400).send('Error uploading file');
            }
            const file = req.file;
            if (!file) {
                return res.status(400).send('No file uploaded');
            }
            // Convert buffer to stream before uploading
            const stream = streamifier_1.default.createReadStream(file.buffer);
            // Upload image to Cloudinary
            const result = cloudinary_config_1.default.uploader.upload_stream({ resource_type: 'auto' }, // Auto-detect file type
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
            });
            // Pipe the file stream to Cloudinary
            stream.pipe(result);
        }));
    }
    catch (error) {
        console.error('Error uploading house image:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.upload_house_image = upload_house_image;
