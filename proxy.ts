import { auth } from "@/auth"

export const proxy = auth(request => {
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
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};