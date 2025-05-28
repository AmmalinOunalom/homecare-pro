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
exports.comments_model = void 0;
const base_database_1 = __importDefault(require("../config/base.database"));
var Status;
(function (Status) {
    Status["Active"] = "active";
    Status["Inactive"] = "inactive";
})(Status || (Status = {}));
class comments_model {
    // Create Comment
    static create_comment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `INSERT INTO comments (users_id, employees_id, message, rating, status) VALUES (?, ?, ?, ?, ?)`;
                // Ensure status is always valid
                const statusValue = comment.status || Status.Active;
                const values = [comment.user_id, comment.employees_id, comment.message, comment.rating, statusValue];
                const [result] = yield base_database_1.default.execute(query, values);
                return result;
            }
            catch (error) {
                console.error("Error inserting comment:", error);
                throw new Error("Failed to create comment");
            }
        });
    }
    // Show All Comments
    static show_all_comments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT 
        comments.id,
        comments.users_id,
        users.first_name,
        users.last_name,
        comments.employees_id,
        comments.message,
        comments.rating,
        comments.status
        FROM 
        comments
        JOIN 
        users ON comments.users_id = users.id;`;
                const [rows] = yield base_database_1.default.execute(query);
                return rows; // Returning the fetched comments
            }
            catch (error) {
                console.error("Error fetching comments:", error);
                throw new Error("Failed to fetch comments");
            }
        });
    }
    // Update Comment
    static update_comment(id, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'UPDATE comments SET users_id = ?, employees_id = ?, message = ?, rating = ?, status = ?, updated_at = NOW() WHERE id = ?';
                const values = [comment.user_id, comment.employees_id, comment.message, comment.rating, comment.status, id];
                const [result] = yield base_database_1.default.execute(query, values);
                return result; // Return the result to indicate update status
            }
            catch (error) {
                console.error("Error updating comment:", error);
                throw new Error("Failed to update comment");
            }
        });
    }
    // Delete Comment
    static delete_comment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'DELETE FROM comments WHERE id = ?';
                const [result] = yield base_database_1.default.execute(query, [id]);
                return result; // Return the result of the deletion
            }
            catch (error) {
                console.error("Error deleting comment:", error);
                throw new Error("Failed to delete comment");
            }
        });
    }
}
exports.comments_model = comments_model;
