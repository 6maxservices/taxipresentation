import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const proxy = withAuth(
  function proxy(req) {
    // Return NextResponse.next() to continue
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    }
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
