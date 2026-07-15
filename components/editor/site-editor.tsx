"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent } from "@/lib/site-content";
import { EditorProvider, useEditor } from "./editor-context";
import { RichTextToolbar } from "./rich-text-toolbar";
import { CheckIcon, AlertIcon, SpinnerIcon, ArrowLeftIcon } from "./icons";

/**
 * Client shell for /admin. Wraps the server-rendered <Landing> (passed as
 * children) in the editor context and pins a toolbar on top. The page underneath
 * is the real homepage — every editable primitive inside it lights up because it
 * now sits under an <EditorProvider editing>.
 */
export function SiteEditor({
  initialContent,
  children,
}: {
  initialContent: SiteContent;
  children: ReactNode;
}) {
  return (
    <EditorProvider editing initialContent={initialContent}>
      <Toolbar />
      <RichTextToolbar />
      <div className="fm-editor-body">{children}</div>
    </EditorProvider>
  );
}

function Toolbar() {
  const router = useRouter();
  const { content, dirty, status, error, setField, save } = useEditor();

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const logout = async () => {
    await fetch("/api/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="fm-toolbar">
      <div className="fm-toolbar-left">
        <a href="/" target="_blank" rel="noopener noreferrer" className="fm-toolbar-link">
          <ArrowLeftIcon className="fm-toolbar-icon" /> View site
        </a>
        <span className="fm-toolbar-hint">
          Click any text to edit · hover a photo to replace it
        </span>
      </div>

      <div className="fm-toolbar-mid">
        <label className="fm-wa-field">
          <span>WhatsApp #</span>
          <input
            type="text"
            inputMode="numeric"
            value={content.whatsappNumber ?? ""}
            placeholder="91XXXXXXXXXX"
            onChange={(e) =>
              setField("whatsappNumber", e.target.value.replace(/[^0-9]/g, ""))
            }
          />
        </label>
      </div>

      <div className="fm-toolbar-right">
        {status === "saved" && !dirty && (
          <span className="fm-status fm-status-ok">
            <CheckIcon className="fm-toolbar-icon" /> Saved — live on the site
          </span>
        )}
        {status === "error" && (
          <span className="fm-status fm-status-err" title={error}>
            <AlertIcon className="fm-toolbar-icon" /> {error}
          </span>
        )}
        {dirty && status !== "error" && (
          <span className="fm-status fm-status-dirty">
            <span className="fm-dot" /> Unsaved changes
          </span>
        )}
        <button className="fm-save-btn" onClick={save} disabled={!dirty || status === "saving"}>
          {status === "saving" && <SpinnerIcon className="fm-toolbar-icon" />}
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>
        <button className="fm-logout-btn" onClick={logout} title="Sign out">
          Sign out
        </button>
      </div>
    </header>
  );
}
