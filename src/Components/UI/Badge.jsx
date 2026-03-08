import React from 'react';

const Badge = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    pulse = false,
    ...props 
}) => {
    const variants = {
        primary: 'bg-primary/10 text-primary border-primary/20',
        secondary: 'bg-secondary/10 text-secondary border-secondary/20',
        success: 'bg-green-500/10 text-green-500 border-green-500/20',
        error: 'bg-red-500/10 text-red-500 border-red-500/20',
        warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        outline: 'border-foreground/20 text-foreground/70',
        ghost: 'bg-foreground/5 text-foreground/50 border-transparent'
    };

    const sizes = {
        xs: 'px-1.5 py-0.5 text-[10px]',
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base'
    };

    return (
        <span
            className={`
                inline-flex items-center justify-center font-bold tracking-wider uppercase rounded-lg border
                ${variants[variant] || variants.primary}
                ${sizes[size] || sizes.md}
                ${pulse ? 'animate-pulse' : ''}
                ${className}
            `}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
