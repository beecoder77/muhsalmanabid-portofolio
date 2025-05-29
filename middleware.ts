import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check for token in both cookie and Authorization header
  const adminToken = request.cookies.get("adminToken")?.value || 
                    request.headers.get("Authorization")?.split(" ")[1]
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isLoginPage = request.nextUrl.pathname === "/login"
  const isRSC = request.headers.get("RSC") === "1"

  // Allow RSC requests to pass through
  if (isRSC) {
    return NextResponse.next()
  }

  // Redirect to login if accessing admin route without token
  if (isAdminRoute && !adminToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to dashboard if accessing login page with valid token
  if (isLoginPage && adminToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/admin/:path*", "/login"],
}
