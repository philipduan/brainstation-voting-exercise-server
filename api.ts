import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import "dotenv/config";
import { createOpenApiExpressMiddleware } from "trpc-openapi";
import "./db/mongoose";
import { appRouter } from "./routers";
import { createContext } from "./context";
const app = express();
app.use(
  cors({
    origin: [process.env.ORIGIN_URL as string, "http://127.0.0.1:5173"],
    credentials: true,
  })
);

app.use(
  "/trpc",
  createExpressMiddleware({
    middleware: cors(),
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
app.listen(3000);
