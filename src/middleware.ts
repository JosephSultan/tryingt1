import { NextResponse } from "next/server";

let clerkMiddleware;
if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    // Only load Clerk middleware if env exists
    // This prevents build errors when key is invalid or missing
    clerkMiddleware = require("@clerk/nextjs/server").clerkMiddleware;
}

export default (req: any) => {
    if (!clerkMiddleware) return NextResponse.next();

    const url = req.nextUrl.pathname;
    const { userId } = clerkMiddleware((auth: any) => auth, req)();

    // Protect /dashboard and sub-routes
    if (!userId && url.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    // Redirect authenticated users away from auth routes
    if (userId && (url.startsWith("/auth/sign-in") || url.startsWith("/auth/sign-up"))) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
};

ex
