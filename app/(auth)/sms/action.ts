"use server"

import { z } from "zod";
import validator from "validator"
import { PHONE_ERROR_MESSAGE } from "@/lib/constants";
import { redirect } from "next/navigation";

const phoneSchema = z.string().trim().refine((phone) => validator.isMobilePhone(phone, "ko-KR"), PHONE_ERROR_MESSAGE)
const codeSchema = z.coerce.number().int().min(100000).max(999999)

interface ActionState {
    token: boolean;
    error?: {
        fieldErrors: {
            phone?: string[];
            token?: string[];
        };
    };
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
    const phone = formData.get("phone")
    const token = formData.get("token")

    console.log(prevState)
    console.log(phone)
    if (!prevState.token) {
        const result = phoneSchema.safeParse(phone);
        if (!result.success) {
            return {
                token: false,
                error: {
                    fieldErrors: {
                        phone: [result.error.errors[0].message]
                    }
                }
            };
        } else {
            return { token: true }
        }
    } else {
        const result = codeSchema.safeParse(token);
        if (!result.success) {
            return {
                token: true,
                error: {
                    fieldErrors: {
                        token: [result.error.errors[0].message]
                    }
                }
            }
        } else {
            redirect("/")
        }
    }
}
