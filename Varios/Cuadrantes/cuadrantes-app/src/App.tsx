import React, { useState, useMemo } from 'react';
import { Upload, FileText, Calendar, BarChart2, Clock, Users } from 'lucide-react';
import { parseCuadrante, type Shift } from './logic/parser';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Components ---

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("glass-panel rounded-xl p-6", className)}>
    {children}
  </div>
);

const StatCard = ({ title, value, icon: Icon, color }: any) => (
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

export default function App() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('Todos');

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { shifts: parsedShifts } = parseCuadrante(text);
      setShifts(parsedShifts);
    };
    reader.readAsText(file);
  };

  // --- Analytics ---
  const doctors = useMemo(() => {
    const unique = new Set(shifts.map(s => s.medico));
    return ['Todos', ...Array.from(unique).sort()];
  }, [shifts]);

  const filteredShifts = useMemo(() => {
    return selectedDoctor === 'Todos'
      ? shifts
      : shifts.filter(s => s.medico === selectedDoctor);
  }, [shifts, selectedDoctor]);

  const stats = useMemo(() => {
    const totalShifts = filteredShifts.length;
    const totalHours = filteredShifts.reduce((acc, s) => {
      const start = parseInt(s.startTime.split(':')[0]);
      let end = parseInt(s.endTime.split(':')[0]);
      if (end < start) end += 24; // Handle night shift crossing midnight
      return acc + (end - start);
    }, 0);
    const nightShifts = filteredShifts.filter(s => s.type === 'N').length;
    const weekendShifts = filteredShifts.filter(s => s.isWeekend).length;

    return { totalShifts, totalHours, nightShifts, weekendShifts };
  }, [filteredShifts]);

  // --- Render ---

  if (shifts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div
          className={cn(
            "max-w-xl w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 cursor-pointer",
            isDragging ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-300 hover:border-blue-400 hover:bg-white"
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFileUpload(file);
          }}
        >
          <div className="p-4 bg-blue-100 rounded-full mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Sube tu Cuadrante</h2>
          <p className="text-gray-500 mt-2">Arrastra el archivo CSV aquí</p>
          <input
            type="file"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            id="file-upload"
          />
          <label htmlFor="file-upload" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            Seleccionar Archivo
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard de Guardias</h1>
          <p className="text-slate-500">Análisis de Noviembre 2025</p>
        </div>
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {doctors.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Guardias" value={stats.totalShifts} icon={Calendar} color="text-blue-600" />
          <StatCard title="Horas Totales" value={stats.totalHours} icon={Clock} color="text-emerald-600" />
          <StatCard title="Noches" value={stats.nightShifts} icon={Users} color="text-indigo-600" />
          <StatCard title="Fines de Semana" value={stats.weekendShifts} icon={BarChart2} color="text-amber-600" />
        </div>

        {/* Calendar Grid (Simplified) */}
        <Card>
          <h2 className="text-xl font-semibold mb-6">Vista Calendario</h2>
          <div className="grid grid-cols-7 gap-4">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
              <div key={d} className="text-center font-medium text-gray-400 text-sm py-2">{d}</div>
            ))}

            {/* Empty cells for start of month (Nov 2025 starts on Saturday? No, Nov 1 is Saturday) */}
            {/* We should calculate this dynamically, but for now let's just map the shifts */}
            {/* Group shifts by day */}
            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
              const dayShifts = filteredShifts.filter(s => s.dayOfMonth === day);
              // Simple offset for Nov 2025 (Nov 1 is Saturday -> 5 empty slots)
              // This is hacky, ideally we use date-fns

              return (
                <div key={day} className="min-h-[120px] border border-gray-100 rounded-lg p-2 hover:shadow-md transition-shadow bg-white">
                  <div className="text-right text-sm font-bold text-gray-300 mb-2">{day}</div>
                  <div className="space-y-1">
                    {dayShifts.map(shift => (
                      <div
                        key={shift.id}
                        className={cn(
                          "text-xs p-1.5 rounded border-l-2 truncate",
                          shift.type === 'M' && "bg-blue-50 border-blue-500 text-blue-700",
                          shift.type === 'T' && "bg-amber-50 border-amber-500 text-amber-700",
                          shift.type === 'N' && "bg-indigo-50 border-indigo-500 text-indigo-700",
                          shift.type === 'Ref' && "bg-emerald-50 border-emerald-500 text-emerald-700",
                        )}
                      >
                        <span className="font-bold">{shift.type}</span> {shift.medico}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
}
