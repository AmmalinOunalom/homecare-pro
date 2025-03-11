import express from "express";
import dotenv from "dotenv";
import user_router from "./src/routes/user.route";
import { setupSwagger } from './src/config/swagger'; // Import Swagger setup

dotenv.config();


const app = express();
app.use(express.json());

// Setup Swagger
setupSwagger(app);

app.use("/users",user_router);

const port = process.env.PORT || 3306;
app.listen(port, ()=> console.log(`Server running at http://localhost:${port}`));