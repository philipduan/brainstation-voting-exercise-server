import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = +process.env.SALT_WORK_FACTOR!;

export type UserType = {
  username: string;
  password: string;
  voted: boolean;
  comparePassword: (password: string) => Promise<boolean>;
};

const UserSchema: Schema<UserType> = new mongoose.Schema({
  username: {
    unique: true,
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  voted: {
    required: true,
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", function (next) {
  let user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const result = await bcrypt.compare(candidatePassword, this.password);
  return result;
};

const User = mongoose.model<UserType>("user", UserSchema);
export { User };
