
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

/**
 * Middleware to protect routes using Clerk authentication.
 * This middleware ensures that users must be authenticated to access protected routes,
 * such as the dashboard. If a user attempts to access the dashboard or other protected
 * pages without being logged in, they will be redirected to the login page.
 * The `matcher` configuration specifies which routes require authentication, including
 * API routes and excluding static files and Next.js internals.
 */
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

export default clerkMiddleware(async (auth, req)=>{
  const { userId } = await auth();

  if(!userId && isProtectedRoute(req)){
    const { redirectToSignIn } = await auth();

    return redirectToSignIn();
  }
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};