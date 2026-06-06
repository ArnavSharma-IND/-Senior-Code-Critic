import React, { useState } from "react";
import { User } from "../types";
import { X, Shield, Lock, Mail, User as UserIcon, Github, Chrome } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Process local registration/login and save to localStorage profiles
    const existingUsers = JSON.parse(localStorage.getItem("aicr_users") || "[]") as User[];
    
    if (isLogin) {
      const user = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        // Simple mock authentication success
        onLoginSuccess(user);
        onClose();
      } else {
        // If not found, register them automatically for convenience, or show error
        // Let's create an elegant auto-fallback or alert
        const newUser: User = {
          id: "u_" + Math.random().toString(36).substring(2, 9),
          email: email.toLowerCase(),
          name: email.split("@")[0],
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
          role: "Senior Developer"
        };
        existingUsers.push(newUser);
        localStorage.setItem("aicr_users", JSON.stringify(existingUsers));
        onLoginSuccess(newUser);
        onClose();
      }
    } else {
      const userExists = existingUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        setError("An account with this email already exists.");
        return;
      }

      const newUser: User = {
        id: "u_" + Math.random().toString(36).substring(2, 9),
        email: email.toLowerCase(),
        name: name,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
        role: "Software Architect"
      };
      existingUsers.push(newUser);
      localStorage.setItem("aicr_users", JSON.stringify(existingUsers));
      onLoginSuccess(newUser);
      onClose();
    }
  };

  const handleOAuthLogin = (provider: "google" | "github") => {
    // Elegant simulation of OAuth login with real looking user fields
    const testUser: User = {
      id: provider === "google" ? "google_123" : "github_456",
      email: `${provider}_user@gmail.com`,
      name: provider === "google" ? "Google Developer" : "Github Contributor",
      avatarUrl: provider === "google" 
        ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"
        : "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80",
      role: "Lead Engineer"
    };
    onLoginSuccess(testUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
        
        {/* Header decoration banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:scale-110 transition-transform"
            aria-label="Close auth dialog"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="mx-auto bg-white/15 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">AI Code Reviewer Engine</h2>
          <p className="text-xs text-blue-100 mt-1">Unlock cloud history persistence & custom code exports</p>
        </div>

        {/* Body content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-900 text-red-200 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-9 pr-4 py-2 border border-slate-800 bg-slate-950 text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-4 py-2 border border-slate-800 bg-slate-950 text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-4 py-2 border border-slate-800 bg-slate-950 text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-500 transition-colors cursor-pointer"
            >
              {isLogin ? "Sign In" : "Create Developer ID"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center justify-between">
            <div className="w-full h-px bg-slate-800" />
            <span className="text-[10px] text-slate-500 px-3 uppercase tracking-wider whitespace-nowrap">Or continue and link with</span>
            <div className="w-full h-px bg-slate-800" />
          </div>

          {/* Social OAuth Integration */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuthLogin("google")}
              type="button"
              className="flex items-center justify-center gap-2 py-2 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-300 text-xs transition-all cursor-pointer"
            >
              <Chrome className="w-4 h-4 text-red-500" />
              <span>Google SSO</span>
            </button>
            <button
              onClick={() => handleOAuthLogin("github")}
              type="button"
              className="flex items-center justify-center gap-2 py-2 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-300 text-xs transition-all cursor-pointer"
            >
              <Github className="w-4 h-4 text-slate-200" />
              <span>GitHub Key</span>
            </button>
          </div>

          {/* Footer toggle switcher */}
          <div className="mt-6 text-center text-xs">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:underline transition-all"
            >
              {isLogin ? "New here? Create safe programmer credentials" : "Already registered? Sign back in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
