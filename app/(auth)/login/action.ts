"use server"
import { z } from "zod";
import { EMAIL_ERROR_MESSAGE, EMAIL_REGEX, PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX } from "@/lib/constants";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { getSession } from "@/lib/session";

const checkEmailExists = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });
    if (!user) {
        return { success: false, message: "User not found" };
    }
    return { success: true };
}

interface ActionState {
    success?: boolean;
    message?: string;
    fieldErrors?: {
        email?: string[];
        password?: string[];
    };
}

const loginSchema = z.object({
    email: z.string()
        .email(EMAIL_ERROR_MESSAGE)
        .regex(EMAIL_REGEX)
        .refine(checkEmailExists, { message: "Email does not exist" }),
    password: z.string()
        .regex(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
});

export async function login(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    try {
        const result = await loginSchema.safeParseAsync(data);
        if (!result.success) {
            return result.error.flatten();
        } else {
            const user = await db.user.findUnique({
                where: {
                    email: result.data.email,
                },
            });
            if (!user) {
                return { success: false, fieldErrors: { email: ["User not found"] } };
            }
            if (!user.password) {
                return { success: false, fieldErrors: { password: ["User has no password"] } };
            }
            const isPasswordValid = await bcrypt.compare(result.data.password, user.password);
            if (!isPasswordValid) {
                return { success: false, fieldErrors: { password: ["Invalid password"] } };
            }
            const session = await getSession();
            session.user = {
                id: user.id,
            }
            await session.save();
            return { success: true };
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, fieldErrors: error.flatten().fieldErrors };
        }
        return { success: false, fieldErrors: { email: ["Login failed"] } };
    }
}