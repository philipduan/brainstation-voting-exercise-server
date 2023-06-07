import { z } from "zod";
import jwt, { Secret } from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, t } from "../trpc";
import { User } from "../models/users";
import { OneTimeCode } from "../models/oneTimeCode";

export const authRouter = t.router({
  signIn: t.procedure
    .meta({ openapi: { method: "POST", path: "/auth/sign-in" } })
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .output(
      z.object({
        message: z.string(),
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await User.findOne({ username: input.username });

      if (!user) {
        throw new TRPCError({
          message: "Username not found",
          code: "NOT_FOUND",
        });
      }
      const token = generateBearerToken(user!._id.toString());
      const result = await user!.comparePassword(input.password);
      if (!result) {
        throw new TRPCError({
          message: "Wrong username or password",
          code: "UNAUTHORIZED",
        });
      }

      return { message: "success", token: token };
    }),
  signUp: t.procedure
    .meta({ openapi: { method: "POST", path: "/auth/sign-up" } })
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        oneTimeCode: z.number(),
      })
    )
    .output(
      z.object({
        message: z.string(),
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { username, password, oneTimeCode } = input;

      const oneTimeCodeModelData = new OneTimeCode({
        _id: oneTimeCode,
      });

      try {
        await oneTimeCodeModelData.save();
      } catch (err) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Invalid one time code",
        });
      }

      const userModelData = new User({ username, password });
      try {
        await userModelData.save();
        const token = generateBearerToken(userModelData._id.toString());
        return {
          message: "success",
          token,
        };
      } catch (err) {
        await OneTimeCode.findByIdAndDelete(input.oneTimeCode);
        throw new TRPCError({
          message: "Username already exist",
          code: "BAD_REQUEST",
        });
      }
    }),
  getUserByToken: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/auth/get-user" } })
    .input(z.void())
    .output(
      z.object({
        username: z.string(),
        voted: z.boolean(),
      })
    )
    .query(async ({ ctx }) => {
      try {
        const user = await User.findById(ctx.user.userId);
        return {
          username: user!.username,
          voted: user!.voted,
        };
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
});

function generateBearerToken(userId: string) {
  return jwt.sign({ userId }, process.env.TOKEN_SECRET as Secret, {
    expiresIn: "1800s",
  });
}
