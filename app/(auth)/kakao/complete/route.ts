import { NextRequest } from "next/server";
import db from "@/lib/db";
import authenticateUser from "@/lib/auth";

async function getKakaoAccessToken(code: string) {
    const accessTokenParams = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_CLIENT_ID!,
        client_secret: process.env.KAKAO_CLIENT_SECRET!,
        redirect_uri: process.env.KAKAO_CALLBACK_URL!,
        code,
    }).toString();

    const accessTokenURL = `https://kauth.kakao.com/oauth/token?${accessTokenParams}`;
    const response = await fetch(accessTokenURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const data = await response.json();
    if ("error" in data) {
        throw new Error("Failed to get access token");
    }
    return data.access_token;
}

async function getKakaoUserData(accessToken: string) {
    const response = await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-cache",
    });

    const data = await response.json();
    if ("error" in data) {
        throw new Error("Failed to get user data");
    }
    return data;
}

export async function GET(request: NextRequest) {
    try {
        const code = request.nextUrl.searchParams.get("code");
        if (!code) {
            return new Response("Authorization code not found", { status: 400 });
        }

        const accessToken = await getKakaoAccessToken(code);
        const userData = await getKakaoUserData(accessToken);

        const { id, properties } = userData;
        const { nickname, profile_image } = properties;

        let user = await db.user.findUnique({
            where: { kakao_id: id + "" },
            select: { id: true },
        });

        if (!user) {
            user = await db.user.create({
                data: {
                    kakao_id: id + "",
                    username: `kakao_${nickname}`,
                    avatar: profile_image || null,
                },
                select: { id: true },
            });
        }

        await authenticateUser(user.id + "");

        return new Response(null, {
            status: 302,
            headers: { Location: "/profile" }
        });
    } catch (error) {
        console.error("Kakao OAuth Error:", error);
        return new Response("Authentication failed", { status: 500 });
    }
} 