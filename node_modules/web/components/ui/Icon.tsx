import { icons } from 'lucide-react';

export const Icon = ({ name, className, size = 20 }: { name: keyof typeof icons; className?: string; size?: number }) => {
    const LucideIcon = icons[name];
    if (!LucideIcon) return null;
    return <LucideIcon className={className} size={size} />;
};
