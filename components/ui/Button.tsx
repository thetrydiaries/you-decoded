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
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gold-500 text-night-950 shadow-glow hover:bg-gold-400 active:scale-95",
    ghost:
      "border border-night-700 text-stardust hover:border-gold-500/50 hover:text-gold-400 active:scale-95",
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
