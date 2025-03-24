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
exports.delete_comment = exports.update_comment = exports.show_all_comments = exports.create_comment = void 0;
const comments_model_1 = require("../model/comments.model");
/**
 * Create a new comment
 */
const create_comment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentData = req.body;
        const comment = yield comments_model_1.comments_model.create_comment(commentData);
        res.status(201).send("Comment created successfully");
    }
    catch (error) {
        res.status(500).send("Failed to create comment");
    }
});
exports.create_comment = create_comment;
/**
 * Retrieve all comments
 */
const show_all_comments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield comments_model_1.comments_model.show_all_comments();
        res.status(200).send(comments);
    }
    catch (error) {
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_comments = show_all_comments;
/**
 * Update a comment
 */
const update_comment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedComment = yield comments_model_1.comments_model.update_comment(Number(id), req.body);
        if (updatedComment) {
            res.status(200).send("Comment updated successfully");
        }
        else {
            res.status(404).send("Comment not found");
        }
    }
    catch (error) {
        res.status(500).send("Failed to update comment");
    }
});
exports.update_comment = update_comment;
/**
 * Delete a comment
 */
const delete_comment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedComment = yield comments_model_1.comments_model.delete_comment(Number(id));
        if (deletedComment) {
            res.status(200).send("Comment deleted successfully");
        }
        else {
            res.status(404).send("Comment not found");
        }
    }
    catch (error) {
        res.status(500).send("Failed to delete comment");
    }
});
exports.delete_comment = delete_comment;
