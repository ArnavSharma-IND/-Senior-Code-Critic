import React from "react";
import { HistoryItem } from "../types";
import { History, Calendar, Award, Code2, AlertTriangle, ArrowRight, Trash2 } from "lucide-react";

interface HistoryListProps {
  items: HistoryItem[];
  onSelectReview: (id: string) => void;
  onDeleteHistoryItem: (id: string, e: React.MouseEvent) => void;
  activeId?: string;
}

export default function HistoryList({ items, onSelectReview, onDeleteHistoryItem, activeId }: HistoryListProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center">
        <History className="w-8 h-8 text-slate-400 mx-auto mb-2.5" />
        <h3 className="text-slate-800 font-bold text-sm">Review logs are empty</h3>
        <p className="text-xs text-slate-500 mt-1">Submit your first code snippet in the workspace to start tracking audits.</p>
      </div>
    );
  }

  const getScoreBadgeStyle = (score: number) => {
    if (score >=  90) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score >= 75) return "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (score >= 50) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 inline-flex items-center gap-2">
          <History className="w-4.5 h-4.5 text-indigo-600" />
          <span>Audit History Log</span>
        </h3>
        <span className="text-[10px] text-slate-500 font-mono italic">{items.length} sessions</span>
      </div>

      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectReview(item.id)}
              className={`flex items-center justify-between p-3.5 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.01] ${
                isActive 
                  ? "bg-indigo-50/75 border-indigo-500" 
                  : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 border border-slate-200 rounded-lg flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug tracking-tight truncate max-w-[130px] sm:max-w-[180px]">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2.5 mt-1">
                    <span className="text-[9px] text-slate-555 font-mono font-semibold uppercase">{item.language}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[9px] text-slate-500 font-mono font-medium">{item.issueCount} issues</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getScoreBadgeStyle(item.overallScore)}`}>
                  {item.overallScore}%
                </div>
                
                <button
                  onClick={(e) => onDeleteHistoryItem(item.id, e)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                  title="Remove Audit History"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
