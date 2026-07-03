import { auth } from "@/auth"

export const proxy = auth(request => {
    // console.log(request.auth, request.nextUrl.pathname);
    if (!request.auth && request.nextUrl.pathname !== "/signin") {
        const newUrl = new URL("/signin", request.nextUrl.origin)
        return Response.redirect(newUrl)
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};