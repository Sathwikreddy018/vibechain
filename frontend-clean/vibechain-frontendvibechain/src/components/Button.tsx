import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#0033AD] text-white hover:bg-[#002080] hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105',
    secondary: 'bg-white text-[#0033AD] border-2 border-[#0033AD] hover:bg-[#0033AD] hover:text-white hover:scale-105',
    ghost: 'bg-transparent text-[#0033AD] hover:bg-[#0033AD]/10 hover:scale-105'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
