"use client";

import { useEffect, useState } from "react";
import { BoldIcon, ItalicIcon, UnderlineIcon, EraserIcon } from "./icons";

/**
 * Bubble toolbar for formatting rich <EditableText> fields. It watches the
 * document selection; whenever the caret sits inside a `[data-editable-rich]`
 * element it pops above the selection with bold / italic / underline / colour /
 * clear controls. Font family is intentionally omitted — the site CSS owns that.
 *
 * Formatting uses document.execCommand: deprecated, but still the only one-liner
 * for styling a live contentEditable, and this is an internal admin tool.
 * `onMouseDown → preventDefault` keeps the text selection alive while a button is
 * pressed.
 */

const COLORS = [
  { name: "Ink", value: "#1c1a17" },
  { name: "Clay", value: "#c46a45" },
  { name: "Mint", value: "#5b8b6f" },
  { name: "Blush", value: "#b5726a" },
  { name: "Butter", value: "#a58a4a" },
  { name: "White", value: "#ffffff" },
];

function activeRichElement(): HTMLElement | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  let node: Node | null = sel.anchorNode;
  while (node && node !== document.body) {
    if (node instanceof HTMLElement && node.dataset.editableRich === "true") return node;
    node = node.parentNode;
  }
  return null;
}

export function RichTextToolbar() {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const update = () => {
      const el = activeRichElement();
      const sel = window.getSelection();
      if (!el || !sel || sel.rangeCount === 0) {
        setPos(null);
        return;
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      const anchor = rect.width || rect.height ? rect : el.getBoundingClientRect();
      setPos({
        top: anchor.top + window.scrollY - 46,
        left: anchor.left + window.scrollX + anchor.width / 2,
      });
    };
    document.addEventListener("selectionchange", update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      document.removeEventListener("selectionchange", update);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!pos) return null;

  const exec = (command: string, value?: string) => {
    // If nothing is selected (just a caret), format the whole field — otherwise
    // clicking a colour/bold with no selection appears to "do nothing".
    const el = activeRichElement();
    const sel = window.getSelection();
    if (el && sel && sel.isCollapsed) {
      const range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand(command, false, value);
  };

  return (
    <div
      className="fm-rt-toolbar"
      style={{ top: pos.top, left: pos.left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <button type="button" className="fm-rt-btn" aria-label="Bold" title="Bold" onClick={() => exec("bold")}>
        <BoldIcon className="fm-rt-icon" />
      </button>
      <button type="button" className="fm-rt-btn" aria-label="Italic" title="Italic" onClick={() => exec("italic")}>
        <ItalicIcon className="fm-rt-icon" />
      </button>
      <button
        type="button"
        className="fm-rt-btn"
        aria-label="Underline"
        title="Underline"
        onClick={() => exec("underline")}
      >
        <UnderlineIcon className="fm-rt-icon" />
      </button>

      <span className="fm-rt-divider" />

      {COLORS.map((c) => (
        <button
          key={c.value}
          type="button"
          className="fm-rt-swatch"
          aria-label={`Colour: ${c.name}`}
          title={c.name}
          style={{ backgroundColor: c.value }}
          onClick={() => exec("foreColor", c.value)}
        />
      ))}

      <span className="fm-rt-divider" />

      <button
        type="button"
        className="fm-rt-btn"
        aria-label="Clear formatting"
        title="Clear formatting"
        onClick={() => exec("removeFormat")}
      >
        <EraserIcon className="fm-rt-icon" />
      </button>
    </div>
  );
}
