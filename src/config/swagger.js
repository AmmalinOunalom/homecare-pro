"use strict";
// import swaggerJSDoc, { Options } from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";
// import { Express } from "express";
// import dotenv from "dotenv";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
// dotenv.config();
// console.log("Loaded URL from .env:", process.env.URL); // ✅ เช็คค่าที่โหลดมา
// //const DOMAIN = process.env.URL;
// const options: Options = {
//     definition: {
//         openapi: "3.0.0",
//         info: {
//             title: "HomeCare API",
//             version: "1.0.0",
//             description: "API Documentation for HomeCare Node.js & TypeScript Project",
//         },
//         servers: [
//             {
//               url: 'https://homecare-pro.onrender.com',
//               description: 'Production server',
//             },
//           ],
//     },
//     apis: ["./src/routes/*.ts"],
// };
// const swaggerSpec = swaggerJSDoc(options);
// export const setupSwagger = (app: Express) => {
//     app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//     //console.log(`Swagger Docs available at ${DOMAIN}/api-docs`); // 
// };
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("Loaded URL from .env:", process.env.URL);
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
                url: process.env.URL || "http://localhost:5000", // Fallback to localhost for local development
                description: process.env.URL ? "Production server" : "Local Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT", // Optional: just for UI display
                },
            },
        },
    },
    apis: ["./src/routes/*.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
};
exports.setupSwagger = setupSwagger;
