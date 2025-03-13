import { Request, Response } from "express";
import { categories_model } from "../model/categories.model";

/**
 * Create a new category
 */
export const create_categories = async (req: Request, res: Response) => {
  try {
    const categoryData = req.body;
    const category = await categories_model.create_category(categoryData);
    res.status(201).send("Category created successfully");
  } catch (error) {
    res.status(500).send("Failed to create category");
  }
};

/**
 * Retrieve all categories
 */
export const show_all_categories = async (req: Request, res: Response) => {
  try {
    const categories = await categories_model.show_all_category();
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Update a category
 */
export const update_categories = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCategory = await categories_model.update_category(Number(id), req.body);
    if (updatedCategory) {
      res.status(200).send("Category updated successfully");
    } else {
      res.status(404).send("Category not found");
    }
  } catch (error) {
    res.status(500).send("Failed to update category");
  }
};

/**
 * Delete a category (Soft Delete)
 */
export const delete_categories = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCategory = await categories_model.delete_category(Number(id));
    if (deletedCategory) {
      res.status(200).send("Category deleted successfully");
    } else {
      res.status(404).send("Category not found");
    }
  } catch (error) {
    res.status(500).send("Failed to delete category");
  }
};
