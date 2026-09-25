import { Sheet, SheetClose } from "@/components/layout/Sheet";
import { useShell } from "@/components/layout/ShellContext";
import { cn } from "@/lib/utils";
import { AVATARS, AvatarArt } from "@/components/shared/avatars";

/** Avatar choice: a radio group of illustrated portraits (arrow keys move between them). */
function AvatarPicker({ value, onChange }: { value: string | null; onChange: (id: string) => void }) {
  const current = value ?? "";
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const i = AVATARS.findIndex((a) => a.id === current);
    const next = AVATARS[(i + keys[e.key] + AVATARS.length) % AVATARS.length];
    onChange(next.id);
    document.getElementById(`avatar-${next.id}`)?.focus();
  };
  return (
    <div className="border-b border-line py-4">
      <p id="avatar-label" className="font-bold text-ink">
        Your avatar
      </p>
      <p className="text-sm text-ink-2">Pick the one that feels most like you.</p>
      <div role="radiogroup" aria-labelledby="avatar-label" onKeyDown={onKeyDown} className="mt-3 grid grid-cols-5 gap-2.5">
        {AVATARS.map((a, i) => {
          const selected = a.id === current;
          const tabbable = selected || (!current && i === 0);
          return (
            <button
              key={a.id}
              id={`avatar-${a.id}`}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={a.label}
              tabIndex={tabbable ? 0 : -1}
              onClick={() => onChange(a.id)}
              className={cn(
                "aspect-square min-h-11 rounded-full p-0.5 ring-offset-2 ring-offset-paper transition-shadow",
                selected ? "ring-[3px] ring-sage" : "ring-1 ring-line hover:ring-2 hover:ring-sage/60",
              )}
            >
              <AvatarArt id={a.id} className="size-full" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
  const { theme, setTheme, still, setStill, avatarId, setAvatarId } = useShell();
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
        <AvatarPicker value={avatarId} onChange={setAvatarId} />
      </div>
      <SheetClose onClose={onClose}>Done</SheetClose>
    </Sheet>
  );
}
