import { z } from "zod";
import { protectedProcedure, t } from "../trpc";
import { Candidate } from "../models/candidates";
import { Types } from "mongoose";
import { User } from "../models/users";
export const candidatesRouter = t.router({
  getAll: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/candidates/get-all" } })
    .input(z.void())
    .output(
      z.array(
        z.object({
          _id: z.custom<Types.ObjectId>(),
          name: z.string(),
          party: z.enum(["Liberal", "Conservative", "NPD"]),
        })
      )
    )
    .query(async () => {
      const candidates = await Candidate.find({});
      return candidates;
    }),
  voteForId: protectedProcedure
    .meta({ openapi: { method: "PATCH", path: "/candidates/vote-for" } })
    .input(z.object({ candidateId: z.string() }))
    .output(z.object({ message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await Candidate.findOneAndUpdate(
        { _id: input.candidateId },
        { $inc: { votes: 1 } }
      ).exec();
      await User.findByIdAndUpdate(ctx.user.userId, { voted: true });
      return { message: "success" };
    }),
});
