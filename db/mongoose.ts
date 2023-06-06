import mongoose from "mongoose";
import { Candidate, CandidateType } from "../models/candidates";

const mongoURL = process.env.DATABASE_URL;
mongoose.connect(mongoURL!);
const database = mongoose.connection;
database.on("error", (error) => {
  process.env.NODE_ENV !== "production" &&
    console.log(`Connection error: ${error}`);
});

database.once("connected", async () => {
  process.env.NODE_ENV !== "production" && console.log("Database connected");
  const existingCandidates = await Candidate.find({});
  if (!existingCandidates.length) {
    const candidates: Array<CandidateType> = [
      {
        name: "John Doe",
        party: "Conservative",
        votes: 0,
      },
      {
        name: "Jane Smith",
        party: "Liberal",
        votes: 0,
      },
      {
        name: "Alice Bert",
        party: "NPD",
        votes: 0,
      },
    ];
    await Candidate.insertMany(candidates);
  }
});

export { mongoose };
