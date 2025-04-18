"use server";
import { z } from "zod";
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_REGEX,
  PASSWORD_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_ERROR_MESSAGE,
  USERNAME_ERROR_MESSAGE
} from "@/lib/constants";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { getSession } from "@/lib/session";

const checkUsername = (username: string) => {
  const forbiddenWords = ["sex", "fuck", "porn", "nsfw", "xxx"];
  return !forbiddenWords.some(word => username.toLowerCase().includes(word));
}
const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
    }
  })
  return !Boolean(user);
}
const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
    }
  })
  return !Boolean(user);
}
const checkPassword = (data: { password: string, confirmPassword: string }) => {
  return data.password === data.confirmPassword;
}

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "username must be a string",
        required_error: "where is my username?"
      })
      .min(USERNAME_MIN_LENGTH, "Username must be at least 5 characters")
      .max(USERNAME_MAX_LENGTH, "Username must be less than 10 characters")
      .trim()
      .regex(USERNAME_REGEX, USERNAME_ERROR_MESSAGE)
      .transform((username) => `${username}`)
      .refine(checkUsername, "that word not allowed")
      .refine(checkUniqueUsername, "Username already exists"),
    email: z.string().email("Invalid email address").trim().toLowerCase()
      .refine(checkUniqueEmail, "Email already exists"),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "Password must be at least 4 characters")
      .max(PASSWORD_MAX_LENGTH, "Password must be less than 16 characters")
      .trim()
      .regex(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
    confirmPassword: z.string().trim(),
  })
  .refine(checkPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .superRefine(async (data, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username: data.username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Username already exists",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  });

interface ActionState {
  success?: boolean;
  fieldErrors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string;
}

export const createAccount = async (
  state: ActionState | null,
  formData: FormData
): Promise<ActionState | null> => {
  const data = {
    username: formData.get("username")?.toString(),
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
    confirmPassword: formData.get("confirmPassword")?.toString(),
  };
  try {
    const result = await formSchema.safeParseAsync(data);

    if (!result.success) {
      return { success: false, fieldErrors: result.error.flatten().fieldErrors };
    } else {
      // TODO: hash password
      if (!data.password) throw new Error("Password is required");
      const hashedPassword = await bcrypt.hash(data.password, 10);
      console.log(hashedPassword);
      // TODO: save user to db
      if (!data.username || !data.email) throw new Error("Required fields missing");
      const newUser = await db.user.create({
        data: {
          username: result.data.username,
          email: result.data.email,
          password: hashedPassword
        },
        select: {
          id: true,
        }
      })
      // TODO: log the user in
      const session = await getSession();
      session.user = { id: newUser.id };
      await session.save();
      console.log("session", session);
      return { success: true };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, fieldErrors: error.flatten().fieldErrors };
    }
    return { success: false, message: "Failed to create account" };
  }
};
