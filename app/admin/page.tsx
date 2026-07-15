import { readContent } from "@/lib/content-store";
import { Landing } from "@/components/landing";
import { SiteEditor } from "@/components/editor/site-editor";

// The inline editor: the real homepage, made editable in place. Renders the exact
// same <Landing> the public route does, wrapped in the editor shell so its
// editable primitives light up. Access is gated by middleware.ts (/admin/login).
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const content = await readContent();

  return (
    <SiteEditor initialContent={content}>
      <Landing content={content} />
    </SiteEditor>
  );
}
