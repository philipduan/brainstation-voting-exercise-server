import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import "dotenv/config";
import { createOpenApiExpressMiddleware } from "trpc-openapi";
import "./db/mongoose";
import { appRouter } from "./routers";
import { createContext } from "./context";
const app = express();
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  // Pass to next layer of middleware
  next();
});

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.listen(process.env.PORT || 3000);
