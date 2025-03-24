import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const DOMAIN = process.env.URL || 'https://homecare-pro.onrender.com'; // Use HTTPS for production
const PORT = process.env.PORT || 5000; // Default to 5000 for local development

const options: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HomeCare API',
            version: '1.0.0',
            description: 'API Documentation for HomeCare Node.js & TypeScript Project',
        }
        // servers: [
        //     {
        //         url: `${DOMAIN}`, // Base URL for production, no path included
        //         description: 'Production Server', // Description for production
        //     }
        // ],
    },
    apis: ["./src/routes/*.ts"], // Specify the paths to your route files
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Swagger Docs available at ${DOMAIN}/api-docs`); // Correct the URL here
};
