import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, FileText, CheckCircle2, Heart, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface UploadScreenProps {
    onFileUpload: (file: File) => void;
}

export function UploadScreen({ onFileUpload }: UploadScreenProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelection(file);
        }
    }, [onFileUpload]);

    const handleFileSelection = (file: File) => {
        setIsProcessing(true);
        // Small delay to show the processing state for better UX
        setTimeout(() => {
            onFileUpload(file);
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
            {/* Dynamic Background */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-slow-spin opacity-30 bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)]" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-slate-100 animate-gradient-xy" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />

                {/* Decorative Orbs */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Main Content Card */}
            <div className="relative z-10 max-w-xl w-full mx-4">
                <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
                        GuardiaAPP
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Gestión inteligente de cuadrantes médicos
                    </p>
                </div>

                <div
                    className={cn(
                        "group relative bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border transition-all duration-500 ease-out",
                        isDragging
                            ? "border-blue-500 scale-102 shadow-blue-500/20 bg-blue-50/50"
                            : "border-white/20 hover:border-blue-300/50 hover:shadow-xl",
                        isProcessing && "scale-95 opacity-90"
                    )}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center justify-center text-center space-y-6">
                        {/* Icon Container */}
                        <div className={cn(
                            "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500",
                            isDragging ? "bg-blue-600 rotate-12 scale-110" : "bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 group-hover:scale-105",
                            isProcessing && "bg-green-500 rotate-0 scale-100"
                        )}>
                            {isProcessing ? (
                                <CheckCircle2 className="w-10 h-10 text-white animate-in zoom-in duration-300" />
                            ) : (
                                <Upload className="w-10 h-10 text-white" />
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold text-slate-900">
                                {isProcessing ? 'Procesando archivo...' : 'Sube tu Cuadrante'}
                            </h2>
                            <p className="text-slate-500 max-w-xs mx-auto leading-relaxed">
                                {isDragging
                                    ? 'Suelta el archivo para comenzar'
                                    : 'Arrastra tu Excel o CSV aquí, o haz clic para explorar'}
                            </p>
                        </div>

                        {/* File Types Badges */}
                        {!isProcessing && (
                            <div className="flex gap-3 pt-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                                    <FileSpreadsheet className="w-3.5 h-3.5" />
                                    Excel
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100">
                                    <FileText className="w-3.5 h-3.5" />
                                    CSV
                                </span>
                            </div>
                        )}

                        {/* Hidden Input & Button */}
                        <input
                            type="file"
                            className="hidden"
                            accept=".csv,.xlsx,.xls"
                            onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                            id="file-upload"
                            disabled={isProcessing}
                        />

                        {!isProcessing && (
                            <label
                                htmlFor="file-upload"
                                className="mt-4 px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer active:scale-95"
                            >
                                Seleccionar Archivo
                            </label>
                        )}
                    </div>
                </div>

                <div className="mt-12 mx-auto max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 rounded-2xl p-4 flex gap-4 items-start text-left shadow-sm hover:shadow-md transition-all">
                        <div className="bg-amber-100 p-2 rounded-full shrink-0">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-amber-900 font-medium flex items-center gap-2">
                                Nota Importante
                                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
                            </p>
                            <p className="text-xs text-amber-800/80 leading-relaxed">
                                Esta app está creada con cariño para ayudar a los compañeros de Torre, pero <strong>NO debe usarse como única fuente de verdad</strong>.
                                <br className="mb-1" />
                                Es una herramienta en desarrollo (demo): por favor, verificad siempre el conteo de horas manualmente.
                            </p>
                        </div>
                    </div>

                    <p className="mt-6 text-xs text-slate-400 font-medium text-center">
                        HM Torrelodones • Servicio de Urgencias
                    </p>
                </div>
            </div>
        </div>
    );
}
