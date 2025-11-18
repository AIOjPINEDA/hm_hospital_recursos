import { useState, useMemo } from 'react';
import type { DoctorStats } from '../../logic/stats';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EquityTableProps {
    stats: DoctorStats[];
}

type SortField = 'doctorName' | 'totalRealHours' | 'totalComputedHours' | 'nightShifts' | 'weekendShifts';

export function EquityTable({ stats }: EquityTableProps) {
    const [sortField, setSortField] = useState<SortField>('totalComputedHours');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const sortedStats = useMemo(() => {
        return [...stats].sort((a, b) => {
            const valA = a[sortField];
            const valB = b[sortField];

            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }

            // Numeric sort
            return sortDirection === 'asc'
                ? (valA as number) - (valB as number)
                : (valB as number) - (valA as number);
        });
    }, [stats, sortField, sortDirection]);

    // Calculate max values for bars
    const maxComputed = Math.max(...stats.map(s => s.totalComputedHours));
    const maxNights = Math.max(...stats.map(s => s.nightShifts));

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                    <tr>
                        <SortableHeader label="Médico" field="doctorName" currentSort={sortField} onSort={handleSort} />
                        <SortableHeader label="H. Reales" field="totalRealHours" currentSort={sortField} onSort={handleSort} />
                        <SortableHeader label="H. Computadas" field="totalComputedHours" currentSort={sortField} onSort={handleSort} className="text-blue-600 font-bold" />
                        <SortableHeader label="Noches" field="nightShifts" currentSort={sortField} onSort={handleSort} />
                        <SortableHeader label="Fines de Semana" field="weekendShifts" currentSort={sortField} onSort={handleSort} />
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {sortedStats.map((doctor) => (
                        <tr key={doctor.doctorName} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-900">{doctor.doctorName}</td>
                            <td className="px-4 py-3 text-gray-600">{doctor.totalRealHours}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-blue-700 w-8">{doctor.totalComputedHours}</span>
                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-[100px] overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${(doctor.totalComputedHours / maxComputed) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-700 w-4">{doctor.nightShifts}</span>
                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-[60px] overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full"
                                            style={{ width: `${(doctor.nightShifts / maxNights) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{doctor.weekendShifts}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function SortableHeader({ label, field, currentSort, onSort, className }: any) {
    return (
        <th
            className={cn("px-4 py-3 cursor-pointer hover:text-gray-700 select-none", className)}
            onClick={() => onSort(field)}
        >
            <div className="flex items-center gap-1">
                {label}
                <ArrowUpDown className={cn("w-3 h-3", currentSort === field ? "opacity-100" : "opacity-30")} />
            </div>
        </th>
    );
}
