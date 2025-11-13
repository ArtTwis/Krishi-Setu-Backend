// swagger.js
import swaggerJSDoc from "swagger-jsdoc";

import {
  APPLICATION_DESCRIPTION,
  APPLICATION_NAME,
} from "./constants/common.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: APPLICATION_NAME,
      version: process.env.KRISHI_SETU_API_VERSION,
      description: APPLICATION_DESCRIPTION,
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`, // Change based on your environment
      },
    ],
  },
  // Paths to files containing OpenAPI definitions
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
