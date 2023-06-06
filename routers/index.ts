import { t } from "../trpc";
import { authRouter } from "./auth";
import { candidatesRouter } from "./candidates";

export const appRouter = t.router({
  auth: authRouter,
  candidate: candidatesRouter,
});

export type AppRouter = typeof appRouter;
