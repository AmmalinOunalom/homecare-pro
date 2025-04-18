
import swaggerJSDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import dotenv from "dotenv";

dotenv.config();
console.log("Loaded URL from .env:", process.env.URL); // ✅ เช็คค่าที่โหลดมา

//const DOMAIN = process.env.URL;

const options: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "HomeCare API",
            version: "1.0.0",
            description: "API Documentation for HomeCare Node.js & TypeScript Project",
        },
        servers: [
            {
              url: 'https://homecare-pro.onrender.com',
              description: 'Production server',
            },
          ],
    },
    apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    //console.log(`Swagger Docs available at ${DOMAIN}/api-docs`); // 
};
