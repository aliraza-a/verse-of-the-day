import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Only allow proxying from verified domains (Unsplash CDN and Islamic Network CDN)
  try {
    const parsed = new URL(imageUrl);
    if (
      parsed.hostname !== "images.unsplash.com" &&
      parsed.hostname !== "cdn.islamic.network"
    ) {
      return new NextResponse("Forbidden domain", { status: 403 });
    }

    const res = await fetch(imageUrl, {
      headers: {
        Accept: "image/*",
      },
    });

    if (!res.ok) {
      return new NextResponse(`Failed to fetch upstream: ${res.status}`, {
        status: res.status,
      });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    console.error("Image proxy error:", err);
    return new NextResponse("Failed to proxy image", { status: 500 });
  }
}
