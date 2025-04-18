import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

interface PublicOnlyUrls {
    [key: string]: boolean;
}

const publicOnlyUrls: PublicOnlyUrls = {
    "/": true,
    "/login": true,
    "/sms": true,
    "/create-account": true,
    "/github/start": true,
    "/github/complete": true,
}

export default async function middleware(request: NextRequest) {
    const session = await getSession();

    const exists = publicOnlyUrls[request.nextUrl.pathname];

    if (session?.user?.id && exists) {
        return NextResponse.redirect(new URL("/home", request.url));
    }
    // if (!session.user?.id) {
    //     if (!exists) {
    //         return NextResponse.redirect(new URL("/", request.url));
    //     }
    // } else {
    //     if (exists) {
    //         return NextResponse.redirect(new URL("/products", request.url));
    //     }
    // }

    // /products/add 경로는 인터셉트하지 않음
    if (request.nextUrl.pathname === '/products/add') {
        return NextResponse.next();
    }

    // 다른 /products 경로들에 대한 인터셉트 처리
    if (request.nextUrl.pathname.startsWith('/products/')) {
        // 여기에 인터셉트 로직 추가
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};