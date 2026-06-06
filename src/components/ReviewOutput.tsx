import { useState } from "react";
import { ReviewResult, CodeIssue } from "../types";
import { downloadMarkdown, downloadPrintableHTML } from "../utils";
import DiffView from "./DiffView";
import { 
  FileText, ShieldAlert, Cpu, Sparkles, TrendingUp, AlertTriangle, CheckCircle, 
  Download, FileDown, Layers, Share2, Clipboard, Settings, HelpCircle, Code
} from "lucide-react";

interface ReviewOutputProps {
  review: ReviewResult;
}

export default function ReviewOutput({ review }: ReviewOutputProps) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [copied, setCopied] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-700 border-emerald-300/60 bg-emerald-50";
    if (score >= 75) return "text-indigo-700 border-indigo-300/60 bg-indigo-50";
    if (score >= 50) return "text-amber-700 border-amber-300/60 bg-amber-50";
    return "text-rose-700 border-rose-300/60 bg-rose-50";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { title: "Production Ready", desc: "No critical bugs or severe security flaws. Follows solid senior-level design practices." };
    if (score >= 75) return { title: "Good Standards", desc: "Clean codebase, minor bugs or architecture patterns can be further optimized." };
    if (score >= 50) return { title: "Refactoring Advised", desc: "Contains performance bottlenecks or architectural concerns. Audit suggests moderate revision." };
    return { title: "Refactor Critical", desc: "Vulnerable to security issues, performance blockages, or memory leaks. Code requires senior assistance." };
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(review.refactoredCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter issues based on clicked category badge
  const filteredIssues = activeCategoryFilter === "all" 
    ? review.issues 
    : review.issues.filter(i => i.category === activeCategoryFilter);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Upper Status Bento grid info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Quality Score circular Dial */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Overall Score Card</h3>
          <div className="relative flex items-center justify-center w-36 h-36">
            {/* Outer score wheel circle background */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-slate-100"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                className={`transition-all duration-1000 ease-out ${
                  review.overallScore >= 90 ? "stroke-emerald-500" : review.overallScore >= 75 ? "stroke-indigo-600" : review.overallScore >= 50 ? "stroke-amber-500" : "stroke-rose-500"
                }`}
                strokeWidth="10"
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * review.overallScore) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-slate-900 leading-none font-mono">{review.overallScore}</span>
              <span className="text-[10px] text-slate-400 font-mono mt-1">/ 100 max</span>
            </div>
          </div>
          
          <div className={`mt-5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${getScoreColor(review.overallScore)}`}>
            {getScoreLabel(review.overallScore).title}
          </div>
        </div>

        {/* Executive Summary Card Card */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-505 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-slate-800 font-bold">Review Summary & Verdict</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-indigo-200 pl-4 py-1">
              "{review.executiveSummary}"
            </p>
          </div>

          {/* Quick Details footer list */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 mt-4 border-t border-slate-100">
            <div>
              <span className="block text-[10px] text-slate-400 font-mono uppercase">Complexity Class</span>
              <span className="text-sm font-bold text-slate-800">{review.complexity.timeComplexity}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-mono uppercase">Issues Count</span>
              <span className="text-sm font-bold text-slate-800">{review.issues.length} flagged</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="block text-[10px] text-slate-400 font-mono uppercase">Refactor Complexity</span>
              <span className="text-sm font-bold text-slate-800">{review.complexity.cyclomaticComplexity}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Advanced Analysis Options (PDF / MD export actions list) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border border-slate-200 py-3 px-5 rounded-2xl">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-bold text-slate-700">Auditor Export Tools</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => downloadMarkdown(review)}
            className="text-xs font-semibold py-1.5 px-3.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 inline-flex items-center gap-2 transition-all cursor-pointer rounded-lg shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export Markdown</span>
          </button>
          
          <button
            onClick={() => downloadPrintableHTML(review)}
            className="text-xs font-semibold py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg inline-flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <FileDown className="w-3.5 h-3.5 text-white" />
            <span>Generate PDF Report</span>
          </button>
        </div>
      </div>

      {/* Section categorized issues */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-sm font-bold text-slate-850 inline-flex items-center gap-2">
            <ShieldAlert className="w-4.5 h-4.5 text-rose-500" />
            <span>Identified Issues & Vulnerabilities</span>
          </h3>
          
          {/* Bento Category badges filters */}
          <div className="flex flex-wrap gap-2 text-xs">
            {["all", "bug", "security", "performance", "style", "architecture"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`py-1 px-2.5 rounded-lg border font-mono transition-all cursor-pointer ${
                  activeCategoryFilter === cat
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-bold"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* List filtered cards */}
        {filteredIssues.length === 0 ? (
          <div className="py-12 border border-dashed border-slate-200 rounded-2xl text-center bg-white">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2.5" />
            <h4 className="text-slate-800 font-bold text-sm">Perfect Score on selected filters!</h4>
            <p className="text-xs text-slate-500 mt-1">AI auditor detected no patterns matching this issue profile.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredIssues.map((issue, idx) => {
              const borderTheme = 
                issue.severity === "critical" ? "border-rose-200 bg-rose-50/20 hover:border-rose-300/60" :
                issue.severity === "warning" ? "border-amber-200 bg-amber-50/20 hover:border-amber-300/60" :
                "border-slate-200 bg-white hover:border-slate-300";

              const badgeTheme = 
                issue.severity === "critical" ? "bg-rose-50 text-rose-700 border-rose-200" :
                issue.severity === "warning" ? "bg-amber-50 text-amber-700 border-amber-200" :
                "bg-indigo-50 text-indigo-700 border-indigo-200";

              return (
                <div 
                  key={`issue-${idx}`} 
                  className={`border rounded-2xl p-5 transition-all flex flex-col justify-between shadow-2xs ${borderTheme}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div>
                        <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 font-mono font-bold px-2 py-0.5 rounded-md uppercase mr-2 inline-block">
                          {issue.category}
                        </span>
                        {issue.line && (
                          <span className="text-[10px] text-slate-400 font-mono font-medium">
                            Line {issue.line}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-slate-800 mt-2 leading-tight">
                          {issue.title}
                        </h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeTheme} uppercase`}>
                        {issue.severity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {issue.description}
                    </p>
                  </div>

                  {issue.remediation && (
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl mt-2">
                      <span className="block text-[10px] text-emerald-700 font-bold mb-1 uppercase tracking-wider">Auditor Remediation Guard</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {issue.remediation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Code comparisons diff viewer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 inline-flex items-center gap-2">
            <Cpu className="w-4.5 h-4.5 text-indigo-600" />
            <span>Reviewer Refactoring Refinement</span>
          </h3>
          <button
            onClick={handleCopyCode}
            className="text-xs font-semibold py-1.5 px-3.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-slate-650 inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <Clipboard className="w-3.5 h-3.5 text-indigo-600" />
            <span>{copied ? "Copied code!" : "Copy Proposed Code"}</span>
          </button>
        </div>

        <DiffView 
          original={review.rawCode} 
          refactored={review.refactoredCode} 
          language={review.language} 
        />
      </div>

    </div>
  );
}
