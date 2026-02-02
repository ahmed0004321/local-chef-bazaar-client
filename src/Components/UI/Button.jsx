import React from 'react';
import { Link } from 'react-router';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  disabled = false,
  to,
  type = 'button',
  onClick,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/20 focus:ring-primary',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary',
    ghost: 'text-foreground hover:bg-neutral-100 dark:hover:bg-white/10 focus:ring-neutral-500',
    danger: 'bg-error text-white hover:bg-error/90 focus:ring-error',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {isLoading ? <span className="loading loading-spinner loading-sm mr-2"></span> : null}
        {children}
      </Link>
    );
  }

  return (
    <button 
      type={type} 
      className={classes} 
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? <span className="loading loading-spinner loading-sm mr-2"></span> : null}
      {children}
    </button>
  );
};

export default Button;
