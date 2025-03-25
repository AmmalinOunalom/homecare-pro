import { Request, Response } from 'express';
import { user_model } from '../model/user.model';
import bcrypt from 'bcrypt';

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
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
};
// Sign in user
export const sign_in_user = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Call the model's sign_in function
    const user = await user_model.sign_in(email, password);

    if (user) {
      // If user is found and password is correct
      res.status(200).send({
        message: "Sign-in successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
      });
    } else {
      // If credentials are invalid
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

// function (Rename User)
export const rename_user = async (req: Request, res: Response) => {
  try {
    const { id, newUsername, newFirstname, newLastname } = req.body;


    const result = await user_model.rename_users(id, newUsername, newFirstname, newLastname);


    if (result) {
      res.status(200).send("User updated successfully");
    } else {
      res.status(404).send("User not found or no changes made");
    }
  } catch (error) {
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
