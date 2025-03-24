import { Request, Response } from "express";
import { comments_model } from "../model/comments.model";

/**
 * Create a new comment
 */
export const create_comment = async (req: Request, res: Response) => {
  try {
    const commentData = req.body;
    const comment = await comments_model.create_comment(commentData);
    res.status(201).send("Comment created successfully");
  } catch (error) {
    res.status(500).send("Failed to create comment");
  }
};

/**
 * Retrieve all comments
 */
export const show_all_comments = async (req: Request, res: Response) => {
  try {
    const comments = await comments_model.show_all_comments();
    res.status(200).send(comments);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Update a comment
 */
export const update_comment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedComment = await comments_model.update_comment(Number(id), req.body);
    if (updatedComment) {
      res.status(200).send("Comment updated successfully");
    } else {
      res.status(404).send("Comment not found");
    }
  } catch (error) {
    res.status(500).send("Failed to update comment");
  }
};

/**
 * Delete a comment
 */
export const delete_comment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedComment = await comments_model.delete_comment(Number(id));
    if (deletedComment) {
      res.status(200).send("Comment deleted successfully");
    } else {
      res.status(404).send("Comment not found");
    }
  } catch (error) {
    res.status(500).send("Failed to delete comment");
  }
};
