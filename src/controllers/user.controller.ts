import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { user_model } from '../model/user.model';
import bcrypt from 'bcrypt';

const JWT_SECRET = 'ZfEYwl7yGor1DAlReLlQVIdRTojJzv4mdwwU6byTYfvc3yhWShT0WioWzgjy3c6Wc3xkoKh4gxrM5PGOS6VTIMuy6c';  // Replace with a real secret key

// create user
export const create_users = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;


    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const user = { ...req.body, password: hashedPassword };


    const createdUser = await user_model.create(user);

    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send("User with the same email, username, or last_name already exists");
  }
};

// Sign in user

export const sign_in_user = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // เรียกใช้ฟังก์ชัน sign_in ของ model เพื่อยืนยันข้อมูลผู้ใช้
    const user = await user_model.sign_in(email, password);

    if (user) {
      // ถ้าผู้ใช้พบและรหัสผ่านถูกต้อง
      // สร้าง JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },  // Payload
        JWT_SECRET,  // Secret key
        { expiresIn: '1h' }  // ระยะเวลาหมดอายุของ token
      );

      // ส่งข้อมูลกลับไปยัง client
      res.status(200).send({
        message: "Sign-in successful",
        token,  // ส่ง token ที่ถูกสร้าง
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
      });
    } else {
      // หากข้อมูลไม่ถูกต้อง
      res.status(401).send("Invalid email or password");
    }
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).send("Internal Server Error");
  }
};


// show all users
export const show_all_users = async (req: Request, res: Response) => {
  try {
    const users = await user_model.show_all();
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
};

//get user name by ID
export const get_user_name = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;

    // Ensure userId is a string and can be parsed to a number
    if (typeof userId !== 'string') {
      res.status(400).json({ message: 'User ID is required and must be a string.' });
      return;
    }

    const id = parseInt(userId, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: 'User ID must be a valid number.' });
      return;
    }

    const user = await user_model.get_user_name(id);

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.status(200).json(user); // Return the user name
  } catch (error) {
    console.error('Error fetching user name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const get_user_profile = async (req: Request, res: Response): Promise<void> => {
  try {
    // 🔍 Log the full req.user object
    console.log("Authenticated user from token:", req.user);

    const userId = req.user?.id;
    const userType = req.user?.type;

    // 🔍 Log extracted values
    console.log("User ID:", userId);
    console.log("User Type:", userType);

    // Validate user type
    if (userType !== 'users') {
      console.log("Access denied: User type is not 'users'");
      res.status(403).json({ error: "Access denied: Only users can access this route" });
    }

    // Fetch user data by ID
    const user = await user_model.get_user_by_id(userId);
    console.log("Fetched user from DB:", user);

    // Check if user exists
    if (!user) {
      console.log("User not found in DB for ID:", userId);
      res.status(404).json({ error: "User not found" });
    }

    // Return user profile data
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rename_user = async (req: Request, res: Response) => {
  try {
    // Extract the user ID from the URL parameters and the new user details from the body
    const { id } = req.params; // ID from the URL path
    const { newUsername, newFirstname, newLastname } = req.body;

    // Call the model function with the necessary arguments
    const result = await user_model.rename_users(Number(id), newUsername, newFirstname, newLastname);

    // Check if result is returned
    if (result) {
      res.status(200).send("User updated successfully");
    } else {
      res.status(404).send("User not found or no changes made");
    }
  } catch (error) {
    // Log and send internal server error
    console.error("Error updating user:", error);
    res.status(500).send("Internal Server Error");
  }
};

//NOTE - forgotpassword

// function set password (Forgot Password)
export const forgot_password = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;


    console.log("Received request to reset password for:", email);

    // Hash the new password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    console.log("Hashed password:", hashedPassword);

    // Call the model function to update the password
    const result = await user_model.forgot_password_users(email, hashedPassword);

    if (result) {
      console.log("Password reset successful for:", email);
      res.status(200).send("Password reset successful");
    } else {
      console.log("Email not found:", email);
      res.status(404).send("Email not found");
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(400).send("Error resetting password");
  }

};
