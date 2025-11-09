import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password === process.env.NEXT_PUBLIC_APP_PASSWORD) {
    const res = NextResponse.json({ success: true });
    // Set cookie valid for 7 days
    res.cookies.set("studentAccess", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 31 * 24 * 60 * 60, // 31 days
      sameSite: "strict",
      path: "/",
    });
    return res;
  } else {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
