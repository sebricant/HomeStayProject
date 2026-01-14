import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}

export function Card({ children, className = '', noPadding = false }: CardProps) {
    return (
        <div
            className={`
        bg-surface-sand rounded-xl shadow-soft hover:shadow-lift 
        transition-all duration-300 ease-out border border-white/50
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
