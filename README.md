# AI-Powered Senior Code Critic Platform

An automated, developer-centric architectural and security audit suite powered by Claude/Gemini model engines, React 19, Vite, Tailwind CSS, and Node.js.

This platform conducts elite automated code reviews comparable to a Lead Systems Architect or Principal Security Engineer. It evaluates complex coding snippets or entire source files across multiple languages, tracks session history synchronously, provides beautiful inline and side-by-side refactoring diff comparisons, and generates beautiful exportable PDF reports or formatted Markdown summaries.

---

## 🚀 Core Architectural Highlights

1. **AI Review Engine**: Connects to server-safe Gemini & Claude LLMs to analyze code. Assesses critical defects of the following profiles:
   - **SOLID Violations**: Single Responsibility, Open-Closed, Dependency Inversion.
   - **Critical Bugs**: Infinite iterations, data races, unhandled exceptions.
   - **OWASP Top 10 Security**: Hardcoded secrets, Buffer Overflows, SQL String Injection.
   - **Performance Hotspots**: Unbounded recursion, memory leaks, resource drain.
   - **Maintainability Index & Complexity Class**: Time (Big-O), Space, Cyclomatic pathways.
2. **Beautiful Diff Viewers**: Intuitive Side-by-Side and Unified visual comparisons between submitted legacy code blocks and improved, modernized refactored solutions.
3. **Advanced PDF & Markdown Reporting**: One-click download integrations for complete styled developer outputs.
4. **Developer Auth Gateway**: Immediate linking of programmer credentials, persistent cache systems, and offline-first profile synchronization.

---

## 📂 Project Directory Structure

```text
├── /server.ts              # Fullstack Node/Express Entrypoint (Vite middleware in dev)
├── /vite.config.ts        # Client asset & reverse-proxy routing configs
├── /package.json          # Node dependency declarations & fullstack compilers
├── /index.html            # Main SPA mount HTML document
├── /src
│   ├── /main.tsx          # Client-side bootstrap initializers
│   ├── /App.tsx           # Primary layout manager, UI orchestrator & State engine
│   ├── /types.ts          # Consolidated Typescript Interfaces (Bugs, Reviews, Stats)
│   ├── /utils.ts          # Dynamic Exports (PDF, MD generators), code formatting, languages
│   ├── /index.css         # Clean Inter & JetBrains Mono font imports and Tailwind rules
│   └── /components
│       ├── /AuthModal.tsx           # Sign-in gates (Email, password & OAuth simulation)
│       ├── /Header.tsx              # Dynamic status headers & live stat counts
│       ├── /CodeSubmissionForm.tsx  # Code text editor, file drop uploaders, GitHub importers
│       ├── /ReviewOutput.tsx        # Score gauge, identified categorized issueslist
│       └── /DiffView.tsx            # Beautiful Side-by-Side code comparison panels
```

---

## 🛠️ API & Endpoint Definitions

### `POST /api/review`
Submits raw code for deep structural audit.
- **Request Body**:
  ```json
  {
    "code": "def process_data(user): ...",
    "language": "python",
    "title": "vulnerable_script.py"
  }
  ```
- **Response**:
  ```json
  {
    "overallScore": 45,
    "executiveSummary": "Unsafe string interpolation leads to SQL injection, and a nested loop slows complexity.",
    "complexity": {
      "cyclomaticComplexity": "High (12)",
      "spaceComplexity": "O(1)",
      "timeComplexity": "O(N^2)",
      "maintainabilityIndex": 35
    },
    "issues": [
      {
        "line": 4,
        "snippet": "query = 'SELECT * FROM users WHERE id = ' + user",
        "title": "SQL Injection risk",
        "description": "Raw string variables directly interpolated in database queries.",
        "severity": "critical",
        "category": "security",
        "remediation": "Transition execution to parameterized statements or use safe ORM properties."
      }
    ],
    "refactoredCode": "def process_data(user_id):\n    # Implemented safe parameterized variables..."
  }
  ```

---

## ⚙️ Prisma Relational Production Schema Suggestion

While the current engine uses a robust **offline-first local database cache storage system** (ensuring near-instant loading, zero API quotas, and persistent developer session saves), if transitioning to a long-lived cloud setup using Prisma + Postgres, apply the following design:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id         String   @id @default(uuid())
  email      String   @unique
  name       String?
  role       String   @default("Developer")
  avatarUrl  String?
  createdAt  DateTime @default(now())
  reviews    Review[]
}

model Review {
  id               String   @id @default(uuid())
  userId           String?
  user             User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  title            String
  language         String
  rawCode          String   @db.Text
  refactoredCode   String   @db.Text
  overallScore     Int
  executiveSummary String   @db.Text
  createdAt        DateTime @default(now())
  
  // Decoupled relational metrics list
  timeComplexity      String
  spaceComplexity     String
  cyclomaticComplexity String
  maintainabilityIndex Int
  
  issues           Issue[]
}

model Issue {
  id          String   @id @default(uuid())
  reviewId    String
  review      Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  line        Int?
  snippet     String?  @db.Text
  title       String
  description String   @db.Text
  severity    String   // "critical", "warning", "suggestion", "info"
  category    String   // "bug", "security", "performance", "style", "architecture"
  remediation String?  @db.Text
}
```

---

## 🐳 Docker Deployment Setup

We provide standard Docker configurations to containerize this fullstack application instantly.

### `Dockerfile`
```dockerfile
# Build Phase
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Execution Phase
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/vite.config.ts ./vite.config.ts

# We use tsx to execute node directly or native build
RUN npm install -g tsx
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```

---

## 🚀 Production Deployment Guide

Deploying this platform to modern cloud hosts is streamlined:

### Railway/Render/Google Cloud Run
1. Create a workspace project on your dashboard.
2. Direct deployment to track your main Git repository.
3. Inject the `GEMINI_API_KEY` (or custom keys) inside your safe **Environment Secrets Settings** configuration panel.
4. Set the host to start automatically on Port `3000`.

### Vercel / Static Hosting
1. Build client static blocks locally using `npm run build`.
2. Connect your repository to Vercel.
3. Configure Vercel serverless functions `/api/*` to reference backend Express API methods for AI proxies.
