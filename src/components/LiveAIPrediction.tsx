'use client';

import React from 'react';
import { Tag, Info } from 'lucide-react';
import { AspirationCategory, UrgencyLevel } from '@/types';
import { CATEGORY_DETAILS, URGENCY_DETAILS } from '@/lib/nlpClassifier';

interface LiveAIPredictionProps {
  prediction: {
    category: AspirationCategory;
    confidence: number;
    urgency: UrgencyLevel;
    urgencyReason: string;
    detectedKeywords: string[];
  } | null;
  manualCategory: AspirationCategory | null;
  onSelectCategory: (cat: AspirationCategory) => void;
}

export default function LiveAIPrediction({
  prediction,
  manualCategory,
  onSelectCategory
}: LiveAIPredictionProps) {
  if (!prediction) return null;

  const currentCat = manualCategory || prediction.category;
  const catDetail = CATEGORY_DETAILS[currentCat];
  const urgencyDetail = URGENCY_DETAILS[prediction.urgency];

  return (
    <div className="rounded-2xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 via-amber-50/40 to-white p-4 sm:p-5 shadow-2xs space-y-4 transition-all">
      
      {/* Header Widget */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-xs">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-950 flex items-center gap-1.5">
              Rekomendasi Kategori Topik
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-orange-200 text-orange-950 border border-orange-300">
                {prediction.confidence}% Kesesuaian
              </span>
            </h4>
          </div>
        </div>
        
        {/* Urgency Pill */}
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${urgencyDetail.badgeBg}`}>
          <span className={`w-2 h-2 rounded-full ${urgencyDetail.dotColor}`} />
          {urgencyDetail.label}
        </span>
      </div>

      {/* Category Recommendation Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-orange-200 shadow-2xs">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Kategori Terpilih</span>
          <p className="text-sm font-black text-slate-950 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-orange-600" />
            {catDetail.label}
          </p>
          <p className="text-xs text-slate-700 font-medium">
            Diteruskan ke: <span className="font-bold text-slate-950">{catDetail.department}</span>
          </p>
        </div>

        {/* Change manual selector */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-slate-700 font-bold mr-1 hidden sm:inline">Sesuaikan:</span>
          {(Object.keys(CATEGORY_DETAILS) as AspirationCategory[]).map((catKey) => (
            <button
              key={catKey}
              type="button"
              onClick={() => onSelectCategory(catKey)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                currentCat === catKey
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-800 hover:bg-orange-100 hover:text-orange-900 border border-slate-200'
              }`}
            >
              {CATEGORY_DETAILS[catKey].label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Reason & Keywords */}
      <div className="space-y-2 text-xs">
        <div className="flex items-start gap-2 text-slate-800 font-medium">
          <Info className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
          <p>{prediction.urgencyReason}</p>
        </div>

        {prediction.detectedKeywords.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-bold text-slate-700">Kata Kunci Terdeteksi:</span>
            {prediction.detectedKeywords.slice(0, 7).map((kw, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-950 font-mono text-[11px] font-bold border border-orange-200"
              >
                #{kw}
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
