import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const auth = req.cookies.get("auth")?.value;
  const isLoginPage = req.nextUrl.pathname === "/";

  if (!auth && !isLoginPage) {
    // not logged in → redirect to /
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (auth && isLoginPage) {
    // already logged in → skip login
    return NextResponse.redirect(new URL("/classes", req.url));
  }

  return NextResponse.next();
}

// Liste des pages protégées
export const config = {
  matcher: ["/((?!_next|api/login|favicon.ico|.*\\..*).*)"],
};
