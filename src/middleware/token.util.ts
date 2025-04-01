import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_USERS || "ZfEYwl7yGor1DAlReLlQVIdRTojJzv4mdwwU6byTYfvc3yhWShT0WioWzgjy3c6Wc3xkoKh4gxrM5PGOS6VTIMuy6c";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(403).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number; email: string };
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};