import { auth } from "@/auth"

export const proxy = auth(request => {
    // console.log(request.auth, request.nextUrl.pathname);
    const SIGNIN_PATH = "/auth/signin";
    if (!request.auth && request.nextUrl.pathname !== SIGNIN_PATH) {
        const newUrl = new URL(SIGNIN_PATH, request.nextUrl.origin)
        return Response.redirect(newUrl)
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};