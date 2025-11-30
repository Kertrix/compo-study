import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return new NextResponse("Failed to fetch PDF", {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type");
    const blob = await response.blob();

    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType || "application/pdf",
        "Access-Control-Allow-Origin": "*", // Allow client-side access
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
