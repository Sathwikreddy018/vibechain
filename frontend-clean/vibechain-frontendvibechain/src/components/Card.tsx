import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}

export default function Card({ children, className = '', hover = false, style }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-[#E2E5E9] p-6 shadow-sm
        ${hover ? 'hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300' : ''}
        ${className}
      `}
      style={style}
    >
      {children}
    </div>
  );
}
