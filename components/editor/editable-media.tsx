"use client";

import { useState, type ReactNode } from "react";
import { useEditor } from "./editor-context";
import { ImageIcon, SpinnerIcon } from "./icons";

/**
 * Makes a photo replaceable in place. Renders the existing media (`children`) and,
 * in edit mode, lays a hover overlay over it with a single "Replace photo"
 * affordance. Uploading hits `/api/upload`, then writes the resulting URL back to
 * `path`. Off-edit it's a no-op passthrough.
 *
 * The overlay is an absolutely-positioned sibling of the media, so it must live
 * inside a `position: relative` container (every photo container on the site
 * already is — that's what next/image `fill` needs).
 */
export function EditableMedia({
  path,
  label = "Replace photo",
  children,
}: {
  path: string;
  label?: string;
  children: ReactNode;
}) {
  const { editing, setField } = useEditor();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!editing) return <>{children}</>;

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const body = await res.json();
      if (!body.success) throw new Error(body.error || "Upload failed");
      setField(path, body.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {children}
      <label className={`fm-media-overlay${uploading ? " is-busy" : ""}`}>
        {uploading ? (
          <SpinnerIcon className="fm-media-icon" />
        ) : (
          <ImageIcon className="fm-media-icon" />
        )}
        <span className="fm-media-label">{uploading ? "Uploading…" : label}</span>
        {error && <span className="fm-media-error">{error}</span>}
        <input
          type="file"
          accept="image/*"
          className="fm-visually-hidden"
          disabled={uploading}
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </label>
    </>
  );
}
