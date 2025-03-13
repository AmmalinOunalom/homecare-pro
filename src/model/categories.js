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
exports.categories_model = void 0;
const base_database_1 = __importDefault(require("../config/base.database"));
var Status;
(function (Status) {
    Status["Active"] = "ACTIVE";
    Status["Inactive"] = "INACTIVE";
})(Status || (Status = {}));
class categories_model {
    // Create Categories
    static create(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'INSERT INTO categories (cat_name, status) VALUES (?, ?)';
                const values = [category.cat_name, category.status];
                const [result] = yield base_database_1.default.execute(query, values);
                return result;
            }
            catch (error) {
                console.error("Error inserting category:", error);
                throw new Error("Failed to create category");
            }
        });
    }
    // Show All Categories
    static show_all_category() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM categories';
                const [rows] = yield base_database_1.default.execute(query);
                return rows;
            }
            catch (error) {
                console.error("Error fetching categories:", error);
                throw new Error("Failed to fetch categories");
            }
        });
    }
    // Update Category
    static update_category(id, category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'UPDATE categories SET cat_name = ?, status = ?, update_at = NOW() WHERE id = ?';
                const values = [category.cat_name, category.status, id];
                const [result] = yield base_database_1.default.execute(query, values);
                return result;
            }
            catch (error) {
                console.error("Error updating category:", error);
                throw new Error("Failed to update category");
            }
        });
    }
    // Delete Category
    static delete_category(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'DELETE FROM categories WHERE id = ?';
                const [result] = yield base_database_1.default.execute(query, [id]);
                return result;
            }
            catch (error) {
                console.error("Error deleting category:", error);
                throw new Error("Failed to delete category");
            }
        });
    }
}
exports.categories_model = categories_model;
