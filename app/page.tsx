import { readContent } from "@/lib/content-store";
import { Landing } from "@/components/landing";

// Render per request so the site always reflects Nikita's latest saved edits.
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await readContent();
  return <Landing content={content} />;
}
