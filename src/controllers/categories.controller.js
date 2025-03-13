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
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_categories = exports.update_categories = exports.show_all_categories = exports.create_categories = void 0;
const categories_model_1 = require("../model/categories.model");
/**
 * Create a new category
 */
const create_categories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryData = req.body;
        const category = yield categories_model_1.categories_model.create_category(categoryData);
        res.status(201).send("Category created successfully");
    }
    catch (error) {
        res.status(500).send("Failed to create category");
    }
});
exports.create_categories = create_categories;
/**
 * Retrieve all categories
 */
const show_all_categories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categories_model_1.categories_model.show_all_category();
        res.status(200).send(categories);
    }
    catch (error) {
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_categories = show_all_categories;
/**
 * Update a category
 */
const update_categories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedCategory = yield categories_model_1.categories_model.update_category(Number(id), req.body);
        if (updatedCategory) {
            res.status(200).send("Category updated successfully");
        }
        else {
            res.status(404).send("Category not found");
        }
    }
    catch (error) {
        res.status(500).send("Failed to update category");
    }
});
exports.update_categories = update_categories;
/**
 * Delete a category (Soft Delete)
 */
const delete_categories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedCategory = yield categories_model_1.categories_model.delete_category(Number(id));
        if (deletedCategory) {
            res.status(200).send("Category deleted successfully");
        }
        else {
            res.status(404).send("Category not found");
        }
    }
    catch (error) {
        res.status(500).send("Failed to delete category");
    }
});
exports.delete_categories = delete_categories;
