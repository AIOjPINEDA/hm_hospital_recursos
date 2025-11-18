import { Card } from './Card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
}

export const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
    <Card className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg bg-opacity-10 ${color} bg-current`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
    </Card>
);
