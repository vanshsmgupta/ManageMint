import React from 'react';
import { theme } from '../../styles/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantStyles = {
    primary: `bg-primary-main text-white hover:bg-primary-hover focus:ring-primary-main
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:transform active:scale-95'}`,
    secondary: `bg-secondary-main text-white hover:bg-secondary-hover focus:ring-secondary-main
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:transform active:scale-95'}`,
    success: `bg-success-main text-white hover:bg-success-hover focus:ring-success-main
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:transform active:scale-95'}`,
    warning: `bg-warning-main text-white hover:bg-warning-hover focus:ring-warning-main
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:transform active:scale-95'}`,
    error: `bg-error-main text-white hover:bg-error-hover focus:ring-error-main
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:transform active:scale-95'}`,
    outline: `border-2 border-primary-main text-primary-main bg-transparent hover:bg-primary-bg focus:ring-primary-main
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-hover hover:text-primary-hover active:transform active:scale-95'}`,
    ghost: `text-primary-main bg-transparent hover:bg-primary-bg focus:ring-primary-main
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-primary-hover active:transform active:scale-95'}`,
  };

  const loadingStyles = isLoading ? 'cursor-wait opacity-75' : '';
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${loadingStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;