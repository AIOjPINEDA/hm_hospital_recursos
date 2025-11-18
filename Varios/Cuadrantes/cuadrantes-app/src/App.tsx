import { useState, useMemo } from 'react';
import { Upload, LayoutDashboard, User, Calendar } from 'lucide-react';
import { parseCuadrante, type Shift } from './logic/parser';
import { getDoctorStats, getAllDoctorsStats } from './logic/stats';
import { cn } from './lib/utils';
import { EquityTable } from './components/admin/EquityTable';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { GlobalCalendar } from './components/calendar/GlobalCalendar';

export default function App() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('Todos');
  const [activeTab, setActiveTab] = useState<'doctor' | 'admin' | 'calendar'>('doctor');

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

  const allStats = useMemo(() => getAllDoctorsStats(shifts), [shifts]);

  const currentDoctorStats = useMemo(() => {
    if (selectedDoctor === 'Todos') return null;
    return getDoctorStats(shifts, selectedDoctor);
  }, [shifts, selectedDoctor]);

  const doctorShifts = useMemo(() => {
    return shifts.filter(s => s.medico === selectedDoctor);
  }, [shifts, selectedDoctor]);


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
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard de Guardias</h1>
          <p className="text-slate-500">Análisis de Noviembre 2025</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Tab Switcher */}
          <div className="bg-white p-1 rounded-lg border border-gray-200 flex shadow-sm">
            <button
              onClick={() => setActiveTab('doctor')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                activeTab === 'doctor' ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <User className="w-4 h-4" />
              Mi Cuadrante
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                activeTab === 'calendar' ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Calendar className="w-4 h-4" />
              Calendario Global
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                activeTab === 'admin' ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              Visión Global
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {activeTab === 'admin' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Tabla de Equidad</h2>
              <p className="text-sm text-gray-500">Comparativa de carga de trabajo entre facultativos</p>
            </div>
            <EquityTable stats={allStats} />
          </div>
        )}

        {activeTab === 'calendar' && (
          <GlobalCalendar
            shifts={shifts}
            doctors={doctors}
            selectedDoctor={selectedDoctor}
            onSelectDoctor={setSelectedDoctor}
          />
        )}

        {activeTab === 'doctor' && (
          <DoctorDashboard
            stats={currentDoctorStats || {
              doctorName: selectedDoctor,
              totalShifts: 0,
              totalRealHours: 0,
              totalComputedHours: 0,
              nightShifts: 0,
              weekendShifts: 0,
              shiftsByType: {}
            }}
            shifts={doctorShifts}
            allShifts={shifts}
            doctors={doctors}
            selectedDoctor={selectedDoctor}
            onSelectDoctor={setSelectedDoctor}
          />
        )}
      </main>
    </div>
  );
}
