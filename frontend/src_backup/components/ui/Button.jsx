import React from "react";

export default function Button({ variant = "primary", size = "md", className = "", ...props }) {
  const base = "inline-flex items-center justify-center rounded px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand.accent disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  };
  const variants = {
    primary: "bg-black text-white hover:bg-brand.light",
    secondary: "bg-white text-black border hover:bg-gray-50",
    ghost: "bg-transparent text-black hover:bg-gray-100",
  };
  const cls = [base, sizes[size], variants[variant], className].join(" ");
  return <button className={cls} {...props} />;
}