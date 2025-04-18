"use client"

import Button from "@/components/button"
import Input from "@/components/input"
import { useActionState } from "react"
import { smsLogin } from "./action"
import { PHONE_MIN_LENGTH, PHONE_MAX_LENGTH } from "@/lib/constants"

const initialState = {
    token: false,
    error: undefined
}

export default function Login() {
    const [state, action] = useActionState(smsLogin, initialState)
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">Hello SMS Login</h1>
                <h2 className="text-xl">Verify your phone number</h2>
            </div>
            <form action={action} className="flex flex-col gap-3">

                {state.token ? (
                    <Input
                        name="token"
                        type="number"
                        placeholder="Verification code"
                        required
                        min={100000}
                        max={999999}
                    />
                ) : <Input
                    name="phone"
                    type="text"
                    placeholder="phone number"
                    required
                    minLength={PHONE_MIN_LENGTH}
                    maxLength={PHONE_MAX_LENGTH}
                    errors={state.error?.fieldErrors?.phone ?? []}
                />}
                <Button title="Login" />
            </form>
        </div>
    )
}