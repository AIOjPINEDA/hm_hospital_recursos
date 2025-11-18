import React from 'react';
import { cn } from '../lib/utils';

export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("glass-panel rounded-xl p-6", className)}>
        {children}
    </div>
);
