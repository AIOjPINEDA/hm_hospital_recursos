import { useState } from 'react';
import type { Shift } from '../../logic/parser';
import { cn } from '../../lib/utils';
import { Filter, Eye } from 'lucide-react';

interface GlobalCalendarProps {
    shifts: Shift[];
    doctors: string[];
    selectedDoctor: string;
    onSelectDoctor: (doctor: string) => void;
}

type ViewMode = 'highlight' | 'filter';

export function GlobalCalendar({ shifts, doctors, selectedDoctor, onSelectDoctor }: GlobalCalendarProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('highlight');

    // Group shifts by day
    const daysInMonth = 30; // Fixed for Nov 2025 for now, or derived
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="space-y-6">
            {/* Controls Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Médico:</label>
                    <select
                        value={selectedDoctor}
                        onChange={(e) => onSelectDoctor(e.target.value)}
                        className="w-full md:w-64 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {doctors.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('highlight')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all",
                            viewMode === 'highlight' ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <Eye className="w-4 h-4" />
                        Resaltar
                    </button>
                    <button
                        onClick={() => setViewMode('filter')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all",
                            viewMode === 'filter' ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <Filter className="w-4 h-4" />
                        Filtrar
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                        <div key={d} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {d}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
                    {/* Empty cells for start of month padding if needed (Nov 1 is Sat) */}
                    {/* Nov 1 2025 is Saturday. So we need 5 empty cells (Mon-Fri) */}
                    {Array.from({ length: 5 }).map((_, i) => <div key={`pad-${i}`} className="bg-gray-50/30" />)}

                    {days.map(day => {
                        const dayShifts = shifts.filter(s => s.dayOfMonth === day);

                        // Sort shifts: M, Ref, T, N
                        const sortedShifts = dayShifts.sort((a, b) => {
                            const order = { 'M': 1, 'Ref': 2, 'T': 3, 'N': 4 };
                            return (order[a.type as keyof typeof order] || 99) - (order[b.type as keyof typeof order] || 99);
                        });

                        return (
                            <div key={day} className="min-h-[140px] p-2 hover:bg-gray-50 transition-colors">
                                <div className="text-right mb-2">
                                    <span className={cn(
                                        "text-xs font-bold px-1.5 py-0.5 rounded-full",
                                        dayShifts.some(s => s.isWeekend) ? "text-red-500 bg-red-50" : "text-gray-400"
                                    )}>
                                        {day}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    {sortedShifts.map(shift => {
                                        const isSelected = shift.medico === selectedDoctor;
                                        const isEveryone = selectedDoctor === 'Todos';

                                        // Logic for visibility and opacity
                                        if (viewMode === 'filter' && !isEveryone && !isSelected) return null;

                                        const isDimmed = viewMode === 'highlight' && !isEveryone && !isSelected;

                                        return (
                                            <div
                                                key={shift.id}
                                                className={cn(
                                                    "text-[10px] px-1.5 py-1 rounded border flex justify-between items-center transition-all",
                                                    isDimmed ? "opacity-20 grayscale" : "opacity-100 shadow-sm",
                                                    shift.type === 'M' && "bg-blue-50 border-blue-200 text-blue-700",
                                                    shift.type === 'T' && "bg-amber-50 border-amber-200 text-amber-700",
                                                    shift.type === 'N' && "bg-indigo-50 border-indigo-200 text-indigo-700",
                                                    shift.type === 'Ref' && "bg-emerald-50 border-emerald-200 text-emerald-700",
                                                    isSelected && "ring-2 ring-offset-1 ring-blue-500 z-10 scale-105"
                                                )}
                                            >
                                                <span className="font-bold mr-1">{shift.type}</span>
                                                <span className="truncate max-w-[60px]">{shift.medico}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
