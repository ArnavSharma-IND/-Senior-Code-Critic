import { User } from "../types";
import { Terminal, ShieldAlert, LogIn, LogOut, Code, User as UserIcon, Calendar } from "lucide-react";

interface HeaderProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  historyCount: number;
}

export default function Header({ user, onOpenAuth, onLogout, historyCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-xs hover:scale-105 transition-transform flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-lg tracking-tight text-slate-950">AI Senior Code Critic</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Automated Architectural Standards & Security Auditor</p>
            </div>
          </div>

          {/* Right Controls Auth/User */}
          <div className="flex items-center gap-4">
            
            {user ? (
              <div className="flex items-center gap-3">
                
                {/* Minimal dashboard badge stats */}
                <div className="bg-slate-50 text-xs border border-slate-200 py-1.5 px-3 rounded-xl flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{historyCount} Reviewed</span>
                </div>

                {/* Profile card metadata dropdown placeholder */}
                <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden md:block text-left select-none">
                    <p className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{user.role}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                    title="Log Out Developer Session"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm hover:scale-[1.01] transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Link Developer ID</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
