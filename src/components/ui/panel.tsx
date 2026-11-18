import type { ReactNode } from "react";

export function Panel({
  title,
  aside,
  children,
  className = "",
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`studio-panel min-w-0 ${className}`}>
      <div className="studio-panel-heading">
        <h2>{title}</h2>
        {aside}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function StatusNote({
  tone = "info",
  children,
}: {
  tone?: "info" | "warning" | "error";
  children: ReactNode;
}) {
  const color =
    tone === "error"
      ? "text-red-300"
      : tone === "warning"
        ? "text-amber-300"
        : "text-studio-muted";
  return (
    <p role="status" className={`text-xs ${color}`}>
      {children}
    </p>
  );
}
