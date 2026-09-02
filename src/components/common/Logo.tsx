import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark' | 'full-badge';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  className = '',
  showText = true,
}) => {
  const sizeClasses = {
    sm: {
      image: 'h-10 w-10',
      title: 'text-sm font-semibold tracking-tight',
      subtitle: 'text-[9px] tracking-wider',
    },
    md: {
      image: 'h-11 w-11 md:h-12 md:w-12',
      title: 'text-base font-bold tracking-tight',
      subtitle: 'text-[10px] tracking-wider',
    },
    lg: {
      image: 'h-16 w-16 md:h-18 md:w-18',
      title: 'text-xl font-bold tracking-tight',
      subtitle: 'text-xs tracking-wider',
    },
  };

  const isLight = variant === 'light';

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-3 group focus:outline-none select-none ${className}`}
      aria-label="Capital Pioneers Real Estate Home"
    >
      {/* Official Uploaded Logo Asset (Preserved without distortion or modification) */}
      <div
        className={`relative flex-shrink-0 ${sizeClasses[size].image} rounded-xl overflow-hidden bg-[#0B4D68] shadow-sm border border-[#0B4D68]/20 transition-transform duration-300 group-hover:scale-[1.02]`}
      >
        <img
          src="/images/brand/capital-pioneers-logo.jpeg"
          alt="Capital Pioneers Real Estate"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center text-left">
          <span
            className={`transition-colors duration-200 ${sizeClasses[size].title} ${
              isLight ? 'text-white' : 'text-[#0F2432]'
            }`}
          >
            Capital Pioneers
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`font-semibold uppercase text-[#C5A880] ${sizeClasses[size].subtitle}`}
            >
              Real Estate
            </span>
            <span className="h-1 w-1 rounded-full bg-[#0B4D68] inline-block opacity-40"></span>
            <span
              className={`text-[9px] uppercase tracking-wider hidden sm:inline-block font-medium ${
                isLight ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Egypt
            </span>
          </div>
        </div>
      )}
    </Link>
  );
};

export default Logo;
