import type { GlobalStats } from '../../logic/stats';
import { Clock, Users, Calendar, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

interface GlobalStatsCardsProps {
    stats: GlobalStats;
}

export function GlobalStatsCards({ stats }: GlobalStatsCardsProps) {
    const cards = [
        {
            label: 'Horas Totales (Computadas)',
            value: stats.totalComputedHours,
            subValue: `${stats.totalRealHours}h reales`,
            icon: Clock,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100'
        },
        {
            label: 'Promedio por Médico',
            value: `${stats.avgHoursPerDoctor}h`,
            subValue: `${stats.activeDoctors} médicos activos`,
            icon: Users,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100'
        },
        {
            label: 'Total Guardias',
            value: stats.totalShifts,
            subValue: 'Turnos asignados',
            icon: Calendar,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100'
        },
        {
            label: 'Distribución',
            value: stats.shiftsByType['N'] || 0,
            subValue: 'Noches totales',
            icon: Activity,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className={cn(
                        "bg-white p-5 rounded-xl border shadow-sm transition-all hover:shadow-md",
                        card.border
                    )}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{card.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
                            <p className="text-xs text-gray-400 mt-1">{card.subValue}</p>
                        </div>
                        <div className={cn("p-2 rounded-lg", card.bg)}>
                            <card.icon className={cn("w-5 h-5", card.color)} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
