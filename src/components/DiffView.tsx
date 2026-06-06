import { useState } from "react";
import { Split, Columns, Code } from "lucide-react";

interface DiffViewProps {
  original: string;
  refactored: string;
  language: string;
}

export default function DiffView({ original, refactored, language }: DiffViewProps) {
  const [isSplitMode, setIsSplitMode] = useState(true);

  // Split string into line arrays
  const originalLines = original.split("\n");
  const refactoredLines = refactored.split("\n");

  const maxLines = Math.max(originalLines.length, refactoredLines.length);

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 font-mono text-sm leading-6">
      
      {/* Header bar controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-blue-500" />
          <span className="font-semibold text-slate-200">Refactoring Comparison</span>
          <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full uppercase">{language}</span>
        </div>
        <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-lg">
          <button
            onClick={() => setIsSplitMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
              isSplitMode ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-side</span>
          </button>
          <button
            onClick={() => setIsSplitMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
              !isSplitMode ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Unified (Proposed)</span>
          </button>
        </div>
      </div>

      {/* Code body panel */}
      {isSplitMode ? (
        <div className="grid grid-cols-2 divide-x divide-slate-800 overflow-x-auto min-h-[400px]">
          {/* Legacy Left Side */}
          <div className="p-4 bg-slate-950 text-slate-300">
            <h4 className="text-xs font-bold text-red-400 border-b border-red-950 pb-2 mb-2 uppercase tracking-wide">Original Implementation</h4>
            <div className="space-y-0.5 min-w-[300px]">
              {originalLines.map((line, idx) => {
                // Heuristic highlighting (e.g. if the line is modified/refactored, color it red if it represents removed parts)
                const isDifferent = refactoredLines[idx] !== line;
                return (
                  <div 
                    key={`org-${idx}`} 
                    className={`flex items-start rounded px-2 hover:bg-slate-900 transition-colors ${
                      isDifferent && line.trim() !== "" ? "bg-red-950/40 text-red-200 border-l-2 border-red-500" : ""
                    }`}
                  >
                    <span className="text-slate-600 select-none text-right w-8 mr-4 inline-block">{idx + 1}</span>
                    <pre className="whitespace-pre overflow-x-auto">{line || " "}</pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clean Right Side */}
          <div className="p-4 bg-slate-950 text-slate-300">
            <h4 className="text-xs font-bold text-emerald-400 border-b border-emerald-950 pb-2 mb-2 uppercase tracking-wide">Refactored Proposal</h4>
            <div className="space-y-0.5 min-w-[300px]">
              {refactoredLines.map((line, idx) => {
                const isDifferent = originalLines[idx] !== line;
                return (
                  <div 
                    key={`new-${idx}`} 
                    className={`flex items-start rounded px-2 hover:bg-slate-900 transition-colors ${
                      isDifferent && line.trim() !== "" ? "bg-emerald-950/30 text-emerald-300 border-l-2 border-emerald-500" : ""
                    }`}
                  >
                    <span className="text-slate-600 select-none text-right w-8 mr-4 inline-block">{idx + 1}</span>
                    <pre className="whitespace-pre overflow-x-auto">{line || " "}</pre>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 overflow-x-auto bg-slate-950 text-slate-300 min-h-[400px]">
          <h4 className="text-xs font-bold text-blue-400 border-b border-slate-800 pb-2 mb-2 uppercase tracking-wide">Unified Refactored Result</h4>
          <div className="space-y-0.5">
            {refactoredLines.map((line, idx) => {
              return (
                <div key={`uni-${idx}`} className="flex items-start px-2 rounded hover:bg-slate-900 transition-colors">
                  <span className="text-slate-600 select-none text-right w-8 mr-4 inline-block">{idx + 1}</span>
                  <pre className="whitespace-pre overflow-x-auto">{line || " "}</pre>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
