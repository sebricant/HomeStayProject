import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'error' | 'neutral' | 'info';
    className?: string;
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
    const variants = {
        success: "bg-status-success/10 text-status-success border-status-success/20",
        warning: "bg-status-warning/10 text-status-warning border-status-warning/20",
        error: "bg-status-error/10 text-status-error border-status-error/20",
        neutral: "bg-neutral-driftwood/10 text-neutral-driftwood border-neutral-driftwood/20",
        info: "bg-secondary/10 text-secondary-dark border-secondary/20",
    };

    return (
        <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border
      ${variants[variant]}
      ${className}
    `}>
            {children}
        </span>
    );
}
