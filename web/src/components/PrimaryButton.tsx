import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export default function PrimaryButton({
  children,
  className = "",
  type = "submit",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={`w-full rounded-xl bg-reuse-green-dark py-3 text-lg font-bold text-white transition duration-150 active:scale-[0.97] disabled:opacity-60 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
