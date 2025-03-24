"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const DOMAIN = process.env.URL; // Use HTTPS for production
const PORT = process.env.PORT || 5000; // Default to 5000 for local development
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HomeCare API',
            version: '1.0.0',
            description: 'API Documentation for HomeCare Node.js & TypeScript Project',
        },
        servers: [
            {
                url: `${DOMAIN}`, // Base URL for production, no path included
                description: 'Production Server', // Description for production
            }
        ],
    },
    apis: ["./src/routes/*.ts"], // Specify the paths to your route files
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log(`Swagger Docs available at ${DOMAIN}/api-docs`); // Correct the URL here
};
exports.setupSwagger = setupSwagger;
