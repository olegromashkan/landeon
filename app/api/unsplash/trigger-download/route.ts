import { NextRequest, NextResponse } from "next/server";

function getUnsplashAccessKey() {
  return (process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_CLIENT_ID || "")
    .trim()
    .replace(/^["']|["']$/g, "");
}

export async function GET(req: NextRequest) {
  const downloadLocation = req.nextUrl.searchParams.get("download_location");
  if (!downloadLocation) {
    return NextResponse.json({ error: "download_location is required" }, { status: 400 });
  }

  const accessKey = getUnsplashAccessKey();
  if (!accessKey) {
    return NextResponse.json({ error: "UNSPLASH_ACCESS_KEY not configured" }, { status: 500 });
  }

  try {
    await fetch(downloadLocation, {
      headers: { Authorization: `Client-ID ${accessKey}` },
      cache: "no-store",
    });
  } catch {
    // Non-blocking — attribution failure should not break the user flow
  }

  return NextResponse.json({ ok: true });
}
