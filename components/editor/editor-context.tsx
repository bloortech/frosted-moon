"use client";

/**
 * The heart of the inline editor.
 *
 * One React context makes the ordinary <Landing> components editable *in place*.
 * On the public site there is no provider, so `useEditor()` returns the inert
 * default (`editing: false`) and every editable primitive renders exactly what it
 * always did.
 *
 * Inside /admin an `<EditorProvider editing>` holds a working copy of the whole
 * SiteContent document. Components read their slice through `useEditable(...)` so
 * structural edits (add/remove a menu item) re-render live; primitives write back
 * through `setField(path, value)` using dotted paths like
 * `categories.0.items.2.price`.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { SiteContent } from "@/lib/site-content";

type SaveStatus = "idle" | "saving" | "saved" | "error";

type EditorContextValue = {
  editing: boolean;
  content: SiteContent;
  dirty: boolean;
  status: SaveStatus;
  error: string;
  setField: (path: string, value: unknown) => void;
  save: () => Promise<void>;
};

const INERT: EditorContextValue = {
  editing: false,
  content: {} as SiteContent,
  dirty: false,
  status: "idle",
  error: "",
  setField: () => {},
  save: async () => {},
};

const EditorContext = createContext<EditorContextValue>(INERT);

// ---- pure path helpers (numeric segments index arrays) --------------------

/** Read the value at a dotted `path` (e.g. `categories.0.items.2.price`). */
export function getAtPath(root: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) => (acc == null ? acc : (acc as Record<string, unknown>)[key]),
      root
    );
}

/** Immutably set the value at a dotted `path`, cloning each node on the way. */
export function setAtPath<T>(root: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const clone: unknown = Array.isArray(root) ? [...root] : { ...(root ?? {}) };
  let cursor = clone as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const next = cursor[key];
    cursor[key] = Array.isArray(next) ? [...next] : { ...((next as object) ?? {}) };
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
  return clone as T;
}

// ---- provider -------------------------------------------------------------

export function EditorProvider({
  editing = false,
  initialContent,
  children,
}: {
  editing?: boolean;
  initialContent: SiteContent;
  children: ReactNode;
}) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  // Mirror for reads that must see the latest value before React re-renders —
  // e.g. clicking Save immediately after a field blur.
  const contentRef = useRef<SiteContent>(content);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");

  const setField = useCallback((path: string, value: unknown) => {
    setContent((prev) => {
      const next = setAtPath(prev, path, value);
      contentRef.current = next;
      return next;
    });
    setDirty(true);
    setStatus("idle");
  }, []);

  const save = useCallback(async () => {
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentRef.current),
      });
      const body = await res.json();
      if (!body.success) throw new Error(body.error || "Save failed");
      setDirty(false);
      setStatus("saved");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const value = useMemo<EditorContextValue>(
    () => ({ editing, content, dirty, status, error, setField, save }),
    [editing, content, dirty, status, error, setField, save]
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor(): EditorContextValue {
  return useContext(EditorContext);
}

/**
 * Resolve a section's content for rendering. In edit mode returns the reactive
 * working copy (so edits show immediately); otherwise the server-provided prop,
 * falling back to the built-in default. Off-edit this never subscribes to
 * changing state, so the public site pays no re-render cost.
 */
export function useEditable<T>(sectionKey: keyof SiteContent, propContent: T, fallback: T): T {
  const { editing, content } = useContext(EditorContext);
  if (!editing) return propContent ?? fallback;
  return ((content[sectionKey] as T) ?? propContent) ?? fallback;
}
