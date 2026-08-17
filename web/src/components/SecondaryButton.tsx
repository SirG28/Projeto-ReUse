import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export default function SecondaryButton({
  children,
  className = "",
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={`w-full rounded-xl border border-reuse-green-dark py-3 text-lg font-bold text-reuse-green-dark transition duration-150 active:scale-[0.97] disabled:opacity-60 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
