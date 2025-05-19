"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_route_1 = __importDefault(require("./src/routes/user.route")); // Adjust path based on your folder structure
const employees_route_1 = __importDefault(require("./src/routes/employees.route"));
const categories_route_1 = __importDefault(require("./src/routes/categories.route"));
const emp_car_route_1 = __importDefault(require("./src/routes/emp_car.route"));
const comments_route_1 = __importDefault(require("./src/routes/comments.route"));
const address_users_details_route_1 = __importDefault(require("./src/routes/address_users_details.route"));
const service_order_route_1 = __importDefault(require("./src/routes/service_order.route"));
const reports_route_1 = __importDefault(require("./src/routes/reports.route"));
const admin_route_1 = __importDefault(require("./src/routes/admin.route"));
const sms_route_1 = __importDefault(require("./src/routes/sms.route"));
const swagger_1 = require("./src/config/swagger"); // Swagger setup
dotenv_1.default.config(); // Load environment variables
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Middleware to parse JSON request bodies
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Setup Swagger
(0, swagger_1.setupSwagger)(app);
// Use routes
app.use("/users", user_route_1.default);
app.use("/employees", employees_route_1.default);
app.use("/categories", categories_route_1.default);
app.use("/emp_car", emp_car_route_1.default);
app.use("/comments", comments_route_1.default);
app.use("/address_users_details", address_users_details_route_1.default);
app.use("/service_order", service_order_route_1.default);
app.use("/reports", reports_route_1.default);
app.use("/admins", admin_route_1.default);
app.use("/sms", sms_route_1.default);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running at ${process.env.URL || "http://localhost"}:${port}`);
});
