// import swaggerJSDoc, { Options } from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import { Express } from 'express';

// const DOMAIN = process.env.URL; // Use HTTPS for production
// const PORT = process.env.PORT || 5000; // Default to 5000 for local development

// const options: Options = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'HomeCare API',
//             version: '1.0.0',
//             description: 'API Documentation for HomeCare Node.js & TypeScript Project',
//         },
//         servers: [
//             {
//                 url: `${DOMAIN}`, // Base URL for production, no path included
//                 description: 'Production Server', // Description for production
//             }
//         ],
//     },
//     apis: ["./src/routes/*.ts"], // Specify the paths to your route files
// };

// const swaggerSpec = swaggerJSDoc(options);

// export const setupSwagger = (app: Express) => {
//     app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//     console.log(`Swagger Docs available at ${DOMAIN}/api-docs`); // Correct the URL here
// };

import swaggerJSDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import dotenv from "dotenv";

dotenv.config();
console.log("Loaded URL from .env:", process.env.URL); // ✅ เช็คค่าที่โหลดมา

const DOMAIN = process.env.URL || "http://localhost:5000";

// ตรวจสอบให้แน่ใจว่า DOMAIN ไม่มี "/" ท้ายสุด
const BASE_URL = DOMAIN.replace(/\/$/, ""); 

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
                url: `${BASE_URL}`, // ✅ ใช้ URL ที่ถูกต้อง
                description: "Production Server",
            }
        ],
    },
    apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Swagger Docs available at ${DOMAIN}/api-docs`); // ✅ แสดง URL ที่ถูกต้อง
};

// import swaggerJsDoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import { Express } from 'express';

// const swaggerOptions: swaggerJsDoc.Options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'My API',
//       version: '1.0.0',
//       description: 'API documentation',
//     },
//     servers: [
//       {
//         url: process.env.URL || 'http://localhost:5000', // Use the environment variable
//       },
//     ],
//   },
//   apis: ['./src/routes/*.ts'], // Adjust as needed
// };

// const swaggerSpec = swaggerJsDoc(swaggerOptions);

// export function setupSwagger(app: Express) {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// }

