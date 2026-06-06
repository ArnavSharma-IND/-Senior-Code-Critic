import React, { useState, useEffect } from "react";
import { User, ReviewResult, HistoryItem, Language } from "./types";
import Header from "./components/Header";
import CodeSubmissionForm from "./components/CodeSubmissionForm";
import ReviewOutput from "./components/ReviewOutput";
import HistoryList from "./components/HistoryList";
import AuthModal from "./components/AuthModal";
import { 
  ShieldAlert, BookOpen, Clock, Activity, Settings, HelpCircle, 
  Github, Layers, Lightbulb, Compass, Play
} from "lucide-react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [currentReview, setCurrentReview] = useState<ReviewResult | null>(null);
  const [reviewsHistory, setReviewsHistory] = useState<ReviewResult[]>([]);
  const [activeReviewId, setActiveReviewId] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load user session and past reviews on launch
  useEffect(() => {
    const savedUser = localStorage.getItem("aicr_active_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedReviews = localStorage.getItem("aicr_cached_reviews");
    if (savedReviews) {
      const parsed = JSON.parse(savedReviews) as ReviewResult[];
      setReviewsHistory(parsed);
      if (parsed.length > 0) {
        setCurrentReview(parsed[0]);
        setActiveReviewId(parsed[0].id);
      }
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem("aicr_active_user", JSON.stringify(loggedInUser));
    showToast(`Linked developer account: ${loggedInUser.name}`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("aicr_active_user");
    showToast("Disconnected Developer Profile.");
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Submit code to backend Express server for deep audit
  const handleCodeSubmit = async (code: string, language: Language, title: string) => {
    setIsReviewing(true);
    
    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, title }),
      });

      if (!response.ok) {
        throw new Error("Critique connection failure. Ensure backend services are booting.");
      }

      const data = await response.json();
      
      // Inject standard required ID and timestamp for persistence
      const result: ReviewResult = {
        ...data,
        id: "rev_" + Math.random().toString(36).substring(2, 9),
        title: title || "raw_snippet",
        language: language,
        rawCode: code,
        createdAt: new Date().toISOString(),
      };

      // Add to local state & persist
      const updatedHistory = [result, ...reviewsHistory];
      setReviewsHistory(updatedHistory);
      localStorage.setItem("aicr_cached_reviews", JSON.stringify(updatedHistory));

      setCurrentReview(result);
      setActiveReviewId(result.id);
      showToast("Audit completed. Senior Critic feedback loaded!");
    } catch (e: any) {
      console.error(e);
      showToast(`Review failed: ${e.message || "Endpoint error."}`);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleSelectReviewFromHistory = (id: string) => {
    const found = reviewsHistory.find(r => r.id === id);
    if (found) {
      setCurrentReview(found);
      setActiveReviewId(id);
      showToast(`Loaded review: ${found.title}`);
    }
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = reviewsHistory.filter(r => r.id !== id);
    setReviewsHistory(updated);
    localStorage.setItem("aicr_cached_reviews", JSON.stringify(updated));

    if (activeReviewId === id) {
      if (updated.length > 0) {
        setCurrentReview(updated[0]);
        setActiveReviewId(updated[0].id);
      } else {
        setCurrentReview(null);
        setActiveReviewId(undefined);
      }
    }
    showToast("Audit history entry removed.");
  };

  // Map history results to condensed display items
  const historyItems: HistoryItem[] = reviewsHistory.map(r => ({
    id: r.id,
    title: r.title,
    language: r.language,
    overallScore: r.overallScore,
    createdAt: r.createdAt,
    codeLength: r.rawCode.length,
    issueCount: r.issues.length
  }));

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-900 font-sans antialiased selection:bg-indigo-600/10 selection:text-indigo-900">
      
      {/* Dynamic Header Component */}
      <Header 
        user={user} 
        onOpenAuth={() => setIsAuthModalOpen(true)} 
        onLogout={handleLogout} 
        historyCount={reviewsHistory.length}
      />

      {/* Main dashboard content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        
        {/* Subtle Welcome instructions */}
        <div className="mb-8 border border-slate-200 bg-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-3xs">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-800 inline-flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>Workspace Dashboard</span>
            </h2>
            <p className="text-xs text-slate-505">
              Paste software snippets, drop local scripts, or reference remote GitHub files to evaluate design paradigms (SOLID), security models, and bottlenecks.
            </p>
          </div>
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200 self-stretch md:self-auto text-center animate-pulse">
            UTC Core system online
          </div>
        </div>

        {/* Dashboard layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Submissions & Editor Area (Left 2 cols on Desktop) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Input Submission forms widget */}
            <CodeSubmissionForm 
              onSubmit={handleCodeSubmit} 
              isReviewing={isReviewing} 
            />

            {/* Current Review interactive Output Panel */}
            {currentReview ? (
              <div className="pt-4 border-t border-slate-200">
                <ReviewOutput review={currentReview} />
              </div>
            ) : (
              <div className="py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-white shadow-3xs selection:bg-transparent">
                <div className="mx-auto bg-slate-50 border border-slate-200 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                  <Play className="w-5 h-5 fill-indigo-600 text-indigo-600" />
                </div>
                <h3 className="text-slate-800 font-bold text-sm">No Active Audited Code</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
                  Click 'Initiate Code Review' above to send the sandbox snippet to the Gemini auditing engine.
                </p>
              </div>
            )}

          </div>

          {/* History tracker and guides sidebar panel (Right 1 col on Desktop) */}
          <div className="space-y-6">
            
            {/* History logger list card */}
            <HistoryList 
              items={historyItems} 
              onSelectReview={handleSelectReviewFromHistory} 
              onDeleteHistoryItem={handleDeleteHistoryItem}
              activeId={activeReviewId}
            />

            {/* Knowledge block resources widgets */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Auditing Paradigms</span>
              </h3>
              
              <ul className="space-y-3.5 text-xs">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5" />
                  <div>
                    <strong className="text-slate-800 font-semibold">SOLID Violation Scans</strong>
                    <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">Audits compliance with Single Responsibility, Open-Closed, and Dependency Inversion rules.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5" />
                  <div>
                    <strong className="text-slate-800 font-semibold">OWASP & Security Checks</strong>
                    <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">Flags critical threats (SQL Injection, XSS, unsafe pointer arithmetic, buffer overflow, credential exposure).</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                  <div>
                    <strong className="text-slate-800 font-semibold">Complexity Reductions</strong>
                    <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">Heuristics measure Big-O limits and cyclomatic pathways to propose light algorithmic alternatives.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </main>

      {/* Styled Footer */}
      <footer className="w-full mt-auto py-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center select-none">
          <p className="text-xs text-slate-400 font-medium tracking-wider">
            &copy; {new Date().getFullYear()} AI Senior Code Critic. Copyrighted by Arnav Sharma.
          </p>
        </div>
      </footer>

      {/* Floating status alert popup to replace heavy notifications libraries */}
      {toastMessage && (
        <div id="statusAlertPopupContainer" className="fixed bottom-6 right-6 z-50">
          <div className="bg-slate-900 border border-slate-800 text-white py-3 px-4 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Authentication Modal Popup dialog */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
