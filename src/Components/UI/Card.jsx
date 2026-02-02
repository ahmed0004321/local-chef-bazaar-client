import React from 'react';

const Card = ({ children, className = '', hoverEffect = false, compact = false }) => {
    return (
        <div
            className={`
        bg-surface/80 dark:bg-surface/40 backdrop-blur-md 
        border border-neutral-200 dark:border-white/10 
        rounded-2xl shadow-sm text-card-foreground overflow-hidden
        ${hoverEffect ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300' : ''}
        ${compact ? 'p-4' : 'p-6'}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default Card;
