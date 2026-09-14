// import { auth } from "@/auth";
// import { NextResponse } from "next/server";

// export default auth((req) => {
//   const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
//   const isLoggedIn = !!req.auth;
//   const userRole = req.auth?.user?.role;

//   if (isAdminRoute) {
//     if (!isLoggedIn) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//     if (userRole !== "ADMIN") {
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/admin/:path*"],
// };

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // Get the session token securely from cookies
  const token = await getToken({ 
    req, 
    secret: process.env.AUTH_SECRET 
  });

  const isLoggedIn = !!token;
  const userRole = token?.role;

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  if (userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};