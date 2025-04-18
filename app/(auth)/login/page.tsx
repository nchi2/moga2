"use client"
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Button from "@/components/button"
import Input from "@/components/input"
import SocialLogin from "@/components/social-login"
import { useActionState } from "react";
import { login } from "./action";
import { EMAIL_MIN_LENGTH, EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/constants";

interface ActionState {
    success?: boolean;
    message?: string;
    fieldErrors?: {
        email?: string[];
        password?: string[];
    };
}

export default function Login() {
    const [state, action] = useActionState<ActionState, FormData>(login, { success: false, message: "", fieldErrors: {} })
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (state?.success) {
            setIsSuccess(true);
        }
    }, [state]);

    if (isSuccess) {
        redirect("/profile");
    }

    return (
        <div className="flex flex-col gap-10 py-8 px-6">

            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">Hello</h1>
                <h2 className="text-xl">login with your e-mail and password</h2>
            </div>
            <form action={action}
                className="flex flex-col gap-3">
                <Input
                    name="email"
                    type="email"
                    placeholder="your e-mail"
                    required
                    minLength={EMAIL_MIN_LENGTH}
                    maxLength={EMAIL_MAX_LENGTH}
                    errors={state?.fieldErrors?.email ?? []}
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="password"
                    required
                    minLength={PASSWORD_MIN_LENGTH}
                    maxLength={PASSWORD_MAX_LENGTH}
                    errors={state?.fieldErrors?.password ?? []}
                />
                <Button title="LogIn" />
            </form>
            <SocialLogin></SocialLogin>
        </div>
    )
}