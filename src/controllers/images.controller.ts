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