export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 pt-6 sm:flex-row sm:items-end sm:justify-between sm:pt-10">
      <div>
        {eyebrow && (
          <p className="mb-1 text-sm font-bold uppercase tracking-wide text-primary-dark">{eyebrow}</p>
        )}
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-base text-ink-soft">{description}</p>}
      </div>
      {children}
    </div>
  );
}
