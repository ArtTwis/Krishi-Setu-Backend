import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";

const server = express();

/*==============
==Middlewares==
==============*/

server.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

server.use(express.json({ limit: "16kb" }));

// express.urlencoded is used to encode url, extended property is used to encode url in depth or nested level
server.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

// middleware to secure Express apps by setting HTTP response headers.
server.use(helmet());

/*==============
==== MORGAN ====
* middleware for HTTP request logger
* create a write stream (in append mode)
==============*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const logDirectory = path.join(rootDir, "logs");
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);

let accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  {
    flags: "a",
  }
);

server.use(morgan("combined", { stream: accessLogStream }));
/*========================================================*/

server.use(express.static("public"));

server.use(cookieParser());

/*==============
=====Routes=====
==============*/

import userAuthRouter from "./routes/userAuth.routes.js";

server.use(`/api/${process.env.KRISHI_SETU_API_VERSION}/auth`, userAuthRouter);

//  Handle invalid request
server.use(notFoundMiddleware);

export default server;
