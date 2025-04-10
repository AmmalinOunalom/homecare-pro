
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Secret keys for each user type
const SECRET_KEYS = {
  users: process.env.JWT_SECRET_USERS || "ZfEYwl7yGor1DAlReLlQVIdRTojJzv4mdwwU6byTYfvc3yhWShT0WioWzgjy3c6Wc3xkoKh4gxrM5PGOS6VTIMuy6c",
  employees: process.env.JWT_SECRET_EMPLOYEE || "63kLCJudFfAA7uioZf56mKCaHZyfhzKFZlKXt52wDb1aqu4ux2eD8oC2OcPTPAo6VkE7LwXAqK7YpCXpvop2BVmoRX",
  admins: process.env.JWT_SECRET_ADMIN || "UOK9wmEuGRmtAeGXZEutF1G0BPwCZYoIUfvsXtYmVL99jGF6BAcYVQf7f5FHZ5DTFPw1xgBRgu06ER4DQoc5vUV7EI"
};

// Function to generate Token
const generateToken = (id: number, type: "users" | "employees" | "admins"): string => {
  const secret = SECRET_KEYS[type];
  return jwt.sign({ id, type }, secret, { expiresIn: "1h" });
};

// Interface for typed request with user information
interface RequestWithUser extends Request {
  user?: { id: number; type: "users" | "employees" | "admins" };
}
export const validateToken = (req: RequestWithUser, res: Response, next: NextFunction): void => {
    console.log("Token verification started...");

    const token = req.header("Authorization")?.split(" ")[1];  // รับ Token จาก Header

    if (!token) {
        console.log("No token provided");  // แสดงข้อความถ้าไม่มี Token
        res.status(403).json({ error: "Access denied: No token provided" });
        return;
    }

    try {
        let decoded: any = null;
        let userType: "users" | "employees" | "admins" | null = null;

        // ตรวจสอบว่า Token เป็นของ user, employee หรือ admin
        for (const type of ["users", "employees", "admins"] as const) {
            try {
                decoded = jwt.verify(token, SECRET_KEYS[type]);  // ตรวจสอบ Token
                userType = type;
                break;  
            } catch (err) {
                continue;
            }
        }

        if (!decoded || !userType) {
            console.log("Invalid token: No matching user type");  // แสดงถ้า Token ไม่ถูกต้อง
            res.status(401).json({ error: "Invalid token: No matching user type" });
            return;
        }

        // แสดงข้อมูลของ Token ใน Terminal
        console.log(`Token Verified!ID: ${decoded.id}, User Type: ${userType}`);

        // เพิ่มข้อมูล user ลงใน request object
        req.user = { id: decoded.id, type: userType };

        next();
    } catch (error) {
        console.log("Error verifying token:", error);  // แสดงข้อผิดพลาด
        res.status(401).json({ error: "Invalid token: Error while verifying token" });
    }
};


// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// const SECRET_KEY = process.env.JWT_SECRET_USERS || 'ZfEYwl7yGor1DAlReLlQVIdRTojJzv4mdwwU6byTYfvc3yhWShT0WioWzgjy3c6Wc3xkoKh4gxrM5PGOS6VTIMuy6c';

// // Middleware for JWT Token Validation
// export const validateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(' ')[1];

//     jwt.verify(token, SECRET_KEY, (err, payload) => {
//       if (err) {
//         return res.status(403).json({
//           success: false,
//           message: 'Invalid token',
//         });
//       } else {
//         // Pass the payload directly through res.locals
//         res.locals.user = payload;
//         next();
//       }
//     });
//   } else {
//     res.status(401).json({
//       success: false,
//       message: 'Token is not provided',
//     });
//   }
// };