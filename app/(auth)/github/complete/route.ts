import { NextRequest } from "next/server";
import db from "@/lib/db";
import authenticateUser from "@/lib/auth";

async function getGithubAccessToken(code: string) {
    const accessTokenParams = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
    }).toString();
    const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
    const response = await fetch(accessTokenURL, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    });
    const data = await response.json();
    if ("error" in data) {
        throw new Error("Failed to get access token");
    }
    return data.access_token;
}

async function getGithubUserData(accessToken: string) {
    const response = await fetch("https://api.github.com/user", {
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

async function getGithubUserEmail(accessToken: string) {
    const response = await fetch("https://api.github.com/user/emails", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-cache",
    });
    const data = await response.json() as { email: string, primary: boolean }[];
    return data.find((email: { email: string, primary: boolean }) => email.primary)?.email || data[0]?.email;
}

export async function GET(request: NextRequest) {
    try {
        const code = request.nextUrl.searchParams.get("code");
        if (!code) {
            return new Response("Authorization code not found", { status: 400 });
        }

        const accessToken = await getGithubAccessToken(code);
        const userData = await getGithubUserData(accessToken);
        const primaryEmail = await getGithubUserEmail(accessToken);

        const { id, login, avatar_url } = userData;

        let user = await db.user.findUnique({
            where: { github_id: id + "" },
            select: { id: true },
        });

        if (!user) {
            user = await db.user.create({
                data: {
                    github_id: id + "",
                    username: `github_${login}`,
                    avatar: avatar_url,
                    email: primaryEmail,
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
        console.error("GitHub OAuth Error:", error);
        return new Response("Authentication failed", { status: 500 });
    }
}