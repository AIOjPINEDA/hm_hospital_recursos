import { useState, useMemo } from 'react';
import type { Shift } from '../../logic/parser';
import { cn } from '../../lib/utils';
import { Filter, Eye } from 'lucide-react';
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    getDay,
    format,
    parseISO,
    getDate,
    isWeekend
} from 'date-fns';
import { es } from 'date-fns/locale';

interface GlobalCalendarProps {
    shifts: Shift[];
    doctors: string[];
    selectedDoctor: string;
    onSelectDoctor: (doctor: string) => void;
}

type ViewMode = 'highlight' | 'filter';

export function GlobalCalendar({ shifts, doctors, selectedDoctor, onSelectDoctor }: GlobalCalendarProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('highlight');

    // Determine the initial month from shifts or default to current date
    const initialDate = useMemo(() => {
        if (shifts.length > 0) {
            // Find the first valid date in shifts
            const firstShift = shifts.find(s => s.date);
            if (firstShift) return parseISO(firstShift.date);
        }
        return new Date();
    }, [shifts]);

    const [currentMonth, setCurrentMonth] = useState<Date>(initialDate);

    // Update currentMonth if initialDate changes (e.g. new file uploaded)
    // This effect ensures we jump to the correct month when a file is loaded
    useMemo(() => {
        setCurrentMonth(initialDate);
    }, [initialDate]);

    // Calendar Logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Calculate padding for the first week (Monday start)
    // getDay returns 0 for Sunday, 1 for Monday...
    // We want Monday=0, ..., Sunday=6
    const startDayOfWeek = getDay(monthStart);
    const paddingDays = (startDayOfWeek + 6) % 7;

    return (
        <div className="space-y-6">
            {/* Controls Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">

                {/* Month Display */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <span className="px-4 font-semibold text-gray-700 capitalize min-w-[140px] text-center">
                            {format(currentMonth, 'MMMM yyyy', { locale: es })}
                        </span>
                    </div>
                </div>

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
                    {/* Empty cells for start of month padding */}
                    {Array.from({ length: paddingDays }).map((_, i) => (
                        <div key={`pad-${i}`} className="bg-gray-50/30 min-h-[140px]" />
                    ))}

                    {daysInMonth.map(date => {
                        const dayNum = getDate(date);
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const isWeekendDay = isWeekend(date);

                        const dayShifts = shifts.filter(s => s.date === dateStr);

                        // Sort shifts: M, Ref, T, N
                        const sortedShifts = dayShifts.sort((a, b) => {
                            const order = { 'M': 1, 'Ref': 2, 'T': 3, 'N': 4 };
                            return (order[a.type as keyof typeof order] || 99) - (order[b.type as keyof typeof order] || 99);
                        });

                        return (
                            <div key={dateStr} className="min-h-[140px] p-2 hover:bg-gray-50 transition-colors">
                                <div className="text-right mb-2">
                                    <span className={cn(
                                        "text-xs font-bold px-1.5 py-0.5 rounded-full",
                                        isWeekendDay ? "text-red-500 bg-red-50" : "text-gray-400"
                                    )}>
                                        {dayNum}
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

                    {/* Fill remaining cells to complete the grid row if necessary */}
                    {Array.from({ length: (7 - (paddingDays + daysInMonth.length) % 7) % 7 }).map((_, i) => (
                        <div key={`end-pad-${i}`} className="bg-gray-50/30 min-h-[140px]" />
                    ))}
                </div>
            </div>
        </div>
    );
}
