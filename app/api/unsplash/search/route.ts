import { NextRequest, NextResponse } from "next/server";

export interface UnsplashPhoto {
  id: string;
  urls: { small: string; regular: string };
  alt_description: string | null;
  user: { name: string; links: { html: string } };
  links: { download_location: string };
}

function getUnsplashAccessKey() {
  return (process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_CLIENT_ID || "")
    .trim()
    .replace(/^["']|["']$/g, "");
}

async function readUnsplashError(res: Response) {
  const details = (await res.json().catch(() => null)) as { errors?: string[] } | null;
  const rawError = details?.errors?.join("; ") || "Unsplash request failed";

  if (res.status === 401) {
    return "Unsplash access key is invalid. Copy the Access Key from your Unsplash application dashboard and update UNSPLASH_ACCESS_KEY in .env.";
  }

  if (res.status === 403) {
    return "Unsplash rejected the request. Check that the application is active and the access key has API access.";
  }

  return rawError;
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const accessKey = getUnsplashAccessKey();
  if (!accessKey) {
    return NextResponse.json({ error: "UNSPLASH_ACCESS_KEY not configured" }, { status: 500 });
  }

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "12");
  url.searchParams.set("orientation", "landscape");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${accessKey}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await readUnsplashError(res);
    return NextResponse.json({ error }, { status: res.status });
  }

  const data = await res.json();
  const photos: UnsplashPhoto[] = data.results.map((p: UnsplashPhoto) => ({
    id: p.id,
    urls: { small: p.urls.small, regular: p.urls.regular },
    alt_description: p.alt_description,
    user: { name: p.user.name, links: { html: p.user.links.html } },
    links: { download_location: p.links.download_location },
  }));

  return NextResponse.json({ photos });
}
