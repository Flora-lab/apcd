// src/components/ui/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "primary" | "secondary" | "danger" | "icon";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "solid",
  children,
  className = "",
  ...props
}) => {
  const baseStyle =
    "px-4 py-2 rounded font-medium transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<string, string> = {
    solid: `${baseStyle} bg-blue-600 text-white hover:bg-blue-700`,
    outline: `${baseStyle} bg-transparent border border-current text-current hover:bg-gray-100`,
    primary: `${baseStyle} bg-blue-600 text-white hover:bg-blue-700`,
    secondary: `${baseStyle} bg-gray-200 text-gray-800 hover:bg-gray-300`,
    danger: `${baseStyle} bg-red-600 text-white hover:bg-red-700`,
    icon: `${baseStyle} p-2 bg-transparent hover:bg-gray-200 rounded-full`,
  };

  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
