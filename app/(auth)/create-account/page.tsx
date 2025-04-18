"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useActionState } from "react";
import { createAccount } from "./action";
import { USERNAME_MAX_LENGTH } from "@/lib/constants";
import { USERNAME_MIN_LENGTH } from "@/lib/constants";
import { EMAIL_MIN_LENGTH } from "@/lib/constants";
import { EMAIL_MAX_LENGTH } from "@/lib/constants";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { PASSWORD_MAX_LENGTH } from "@/lib/constants";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";

export default function CreateAccount() {
  const [state, action] = useActionState(createAccount, null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setIsSuccess(true);
    }
  }, [state]);

  if (isSuccess) {
    redirect("/profile");
  }

  console.log("state", state);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hello</h1>
        <h2 className="text-xl">fill in the form below to join!</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="username"
          type="text"
          placeholder="Username"
          required
          errors={state?.fieldErrors?.username ?? []}
          minLength={USERNAME_MIN_LENGTH}
          maxLength={USERNAME_MAX_LENGTH}
        />
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
          errors={state?.fieldErrors?.password ?? []}
          minLength={PASSWORD_MIN_LENGTH}
          maxLength={PASSWORD_MAX_LENGTH}
        />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="confirm password"
          required
          errors={state?.fieldErrors?.confirmPassword ?? []}
          minLength={PASSWORD_MIN_LENGTH}
          maxLength={PASSWORD_MAX_LENGTH}
        />
        <Button title="Create Account" />
      </form>
      <SocialLogin></SocialLogin>
    </div>
  );
}
