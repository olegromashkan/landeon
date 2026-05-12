"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, X, ImageOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UnsplashPhoto } from "@/app/api/unsplash/search/route";

interface PickedImage {
  imageUrl: string;
  imageAlt: string;
  imageAttribution: string;
  imagePhotographerUrl: string;
}

interface Props {
  onSelect: (image: PickedImage) => void;
  onClose: () => void;
  initialQuery?: string;
}

export function UnsplashPickerModal({ onSelect, onClose, initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery?.trim()) {
      handleSearch();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/unsplash/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setPhotos(data.photos);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(photo: UnsplashPhoto) {
    // Fire download trigger (required by Unsplash guidelines) — non-blocking
    fetch(`/api/unsplash/trigger-download?download_location=${encodeURIComponent(photo.links.download_location)}`).catch(() => {});

    const photographerUrl = `${photo.user.links.html}?utm_source=landeon&utm_medium=referral`;

    onSelect({
      imageUrl: photo.urls.regular,
      imageAlt: photo.alt_description ?? "",
      imageAttribution: `Photo by ${photo.user.name} on Unsplash`,
      imagePhotographerUrl: photographerUrl,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <p className="text-sm font-semibold text-zinc-200">Choose a photo</p>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-2 flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search photos…"
            className="h-8 text-xs flex-1"
          />
          <Button size="sm" onClick={handleSearch} disabled={loading} className="h-8 gap-1.5">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            Search
          </Button>
        </div>

        {/* Results */}
        <div className="px-4 pb-4 min-h-[200px]">
          {error && (
            <p className="text-xs text-red-400 py-4 text-center">{error}</p>
          )}
          {!error && searched && photos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
              <ImageOff className="w-8 h-8 mb-2" />
              <p className="text-xs">No photos found</p>
            </div>
          )}
          {!error && photos.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {photos.slice(0, 12).map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => handleSelect(photo)}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden group border-2 border-transparent hover:border-purple-500 transition-all"
                  >
                    <img
                      src={photo.urls.small}
                      alt={photo.alt_description ?? ""}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-3 text-center">
                Photos from{" "}
                <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="underline hover:text-zinc-400">
                  Unsplash
                </a>
              </p>
            </>
          )}
          {!searched && !loading && (
            <div className="flex items-center justify-center py-8">
              <p className="text-xs text-zinc-600">Search for free, copyright-free photos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
