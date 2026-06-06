import React, { useState, useRef, useEffect } from "react";
import { Language } from "../types";
import { SAMPLE_CODES, getLanguageFromFilename } from "../utils";
import { 
  Code2, Upload, GitPullRequest, Laptop, FileText, Sparkles, HelpCircle, 
  RefreshCw, CheckCircle2, ChevronRight, AlertCircle, Play
} from "lucide-react";

interface CodeSubmissionFormProps {
  onSubmit: (code: string, language: Language, title: string) => Promise<void>;
  isReviewing: boolean;
}

export default function CodeSubmissionForm({ onSubmit, isReviewing }: CodeSubmissionFormProps) {
  const [code, setCode] = useState(SAMPLE_CODES[Language.PYTHON]);
  const [selectedLang, setSelectedLang] = useState<Language>(Language.PYTHON);
  const [title, setTitle] = useState("fibonacci_rec.py");
  const [gitUrl, setGitUrl] = useState("");
  const [gitStatus, setGitStatus] = useState<"idle" | "loading" | "imported" | "error">("idle");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize initial sample code when language changes
  const handleLanguageChange = (lang: Language) => {
    setSelectedLang(lang);
    setCode(SAMPLE_CODES[lang]);
    
    // Choose appropriate file name
    const extMap: Record<Language, string> = {
      [Language.PYTHON]: "fibonacci.py",
      [Language.JAVASCRIPT]: "workspace_loader.js",
      [Language.TYPESCRIPT]: "data_sync.ts",
      [Language.JAVA]: "InventoryManager.java",
      [Language.CPP]: "buffer_overflow.cpp",
      [Language.GO]: "counter_concurrency.go",
      [Language.RUST]: "unsafe_by_pass.rs"
    };
    setTitle(extMap[lang]);
  };

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const detectedLang = getLanguageFromFilename(file.name);
    setSelectedLang(detectedLang);
    setTitle(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) setCode(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // GitHub import analyzer simulation
  const handleGitHubImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gitUrl) return;

    setGitStatus("loading");
    
    setTimeout(() => {
      // Simulate reading code from popular web repos
      if (gitUrl.includes("github.com")) {
        const repoSegments = gitUrl.replace("https://github.com/", "").split("/");
        const fileName = repoSegments.pop() || "main.py";
        const cleanName = fileName.includes(".") ? fileName : "service.ts";
        setGitStatus("imported");
        setTitle(cleanName);
        setSelectedLang(getLanguageFromFilename(cleanName));
        setCode(`// Imported directly from Remote Repository: ${gitUrl}
// Scanning project structures to audit SOLID architectures and Security:

function runProjectPipeline() {
  const secretToken = "ghp_secure_API_VULNERABLE_KEY_123456789"; 
  console.log("Reading workspace logs...");
  
  // High memory leak issue
  const unboundedCache = [];
  while (true) {
    unboundedCache.push(new Array(1000000).fill("Leaking"));
    if (Math.random() > 0.99) break;
  }
  return { status: "Active", token: secretToken };
}
`);
      } else {
        setGitStatus("error");
      }
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isReviewing) return;
    onSubmit(code, selectedLang, title);
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Switch Selector for Inputs: Paste Vs Upload Vs Git */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Template Quick Selection panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800 inline-flex items-center gap-2">
              <Code2 className="w-4.5 h-4.5 text-indigo-600" />
              <span>Diagnostic Sandbox Scenarios</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Select a language template code</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {Object.values(Language).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`py-2 px-2 rounded-xl text-center text-xs font-mono border transition-all cursor-pointer ${
                  selectedLang === lang
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* GitHub Repository Importer */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 inline-flex items-center gap-2 mb-2">
              <GitPullRequest className="w-4.5 h-4.5 text-indigo-500" />
              <span>Import via GitHub URL</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">Audit raw source files directly from shared web repos</p>
          </div>

          <form onSubmit={handleGitHubImport} className="space-y-2">
            <div className="flex">
              <input
                type="text"
                placeholder="https://github.com/user/repo/file.ts"
                value={gitUrl}
                onChange={(e) => setGitUrl(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-l-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={gitStatus === "loading"}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 rounded-r-lg font-bold text-xs cursor-pointer transition-colors"
              >
                {gitStatus === "loading" ? "Reading..." : "Import"}
              </button>
            </div>
            {gitStatus === "imported" && (
              <div className="text-[10px] text-emerald-600 inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Successfully imported {title}</span>
              </div>
            )}
            {gitStatus === "error" && (
              <div className="text-[10px] text-rose-600 inline-flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Invalid GitHub URL. Must link directly to a file</span>
              </div>
            )}
          </form>
        </div>

      </div>

      {/* Main Code Editor Box & Drag and Drop zone */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <label htmlFor="codeReviewTitleInput" className="text-sm font-semibold text-slate-800 block">Workspace Code Sandbox</label>
              <input
                id="codeReviewTitleInput"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="filename.ts"
                className="text-xs text-slate-500 bg-transparent border-none p-0 focus:ring-0 focus:outline-none font-mono mt-0.5"
              />
            </div>
            
            <div className="flex items-center gap-3">
              {/* File Upload drag action trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-50 border border-slate-250 hover:bg-slate-100 text-slate-700 text-xs py-1.5 px-3 rounded-xl inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>Upload Code File</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                accept=".py,.js,.jsx,.ts,.tsx,.java,.cpp,.h,.hpp,.go,.rs"
                className="hidden"
              />
            </div>
          </div>

          {/* Interactive Drag Zone Area */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-xl border transition-all ${
              dragActive 
                ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/20" 
                : "border-slate-800 bg-slate-900 shadow-inner"
            }`}
          >
            {dragActive && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 rounded-xl">
                <Upload className="w-10 h-10 text-indigo-500 animate-bounce mb-2" />
                <p className="text-sm font-bold text-slate-200">Release to audit this code file</p>
                <p className="text-xs text-slate-500">Supports Python, JS, TS, Java, C++, Go, Rust</p>
              </div>
            )}

            {/* Standard Text Editor Area */}
            <div className="relative font-mono text-sm">
              
              {/* Vertical Gutter simulation */}
              <div className="absolute left-0 top-0 bottom-0 w-11 bg-slate-950 border-r border-slate-800 rounded-l-xl flex flex-col pt-4 text-right pr-2 text-[10px] text-slate-600 select-none">
                {Array.from({ length: Math.min(code.split("\n").length, 30) }).map((_, idx) => (
                  <span key={idx}>{idx + 1}</span>
                ))}
                {code.split("\n").length > 30 && <span>...</span>}
              </div>

              <textarea
                aria-label="Code submission text area"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste or write your source code block here to trigger standard security audits..."
                className="w-full h-80 pl-16 pr-4 py-4 bg-transparent text-slate-300 focus:outline-none focus:ring-0 font-mono text-xs sm:text-sm leading-relaxed resize-y border-none"
                style={{ fontFamily: '"JetBrains Mono", Fira Code, Courier New, monospace' }}
              />
            </div>

          </div>

          {/* Bottom actions list */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-550 inline-flex items-center gap-1.5 leading-tight">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Full audits include memory leaks, complexity analysis & custom SOLID refactored suggestions.</span>
            </p>
            
            <button
              type="submit"
              disabled={isReviewing || !code.trim()}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 px-6 rounded-lg hover:shadow-md hover:shadow-indigo-500/10 transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isReviewing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Initiate Code Review</span>
                </>
              )}
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
