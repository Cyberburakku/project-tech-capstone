import { useEffect, useRef } from "react";

interface SheetProps {
  id: string;
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Bottom sheet on phones, centered dialog on the web (see .sheet in index.css).
 * Escape / scrim close it, focus is trapped while open and restored afterwards.
 */
export function Sheet({ id, open, onClose, labelledBy, children }: SheetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => ref.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab" && ref.current) {
        const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <>
      <div className="scrim" data-open={open} onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        id={id}
        className="sheet"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="grab mx-auto mb-[18px] h-[5px] w-10 rounded-full bg-line" aria-hidden="true" />
        {children}
      </div>
    </>
  );
}

export function SheetClose({ onClose, children = "Close" }: { onClose: () => void; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="mt-2.5 h-[52px] w-full rounded-2xl bg-paper-2 text-base font-bold text-ink hover:bg-line"
    >
      {children}
    </button>
  );
}
