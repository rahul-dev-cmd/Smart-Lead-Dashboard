import { Schema, model, type HydratedDocument } from "mongoose";

export const USER_ROLES = ["Admin", "Sales User"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface User {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  refreshTokenHash?: string;
  refreshTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "Sales User",
      required: true
    },
    refreshTokenHash: {
      type: String,
      select: false
    },
    refreshTokenExpiresAt: {
      type: Date,
      select: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const UserModel = model<User>("User", userSchema);
