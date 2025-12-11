import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const studentAccess = req.cookies.get("studentAccess")?.value === "true";
  const teacherAccess = req.cookies.get("teacherAccess")?.value === "true";
  const sessionCookie = getSessionCookie(req);
  const isLoginPage =
    req.nextUrl.pathname === "/" || req.nextUrl.pathname === "";

  if (!studentAccess && !teacherAccess && !sessionCookie && !isLoginPage) {
    // not logged in → redirect to /
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isLoginPage && (studentAccess || teacherAccess || sessionCookie)) {
    // already logged in → skip login
    return NextResponse.redirect(new URL("/classes", req.url));
  }

  return NextResponse.next();
}

// Liste des pages protégées
export const config = {
  matcher: ["/((?!_next|api/auth|api/login|favicon.ico|.*\\..*).*)"],
};
