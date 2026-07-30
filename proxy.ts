import { auth } from "@/auth"
import { NextAuthRequest } from "next-auth";
import { NextRequest } from "next/server";
import { checkRateLimit } from "./lib/rate-limit";

async function processRateLimit(request: NextRequest) {
    const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';
    const limit = 100;
    const windowMs = 60_000;
    const result = await checkRateLimit(ip, limit, windowMs); // windowMs(ミリ秒)にlimit回まで
    // console.log({ ip, ...result });

    if (result.isOk) {
        return;
    }

    const body = JSON.stringify({ error: 'Too many requests' });
    const init = {
        status: 429,
        headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'Retry-After': String(windowMs / 1000) + " seconds",
        },
    };
    const response = new Response(body, init);
    return response;
}

function processAuth(request: NextAuthRequest) {
    // console.log(request.auth, request.nextUrl.pathname);

    if (request.auth) {
        return;
    }

    const SIGNIN_PATH = "/auth/signin";
    const isSignInPage = request.nextUrl.pathname === SIGNIN_PATH;

    const NEW_USER_PATH = "/auth/new-user";
    const isNewUserPage = request.nextUrl.pathname === NEW_USER_PATH;

    if (!isSignInPage && !isNewUserPage) {
        const newUrl = new URL(SIGNIN_PATH, request.nextUrl.origin);
        return Response.redirect(newUrl);
    }
}

export const proxy = auth(async request => {
    const response =
        await processRateLimit(request)
        || processAuth(request);
    return response;
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};