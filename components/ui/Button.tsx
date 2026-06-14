import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-full transition-[background,transform] duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]";

  const variants = {
    primary:
      "bg-copper-500 text-night-950 hover:bg-copper-400",
    ghost:
      "border border-night-700 text-stardust hover:border-copper-500/50 hover:text-copper-400",
  };

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-10 py-4 text-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
