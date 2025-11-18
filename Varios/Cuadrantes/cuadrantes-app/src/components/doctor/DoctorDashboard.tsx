import { useMemo } from 'react';
import type { DoctorStats } from '../../logic/stats';
import type { Shift } from '../../logic/parser';
import { Card } from '../Card';
import { StatCard } from '../StatCard';
import { Clock, Moon, Sun, Briefcase } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { generateICS } from '../../logic/ics';
import { Download } from 'lucide-react';

interface DoctorDashboardProps {
    stats: DoctorStats;
    shifts: Shift[];
    allShifts: Shift[];
    doctors: string[];
    selectedDoctor: string;
    onSelectDoctor: (doctor: string) => void;
}

const COLORS = ['#3b82f6', '#f59e0b', '#4f46e5', '#10b981']; // Blue, Amber, Indigo, Emerald

export function DoctorDashboard({ stats, shifts, allShifts, doctors, selectedDoctor, onSelectDoctor }: DoctorDashboardProps) {

    const pieData = useMemo(() => {
        return [
            { name: 'Mañana', value: stats.shiftsByType['M'] || 0 },
            { name: 'Tarde', value: stats.shiftsByType['T'] || 0 },
            { name: 'Noche', value: stats.shiftsByType['N'] || 0 },
            { name: 'Refuerzo', value: stats.shiftsByType['Ref'] || 0 },
        ].filter(d => d.value > 0);
    }, [stats]);

    const handleDownloadICS = () => {
        const icsContent = generateICS(shifts, allShifts);
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `guardias_${stats.doctorName.toLowerCase().replace(/\s+/g, '_')}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
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

                <button
                    onClick={handleDownloadICS}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    Descargar Calendario (.ics)
                </button>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Guardias" value={stats.totalShifts} icon={Briefcase} color="text-gray-600" />
                <StatCard title="Horas Reales" value={stats.totalRealHours} icon={Clock} color="text-blue-600" />

                {/* Premium Computed Hours Card */}
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                            <Sun className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Horas Computadas</p>
                            <h3 className="text-2xl font-bold text-amber-900">{stats.totalComputedHours}</h3>
                            <p className="text-xs text-amber-700 mt-1">+7h por noche</p>
                        </div>
                    </div>
                </Card>

                <StatCard title="Noches" value={stats.nightShifts} icon={Moon} color="text-indigo-600" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Distribution Chart */}
                <Card className="min-h-[300px] flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Distribución de Turnos</h3>
                    <div className="flex-1 w-full h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4 flex-wrap">
                        {pieData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="text-gray-600">{entry.name} ({entry.value})</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Calendar List (Simplified Agenda View) */}
                <Card className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Próximas Guardias</h3>
                    <div className="flex-1 overflow-y-auto max-h-[250px] space-y-2 pr-2">
                        {shifts.map(shift => (
                            <div key={shift.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex flex-col items-center justify-center shadow-sm">
                                        <span className="text-[10px] text-gray-500 uppercase">{shift.dayOfWeek.substring(0, 3)}</span>
                                        <span className="text-sm font-bold text-gray-900">{shift.dayOfMonth}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Turno {shift.type}</p>
                                        <p className="text-xs text-gray-500">{shift.startTime} - {shift.endTime}</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-bold 
                  ${shift.type === 'N' ? 'bg-indigo-100 text-indigo-700' :
                                        shift.type === 'M' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'}`}>
                                    {shift.type}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
