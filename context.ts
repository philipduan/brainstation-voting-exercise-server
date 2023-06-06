import * as trpcNext from "@trpc/server/adapters/next";
import { inferAsyncReturnType, TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface UsernameJwtPayload extends jwt.JwtPayload {
    userId: string;
  }
}
export async function createContext({
  req,
}: trpcNext.CreateNextContextOptions) {
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      try {
        const user = await (<jwt.UsernameJwtPayload>(
          jwt.verify(
            req.headers.authorization.split(" ")[1],
            process.env.TOKEN_SECRET as string
          )
        ));
        return user;
      } catch (err) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
    }
    return null;
  }
  const user = await getUserFromHeader();

  return {
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
