require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const connectDB = require("./config/db");
const userRoutes = require("./routes/Userroutes");
const authRoutes = require("./routes/Authroutes");
const productRoutes = require("./routes/Productroutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // parse JSON request bodies
app.use(express.static("public")); // serve test UI

// Swagger docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      docExpansion: "list",
      filter: true,
      showExtensions: true,
      tryItOutEnabled: false,
      tagsSorter: "none",
    },
    customSiteTitle: "CrudNode API Docs",
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "🚀 CRUD API is running!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});