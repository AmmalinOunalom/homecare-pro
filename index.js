"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_route_1 = __importDefault(require("./src/routes/user.route")); // corrected import user
const employees_route_1 = __importDefault(require("./src/routes/employees.route")); // Corrected import employees
const categories_route_1 = __importDefault(require("./src/routes/categories.route")); // Corrected import categories
const emp_car_route_1 = __importDefault(require("./src/routes/emp_car.route")); // Corrected import emp_car
const comments_route_1 = __importDefault(require("./src/routes/comments.route")); // Corrected import emp_car
const address_users_details_route_1 = __importDefault(require("./src/routes/address_users_details.route")); // Corrected import emp_car
const service_order_route_1 = __importDefault(require("./src/routes/service_order.route")); // Corrected import emp_car
const swagger_1 = require("./src/config/swagger"); // Import Swagger setup
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.use(cors()); // This will allow all origins by default
app.use((0, cors_1.default)({
    origin: ['https://homecare-pro.onrender.com'], // ✅ อนุญาตเฉพาะโดเมนของคุณ
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization'
}));
// Setup Swagger
(0, swagger_1.setupSwagger)(app);
app.use("/users", user_route_1.default);
app.use("/employees", employees_route_1.default);
app.use("/categories", categories_route_1.default);
app.use("/emp_car", emp_car_route_1.default);
app.use("/comments", comments_route_1.default);
app.use("/address_users_details", address_users_details_route_1.default);
app.use("/service_order", service_order_route_1.default);
//const port = process.env.PORT || 3306;
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
