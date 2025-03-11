import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const PORT = process.env.PORT || 5000; // Use environment variable or default to 5000

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
                url: `http://localhost:${PORT}`, // Dynamically set port
                description: 'Local Development Server',
            },
        ],
    },
    apis: ["./src/routes/user.route.ts"], // Specify only route files to optimize documentation generation
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
};
