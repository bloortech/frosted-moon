"use client";

import { type ElementType } from "react";
import { useEditor } from "./editor-context";

/**
 * Text that edits itself in place. Off-edit it renders exactly the element the
 * component always did, so the public site is unchanged.
 *
 * Two modes:
 *  - `rich` (default): the value is a small HTML fragment, so bold / italic /
 *    underline / colour survive. It renders via dangerouslySetInnerHTML and, in
 *    edit mode, becomes a contentEditable that the shared <RichTextToolbar>
 *    formats. Values are authored only by the signed-in admin, so the HTML is
 *    trusted. Legacy plain strings render fine (newlines shown as <br>).
 *  - plain (`rich={false}`): committed as innerText. Right for text that must
 *    stay markup-free because it's also used as data — e.g. a menu item's name,
 *    which goes into the basket and the WhatsApp order message.
 */

function toHtml(value: string): string {
  return (value ?? "").replace(/\n/g, "<br>");
}

export function EditableText({
  path,
  value,
  as,
  className,
  multiline = false,
  rich = true,
  placeholder = "Type here",
}: {
  path: string;
  value: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  rich?: boolean;
  placeholder?: string;
}) {
  const { editing, setField } = useEditor();
  const As: ElementType = as ?? "span";

  // ---- rich (HTML) --------------------------------------------------------
  if (rich) {
    if (!editing) {
      return <As className={className} dangerouslySetInnerHTML={{ __html: toHtml(value) }} />;
    }
    const cls = ["fm-editable", !value && "fm-editable-empty", className]
      .filter(Boolean)
      .join(" ");
    return (
      <As
        className={cls}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        role="textbox"
        aria-label={placeholder}
        data-placeholder={placeholder}
        data-editable-rich="true"
        dangerouslySetInnerHTML={{ __html: toHtml(value) }}
        onBlur={(e: React.FocusEvent<HTMLElement>) => {
          const next = e.currentTarget.innerHTML.trim();
          if (next !== toHtml(value)) setField(path, next);
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
          if (e.key === "Escape") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
      />
    );
  }

  // ---- plain (innerText) --------------------------------------------------
  if (!editing) {
    return (
      <As className={className} style={multiline ? { whiteSpace: "pre-line" } : undefined}>
        {value}
      </As>
    );
  }

  const cls = ["fm-editable", !value && "fm-editable-empty", className]
    .filter(Boolean)
    .join(" ");

  return (
    <As
      className={cls}
      style={multiline ? { whiteSpace: "pre-wrap" } : undefined}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      role="textbox"
      aria-label={placeholder}
      data-placeholder={placeholder}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        // contentEditable emits U+00A0 (nbsp) for spaces — normalise back.
        const raw = e.currentTarget.innerText.replace(/ /g, " ");
        const next = multiline
          ? raw.replace(/\n$/, "")
          : raw.replace(/\s*\n\s*/g, " ").trim();
        if (next !== value) setField(path, next);
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.currentTarget.blur();
        }
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    >
      {value}
    </As>
  );
}
