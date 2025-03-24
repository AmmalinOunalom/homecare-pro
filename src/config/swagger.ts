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

import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const DOMAIN = process.env.URL || 'https://homecare-pro.onrender.com'; // ✅ ตั้งค่าเริ่มต้นให้ถูกต้อง
const PORT = process.env.PORT || 5000; // ✅ ใช้พอร์ต 5000 สำหรับ local

const options: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HomeCare API',
            version: '1.0.0',
            description: 'API Documentation for HomeCare Node.js & TypeScript Project',
        },
        servers: [
            {
                url: DOMAIN, // ✅ ใช้ URL ที่ถูกต้อง
                description: 'Production Server',
            },
            {
                url: `http://localhost:${PORT}`, // ✅ ใช้ URL สำหรับ local test
                description: 'Local Development Server',
            }
        ],
    },
    apis: ["./src/routes/*.ts"], // ✅ อ่าน API จากโฟลเดอร์ routes
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Swagger Docs available at ${DOMAIN}/api-docs`); // ✅ ใช้ URL ที่ถูกต้อง
};
