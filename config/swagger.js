const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CrudNode API",
      version: "1.0.0",
      description: "Backend API documentation for the CrudNode User Management Platform.",
      termsOfService: "http://localhost:5000/terms",
      contact: {
        name: "Desmond",
        email: "chijideso@gmail.com",
      },
      license: {
        name: "MIT License",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "/api",
        description: "Current Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1b2c9e1a4b0012345678" },
            name: { type: "string", example: "user" },
            email: { type: "string", example: "example.com" },
            age: { type: "number", example: 20 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UserInput: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: { type: "string", example: "user" },
            email: { type: "string", example: "example.com" },
            age: { type: "number", example: 20 },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            user: {
              type: "object",
              properties: {
                name: { type: "string", example: "user" },
                email: { type: "string", example: "example.com" },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Users", description: "User management endpoints" },
      { name: "Products", description: "Product management endpoints" },
    ],
    security: [{ BearerAuth: [] }],
  },
  apis: ["./routes/Authroutes.js", "./routes/Userroutes.js","./routes/Productroutes.js"],
  
};

module.exports = swaggerJsdoc(options);
