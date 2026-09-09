"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

type ImageUploadProps = {
  name: string;
  initialUrl?: string | null;
};

/**
 * Uploads straight from the browser to Vercel Blob and stores the resulting
 * URL in a hidden input, so the event form posts a URL rather than a file.
 */
export function ImageUpload({ name, initialUrl }: ImageUploadProps) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!ACCEPTED.includes(file.type)) {
      setError("Use a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That photo is over 8MB. Try a smaller one.");
      return;
    }
    setBusy(true);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      setUrl(blob.url);
    } catch (uploadError) {
      console.error(uploadError);
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-lg border border-white/15 bg-white/5">
          {url ? (
            <Image
              src={url}
              alt=""
              fill
              sizes="120px"
              className="object-cover"
              unoptimized={url.startsWith("/")}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[12px] text-white/35">
              No photo
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
              event.target.value = "";
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="rounded-full border border-white/25 px-4 py-2 text-[13px] text-white/80 transition hover:border-white/50 hover:text-white disabled:opacity-50"
            >
              {busy ? "Uploading…" : url ? "Replace photo" : "Choose photo"}
            </button>
            {url && !busy && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white/50 transition hover:border-white/35 hover:text-white/80"
              >
                Remove
              </button>
            )}
          </div>
          <p className="m-0 text-[12px] text-white/40">
            JPG, PNG or WebP, up to 8MB. Landscape photos look best.
          </p>
          {error && (
            <p role="alert" className="m-0 text-[12px] text-[#ff8080]">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
