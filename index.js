"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_route_1 = __importDefault(require("./src/routes/user.route"));
const swagger_1 = require("./src/config/swagger"); // Import Swagger setup
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Setup Swagger
(0, swagger_1.setupSwagger)(app);
app.use("/users", user_route_1.default);
const port = process.env.PORT || 3306;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
