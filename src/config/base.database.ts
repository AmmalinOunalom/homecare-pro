import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT), // Convert port to a number
  password: process.env.DB_PASSWORD, // Fixed typo
  database: process.env.DB_DATABASE
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the database");
    connection.release(); // Release the connection after checking
  }
});

export default pool.promise();
