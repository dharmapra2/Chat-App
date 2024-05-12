import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/"]);

const authorizedParties = ["http://localhost:3000"];

export default clerkMiddleware(
  (auth, request) => {
    if (isPublicRoute(request)) auth().protect();
  },
  {
    secretKey: process.env.NEXT_PUBLIC_CLERK_SECRET_KEY,
    debug: true,
    authorizedParties: authorizedParties,
  }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
