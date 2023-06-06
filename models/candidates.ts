import mongoose, { Schema } from "mongoose";

export type CandidateType = {
  name: string;
  party: "Liberal" | "Conservative" | "NPD";
  votes: number;
};

const CandidateSchema: Schema<CandidateType> = new mongoose.Schema({
  name: {
    unique: true,
    required: true,
    type: String,
  },
  party: {
    required: true,
    type: String,
    enum: ["Liberal", "Conservative", "NPD"],
  },
  votes: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const Candidate = mongoose.model<CandidateType>("candidate", CandidateSchema);
export { Candidate };
