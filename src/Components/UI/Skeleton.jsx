import React from 'react';

const Skeleton = ({ className = '', variant = 'rect' }) => {
    const variants = {
        rect: 'rounded-lg',
        circle: 'rounded-full',
        text: 'rounded h-4 w-full'
    };

    return (
        <div
            className={`
                animate-pulse bg-neutral-200 dark:bg-white/5
                ${variants[variant]}
                ${className}
            `}
        />
    );
};

export default Skeleton;
