"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = mysql2_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: Number(process.env.DB_PORT), // Convert port to a number
    password: process.env.DB_PASSWORD, // Fixed typo
    database: process.env.DB_DATABASE
});
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    }
    else {
        console.log("Connected to the database");
        connection.release(); // Release the connection after checking
    }
});
exports.default = pool.promise();
