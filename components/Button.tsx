import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "rounded-2xl font-bold transition-all duration-200 bounce-click shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[4px]";
  
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-400",
    secondary: "bg-yellow-400 text-yellow-900 hover:bg-yellow-300",
    outline: "bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-400"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl w-full"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};