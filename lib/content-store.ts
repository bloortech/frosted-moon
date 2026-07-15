import "server-only";
import { list, put } from "@vercel/blob";
import {
  DEFAULT_CONTENT,
  mergeContent,
  type SiteContent,
} from "./site-content";

/**
 * Reads and writes the whole editable site as a single JSON document in Vercel
 * Blob. One product, one env var (`BLOB_READ_WRITE_TOKEN`, injected by Vercel
 * when you create a Blob store), no database.
 *
 * The document lives at a stable path so its public URL never changes. Reads
 * always fall back to the built-in defaults, so the site renders fine before the
 * Blob store exists or before Nikita's first save — nothing here can take the
 * homepage down.
 */

const CONTENT_PATH = "site/content.json";

/** Cache tag so a save can revalidate the public page's cached read. */
export const CONTENT_TAG = "site-content";

/** True once a Blob store is wired up (locally via .env.local, or on Vercel). */
export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function readContent(): Promise<SiteContent> {
  if (!blobConfigured()) return DEFAULT_CONTENT;
  try {
    const { blobs } = await list({ prefix: CONTENT_PATH, limit: 1 });
    const blob = blobs.find((b) => b.pathname === CONTENT_PATH);
    if (!blob) return DEFAULT_CONTENT;

    // no-store + a version stamp from the blob's uploadedAt: the document is
    // overwritten in place (stable URL), so the ?v= query busts any CDN copy and
    // guarantees the latest save shows up immediately.
    const version = new Date(blob.uploadedAt).getTime();
    const res = await fetch(`${blob.url}?v=${version}`, { cache: "no-store" });
    if (!res.ok) return DEFAULT_CONTENT;

    const saved = await res.json();
    return mergeContent(DEFAULT_CONTENT, saved);
  } catch (err) {
    console.error("readContent failed, serving defaults:", err);
    return DEFAULT_CONTENT;
  }
}

export async function writeContent(content: SiteContent): Promise<void> {
  await put(CONTENT_PATH, JSON.stringify(content), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false, // stable path — overwrite the same object each save
    allowOverwrite: true,
    cacheControlMaxAge: 60, // minimum allowed; reads cache-bust with ?v= anyway
  });
}
