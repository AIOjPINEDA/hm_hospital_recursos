import { useState, useMemo } from 'react';
import { LayoutDashboard, User, Calendar } from 'lucide-react';
import { parseCuadrante, type Shift } from './logic/parser';
import { getDoctorStats, getAllDoctorsStats, getGlobalStats } from './logic/stats';
import { cn } from './lib/utils';
import { EquityTable } from './components/admin/EquityTable';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { GlobalCalendar } from './components/calendar/GlobalCalendar';
import { GlobalStatsCards } from './components/admin/GlobalStatsCards';
import { UploadScreen } from './components/layout/UploadScreen';
import * as XLSX from 'xlsx';

export default function App() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('Todos');
  const [activeTab, setActiveTab] = useState<'doctor' | 'admin' | 'calendar'>('doctor');

  const handleFileUpload = (file: File) => {
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (!data) return;

        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const csvText = XLSX.utils.sheet_to_csv(worksheet);

        const { shifts: parsedShifts } = parseCuadrante(csvText);
        setShifts(parsedShifts);
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Assume CSV
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const { shifts: parsedShifts } = parseCuadrante(text);
        setShifts(parsedShifts);
      };
      reader.readAsText(file);
    }
  };

  // --- Analytics ---
  const doctors = useMemo(() => {
    const unique = new Set(shifts.map(s => s.medico));
    return ['Todos', ...Array.from(unique).sort()];
  }, [shifts]);

  const allStats = useMemo(() => getAllDoctorsStats(shifts), [shifts]);
  const globalStats = useMemo(() => getGlobalStats(shifts), [shifts]);

  const currentDoctorStats = useMemo(() => {
    if (selectedDoctor === 'Todos') return null;
    return getDoctorStats(shifts, selectedDoctor);
  }, [shifts, selectedDoctor]);

  const doctorShifts = useMemo(() => {
    return shifts.filter(s => s.medico === selectedDoctor);
  }, [shifts, selectedDoctor]);


  // --- Render ---

  if (shifts.length === 0) {
    return <UploadScreen onFileUpload={handleFileUpload} />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">GuardiaAPP - HM Torrelodones</h1>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('doctor')}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                activeTab === 'doctor' ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Mi Cuadrante</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                activeTab === 'calendar' ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendario</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                activeTab === 'admin' ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Global</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'admin' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Visión General del Servicio</h2>
              <GlobalStatsCards stats={globalStats} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Tabla de Equidad</h2>
                  <p className="text-sm text-gray-500">Comparativa de carga de trabajo entre facultativos</p>
                </div>
              </div>
              <EquityTable stats={allStats} />
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GlobalCalendar
              shifts={shifts}
              doctors={doctors}
              selectedDoctor={selectedDoctor}
              onSelectDoctor={setSelectedDoctor}
            />
          </div>
        )}

        {activeTab === 'doctor' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
          </div>
        )}
      </main>
    </div>
  );
}
