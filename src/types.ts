/**
 * Types and interfaces for the AI-Powered Code Reviewer.
 */

export enum Language {
  PYTHON = "python",
  JAVASCRIPT = "javascript",
  TYPESCRIPT = "typescript",
  JAVA = "java",
  CPP = "cpp",
  GO = "go",
  RUST = "rust"
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface CodeIssue {
  line?: number;
  snippet?: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "suggestion" | "info";
  category: "bug" | "security" | "performance" | "style" | "architecture";
  remediation?: string;
}

export interface ComplexityStats {
  cyclomaticComplexity: string; // e.g. "Low (3)", "High (12)"
  spaceComplexity: string; // e.g. "O(1)", "O(N)"
  timeComplexity: string; // e.g. "O(N)", "O(log N)"
  maintainabilityIndex: number; // 0-100 score
}

export interface ReviewResult {
  id: string;
  title: string;
  language: string;
  rawCode: string;
  createdAt: string;
  overallScore: number;
  executiveSummary: string;
  complexity: ComplexityStats;
  issues: CodeIssue[];
  refactoredCode: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  language: string;
  overallScore: number;
  createdAt: string;
  codeLength: number;
  issueCount: number;
}
