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

    // Create headers for the response
    const headers = new Headers();
    headers.set("Content-Type", contentType || "application/pdf");
    headers.set("Access-Control-Allow-Origin", "*"); // Allow client-side access

    // Add aggressive caching headers
    // public: can be cached by browsers and intermediate proxies
    // max-age=31536000: cache for 1 year (effectively immutable)
    // immutable: indicates the response body will not change over time
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    // Forward ETag if available for conditional requests
    const etag = response.headers.get("etag");
    if (etag) {
      headers.set("ETag", etag);
    }

    // Use response.body directly for streaming to reduce memory usage
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
