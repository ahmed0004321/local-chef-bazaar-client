import React, { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    icon,
    className = '',
    containerClassName = '',
    type = 'text',
    ...props
}, ref) => {
    return (
        <div className={`form-control w-full ${containerClassName}`}>
            {label && (
                <label className="label">
                    <span className="label-text font-medium text-foreground/80">{label}</span>
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={`input input-bordered w-full bg-surface text-foreground transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 
            ${icon ? 'pl-11' : ''}
            ${error ? 'input-error focus:ring-error' : ''} 
            ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error font-medium">{error.message || error}</span>
                </label>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
