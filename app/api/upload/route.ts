import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { blobConfigured } from "@/lib/content-store";

export const runtime = "nodejs";
export const maxDuration = 60;

// POST /api/upload — store one uploaded photo in Vercel Blob and hand back its
// public URL. Gated by middleware. next/image optimises the remote image on the
// fly, so no server-side resizing is needed here.
export async function POST(req: NextRequest) {
  if (!blobConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Storage isn't set up yet. Create a Blob store in the Vercel dashboard (Storage → Create → Blob), then redeploy.",
      },
      { status: 503 }
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { success: false, error: "Please choose an image file" },
      { status: 400 }
    );
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { success: false, error: "Image is too large (max 10MB)" },
      { status: 400 }
    );
  }

  try {
    const safeName = file.name.replace(/[^a-z0-9.]/gi, "-").toLowerCase() || "photo";
    const blob = await put(`menu/${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return NextResponse.json({ success: true, url: blob.url });
  } catch (err) {
    // Surface the real cause (admin-only tool) — e.g. a private Blob store,
    // which blocks the public uploads a website needs.
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("Upload failed:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
