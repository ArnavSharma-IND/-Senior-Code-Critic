Build a production-ready AI-Powered Code Reviewer web application.

Objective:
Create a platform where developers can upload source code files or paste code snippets. The system should analyze the code using Claude API and provide comprehensive feedback similar to a Senior Software Engineer conducting a professional code review.

Core Features:

1. User Authentication

* Email/password authentication
* Google OAuth login
* User profile dashboard
* Usage history

2. Code Submission

* Support multiple languages:

  * Python
  * JavaScript
  * TypeScript
  * Java
  * C++
  * Go
  * Rust
* File upload
* GitHub repository import
* Direct code editor

3. AI Review Engine
   Claude should analyze:

* Syntax issues
* Logical bugs
* Security vulnerabilities
* Performance bottlenecks
* Memory leaks
* Scalability concerns
* Code readability
* Design patterns
* SOLID principles
* Clean architecture violations
* Best practices

4. Review Output
   Generate sections:

Executive Summary

Critical Bugs

Security Issues

Performance Improvements

Code Quality Suggestions

Refactored Code Example

Complexity Analysis

Overall Score (0-100)

5. Advanced Features

* Side-by-side diff view
* Download PDF report
* Export Markdown report
* Team collaboration
* Review history

Technology Stack:
Frontend:

* Next.js 15
* TypeScript
* Tailwind CSS
* Shadcn UI

Backend:

* Node.js
* Express
* PostgreSQL
* Prisma

AI:

* Claude Sonnet API

Deployment:

* Vercel
* Railway

Generate:

* Complete folder structure
* Database schema
* API routes
* Frontend UI
* Authentication flow
* Error handling
* Rate limiting
* README
* Docker support
* Production deployment guide
