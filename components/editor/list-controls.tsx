"use client";

import { useEditor, getAtPath } from "./editor-context";
import { PlusIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from "./icons";

/**
 * Structural editing for an array inside the content (a category's menu items).
 * `listPath` points at the array; the helpers rewrite the whole array through
 * `setField`, which keeps saves complete.
 */
export function useListControls(listPath: string) {
  const { editing, content, setField } = useEditor();
  const arr = (editing ? (getAtPath(content, listPath) as unknown[]) : null) ?? [];

  const add = (item: unknown) => setField(listPath, [...arr, item]);
  const remove = (index: number) =>
    setField(listPath, arr.filter((_, i) => i !== index));
  const move = (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= arr.length) return;
    const next = [...arr];
    [next[index], next[j]] = [next[j], next[index]];
    setField(listPath, next);
  };

  return { editing, length: arr.length, add, remove, move };
}

/** Floating reorder / remove cluster for a single list item (edit mode only). */
export function ListItemControls({
  index,
  length,
  onMove,
  onRemove,
}: {
  index: number;
  length: number;
  onMove: (index: number, dir: -1 | 1) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="fm-item-controls" contentEditable={false}>
      <button
        type="button"
        onClick={() => onMove(index, -1)}
        disabled={index === 0}
        aria-label="Move up"
      >
        <ChevronUpIcon className="fm-ctrl-icon" />
      </button>
      <button
        type="button"
        onClick={() => onMove(index, 1)}
        disabled={index === length - 1}
        aria-label="Move down"
      >
        <ChevronDownIcon className="fm-ctrl-icon" />
      </button>
      <button
        type="button"
        className="fm-ctrl-danger"
        onClick={() => onRemove(index)}
        aria-label="Remove item"
      >
        <TrashIcon className="fm-ctrl-icon" />
      </button>
    </div>
  );
}

/** Dashed "Add …" button for a list (edit mode only). */
export function AddItemButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="fm-add-btn" onClick={onClick} contentEditable={false}>
      <PlusIcon className="fm-ctrl-icon" /> {label}
    </button>
  );
}
