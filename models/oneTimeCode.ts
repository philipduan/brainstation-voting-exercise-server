import mongoose, { Schema } from "mongoose";

export type OneTimeCodeType = {
  _id: number;
};

const OneTimeCodeSchema: Schema<OneTimeCodeType> = new mongoose.Schema({
  _id: {
    type: Number,
    min: 1000000,
    max: 9999999,
  },
});

const OneTimeCode = mongoose.model<OneTimeCodeType>(
  "oneTimeCode",
  OneTimeCodeSchema
);
export { OneTimeCode };
