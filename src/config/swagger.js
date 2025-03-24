"use strict";
// import swaggerJSDoc, { Options } from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import { Express } from 'express';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
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
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("Loaded URL from .env:", process.env.URL); // ✅ เช็คค่าที่โหลดมา
const DOMAIN = process.env.URL || "http://localhost:5000"; // ✅ ใช้ค่า .env ถ้าไม่มีใช้ localhost
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "HomeCare API",
            version: "1.0.0",
            description: "API Documentation for HomeCare Node.js & TypeScript Project",
        },
        servers: [
            {
                url: DOMAIN, // ✅ ใช้ค่า URL จาก .env
                description: "Production Server",
            }
        ],
    },
    apis: ["./src/routes/*.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log(`Swagger Docs available at ${DOMAIN}/api-docs`); // ✅ แสดง URL ที่ถูกต้อง
};
exports.setupSwagger = setupSwagger;
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
