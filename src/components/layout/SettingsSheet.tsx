import { Sheet, SheetClose } from "@/components/layout/Sheet";
import { useShell } from "@/components/layout/ShellContext";
import { cn } from "@/lib/utils";

function Switch({ id, checked, onChange, label }: { id: string; checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-8 w-[52px] shrink-0 rounded-full transition-colors",
        checked ? "bg-sage" : "bg-ink-3",
        // enlarge the tap target to 44px without changing the look
        "before:absolute before:-inset-2 before:content-['']",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-[3px] top-[3px] size-[26px] rounded-full bg-white shadow transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

export function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { theme, setTheme, still, setStill } = useShell();
  return (
    <Sheet id="sheet-settings" open={open} onClose={onClose} labelledBy="settings-h">
      <h2 id="settings-h" className="text-[26px] leading-tight text-ink">
        Settings
      </h2>
      <div className="mt-2">
        <div className="flex items-center justify-between gap-4 border-b border-line py-4">
          <label htmlFor="set-dark" className="font-bold text-ink">
            Dark mode
          </label>
          <Switch id="set-dark" label="Dark mode" checked={theme === "dark"} onChange={(v) => setTheme(v ? "dark" : "light")} />
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-line py-4">
          <div>
            <label htmlFor="set-still" className="font-bold text-ink">
              Pause animations
            </label>
            <p className="text-sm text-ink-2">Stops the moving sky, sea, and lighthouse.</p>
          </div>
          <Switch id="set-still" label="Pause animations" checked={still} onChange={setStill} />
        </div>
      </div>
      <SheetClose onClose={onClose}>Done</SheetClose>
    </Sheet>
  );
}
