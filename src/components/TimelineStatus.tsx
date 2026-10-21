import React from 'react';
import { TicketStatus } from '@/types';
import { CheckCircle2, Clock, ArrowRightCircle, Wrench, XCircle, FileText } from 'lucide-react';

interface TimelineStatusProps {
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  assignedDepartment?: string;
}

const STEPS = [
  { key: 'terkirim', label: 'Aspirasi Masuk', icon: FileText },
  { key: 'diverifikasi', label: 'Diverifikasi', icon: Clock },
  { key: 'didisposisi', label: 'Didisposisi', icon: ArrowRightCircle },
  { key: 'ditindaklanjuti', label: 'Tindak Lanjut', icon: Wrench },
  { key: 'selesai', label: 'Selesai', icon: CheckCircle2 }
];

export default function TimelineStatus({ status, createdAt, updatedAt, assignedDepartment }: TimelineStatusProps) {
  if (status === 'ditolak') {
    return (
      <div className="p-4 rounded-2xl bg-red-50 border border-red-300 flex items-center gap-3 text-red-900">
        <XCircle className="w-6 h-6 shrink-0 text-red-600" />
        <div>
          <h4 className="font-extrabold text-sm">Aspirasi Ditolak</h4>
          <p className="text-xs text-red-800 font-medium mt-0.5">
            Laporan tidak memenuhi kriteria verifikasi, duplikasi, atau berada di luar kewenangan sekolah.
          </p>
        </div>
      </div>
    );
  }

  const getStepIndex = (st: TicketStatus) => {
    switch (st) {
      case 'terkirim': return 0;
      case 'diverifikasi': return 1;
      case 'didisposisi': return 2;
      case 'ditindaklanjuti': return 3;
      case 'selesai': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="w-full bg-white rounded-2xl p-5 sm:p-6 border border-orange-200 shadow-2xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Status Tindak Lanjut</span>
          <h3 className="text-base font-black text-slate-950 capitalize flex items-center gap-2 mt-0.5">
            {STEPS[currentIndex]?.label}
            {currentIndex === 4 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                Tuntas
              </span>
            )}
          </h3>
        </div>
        {assignedDepartment && (
          <div className="text-right">
            <span className="text-xs text-slate-600 font-semibold">Unit Penanggung Jawab</span>
            <p className="text-xs font-black text-orange-700">{assignedDepartment}</p>
          </div>
        )}
      </div>

      {/* Stepper Visual Bar */}
      <div className="relative">
        {/* Track Line */}
        <div className="absolute top-4 left-4 right-4 h-1.5 bg-slate-200 -z-0 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 transition-all duration-500 rounded-full"
            style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Nodes */}
        <div className="flex items-start justify-between relative z-10">
          {STEPS.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center text-center max-w-[70px] sm:max-w-[90px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? 'bg-orange-600 text-white ring-4 ring-orange-200 shadow-md scale-110 font-bold'
                      : isCompleted
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-100 text-slate-600 border-2 border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[11px] sm:text-xs mt-2 font-bold leading-tight ${
                  isCurrent
                    ? 'text-orange-700 font-black'
                    : isCompleted
                    ? 'text-slate-900'
                    : 'text-slate-600'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
