import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { blobConfigured, writeContent } from "@/lib/content-store";
import { mergeContent, DEFAULT_CONTENT } from "@/lib/site-content";

export const runtime = "nodejs";

// PUT /api/content — save the whole editable document to Vercel Blob.
// Gated by middleware. The payload is merged over the defaults so a missing or
// malformed field can never blank out a section.
export async function PUT(req: NextRequest) {
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (
    body === null ||
    typeof body !== "object" ||
    !Array.isArray((body as { categories?: unknown }).categories)
  ) {
    return NextResponse.json(
      { success: false, error: "Content must include a categories list" },
      { status: 400 }
    );
  }

  try {
    await writeContent(mergeContent(DEFAULT_CONTENT, body));
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err) {
    // Surface the real cause (admin-only tool) — e.g. a Blob store that was
    // created with private access, which blocks the public writes this needs.
    const message = err instanceof Error ? err.message : "Save failed";
    console.error("Save failed:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
