import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "default" | "success" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
  variant?: Variant;
};

const VARIANT_CLASS: Record<Variant, string> = {
  default: "text-reuse-text hover:bg-reuse-surface-sunken",
  success: "text-reuse-green-dark hover:bg-reuse-status-accepted-bg",
  danger: "text-reuse-danger hover:bg-reuse-status-rejected-bg",
};

// Exportado pra dar o mesmo visual circular a um <Link> (ex.: um ícone que
// navega em vez de disparar uma action) sem aninhar um <button> dentro de um
// <a> — os dois são elementos interativos, e HTML não permite aninhá-los.
export function iconButtonClass({
  variant = "default",
  className = "",
}: { variant?: Variant; className?: string } = {}) {
  return `focus-ring flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 disabled:opacity-60 ${VARIANT_CLASS[variant]} ${className}`;
}

export default function IconButton({
  icon,
  label,
  variant = "default",
  className = "",
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`focus-ring flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 disabled:opacity-60 ${VARIANT_CLASS[variant]} ${className}`}
      {...rest}
    >
      {icon}
    </button>
  );
}
