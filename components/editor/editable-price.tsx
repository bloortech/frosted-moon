"use client";

import { useEditor } from "./editor-context";

/**
 * An editable ₹ price. The rupee sign stays fixed; only the number is editable,
 * and it's committed back as an actual number (so basket totals keep working).
 * Non-digits are stripped on blur.
 */
export function EditablePrice({
  path,
  value,
  className,
}: {
  path: string;
  value: number;
  className?: string;
}) {
  const { editing, setField } = useEditor();

  if (!editing) {
    return <span className={className}>₹{value}</span>;
  }

  return (
    <span className={className}>
      ₹
      <span
        className="fm-editable fm-editable-price"
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        role="textbox"
        aria-label="Price in rupees"
        inputMode="numeric"
        onBlur={(e) => {
          const digits = e.currentTarget.innerText.replace(/[^0-9]/g, "");
          const next = digits === "" ? 0 : parseInt(digits, 10);
          e.currentTarget.innerText = String(next); // normalise the display
          if (next !== value) setField(path, next);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
      >
        {value}
      </span>
    </span>
  );
}
