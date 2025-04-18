  import express from "express";
  import cors from "cors";
  import dotenv from "dotenv";

  import user_router from "./src/routes/user.route"; // Adjust path based on your folder structure
  import employee_router from "./src/routes/employees.route";
  import categories_router from "./src/routes/categories.route";
  import emp_car_router from "./src/routes/emp_car.route";
  import comments_router from "./src/routes/comments.route";
  import address_users_details_router from "./src/routes/address_users_details.route";
  import service_order_router from "./src/routes/service_order.route";
  import sms_router from './src/routes/sms.route'; // Import SMS route (for sending messages)

  import { setupSwagger } from "./src/config/swagger"; // Swagger setup

  dotenv.config(); // Load environment variables


  const app = express();
  app.use(express.json()); // Middleware to parse JSON request bodies

  // CORS setup (allowing Swagger UI, frontend, and localhost to access the API)

  // app.use(cors({
  //   origin: [
  //     'https://homecare-pro.onrender.com',  // Your frontend deployed URL
  //     'http://localhost:5173',  // Allow local frontend (adjust if necessary)
  //   ],
  //   methods: 'GET, POST, PUT, DELETE, OPTIONS',
  //   allowedHeaders: 'Content-Type, Authorization',
  //   credentials: true, // Allow cookies and authorization headers
  // }));

  app.use(cors());



  // Setup Swagger
  setupSwagger(app);

  // Use routes
  app.use("/users", user_router);
  app.use("/employees", employee_router);
  app.use("/categories", categories_router);
  app.use("/emp_car", emp_car_router);
  app.use("/comments", comments_router);
  app.use("/address_users_details", address_users_details_router);
  app.use("/service_order", service_order_router);
  app.use('/sms', sms_router);

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running at ${process.env.URL || "http://localhost"}:${port}`);
  });
