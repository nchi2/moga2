import { redirect } from "next/navigation";

export async function GET() {
    const baseURL = "https://kauth.kakao.com/oauth/authorize";
    const params = {
        client_id: process.env.KAKAO_CLIENT_ID!,
        redirect_uri: process.env.KAKAO_CALLBACK_URL!,
        response_type: "code",
    }
    const url = `${baseURL}?${new URLSearchParams(params).toString()}`;
    console.log("Kakao auth URL:", url);
    return redirect(url);
} 