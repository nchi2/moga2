import { redirect } from "next/navigation";

export async function GET() {
    const baseURL = "https://github.com/login/oauth/authorize";
    const params = {
        client_id: process.env.GITHUB_CLIENT_ID!,
        redirect_uri: process.env.GITHUB_CALLBACK_URL!,
        scope: "read:user, user:email",
        allow_signup: "true",
    }
    const url = `${baseURL}?${new URLSearchParams(params).toString()}`;
    console.log(url);
    return redirect(url);
}   