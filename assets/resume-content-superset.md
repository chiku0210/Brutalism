# Resume Content Superset (Deduplicated)

## Source Resumes
- `resumes/Nielless_Acharya_FullStack_Architect.pdf`
- `resumes/Nielless_Acharya_Backend_Systems.pdf`
- `resumes/Nielless_Acharya_Perf_Scale_Software_Engineer.pdf`
- `resumes/Nielless_Acharya_AI_Product_Engineer.pdf`
- `resumes/Nielless_Acharya_The_Generalist.pdf`
- `resumes/Nielless_Acharya_AI_Engineer.pdf`

## Identity And Contact
- Name: Nielless Acharya
- Phone: +91-6370795661
- Email: nielless.acharya@gmail.com
- Location: India
- Work mode: Remote / Hybrid
- GitHub: github.com/chiku0210
- LinkedIn: nielless-acharya
- Language: English (Fluent)

## Role / Headline Variants
- Full-Stack Software Engineer
- Software Engineer
- Full-Stack Engineer
- AI-Accelerated Full-Stack Engineer
- Node.js, React, TypeScript, AWS, GCP
- Node.js, TypeScript, React, PostgreSQL, NoSQL, AWS, GCP
- Node.js, Next.js, TypeScript, AWS, GCP
- Node.js, Next.js, TypeScript, Python, AWS

## Professional Summary Superset
- 4 years of experience building TypeScript-first full-stack systems with a backend-first engineering approach.
- Specializes in scalable architectures, platform reliability, and high-performance systems in distributed environments.
- Built and maintained systems serving 100K+ monthly sessions.
- Strong in zero-downtime migrations from Python/DynamoDB systems to Node.js/PostgreSQL microservices with strict data integrity.
- Focuses on clean abstraction boundaries, simplicity, and end-to-end ownership from schema design to deployment.
- Experienced in regulated-domain API development and transactional correctness.
- Uses agentic AI workflows (Cursor, GitHub Copilot, Perplexity) to speed architecture/design and implementation cycles.
- Builds AI-powered products and orchestration layers, including low-latency LLM inference and multi-agent coordination patterns.

## Experience

### Publicis Sapient — Software Engineer / Full Stack Software Engineer
- Duration: Jul 2022 - Present
- Clients / products: UnitedHealthCare (UHC), WCI (Carbon Trading)
- Built the UHC e-commerce store from scratch with Next.js/Redux, supporting 100K+ monthly sessions.
- Currently architecting UHC Admin Portal and complex LSA/HSA payment integrations.
- Optimized Core Web Vitals and maintained 95%+ unit test coverage for production reliability.
- Engineered canary deployment pipeline; reduced critical release risk by 40%.
- Re-architected legacy data flow from Python/DynamoDB to Node.js/PostgreSQL with zero-downtime cutover.
- Wrote transformation scripts ensuring 100% data consistency during migration.
- Developed allocation APIs for carbon cap-and-trade workflows with strict PostgreSQL transactional logic.
- Implemented regulated logic enforcing a 10% annual corporate carbon cap reduction with audit compliance.
- Leveraged AI-assisted workflows (notably GitHub Copilot) to accelerate feature delivery.

### PayPal India — Software Engineer Intern
- Duration: Feb 2022 - Jun 2022
- Team: Rapid Emerging Markets
- Built Interoperability Dashboard for real-time merchant transaction failure visibility.
- Developed Node.js REST APIs and React visualizations, reducing payment-failure debugging time for product teams.

## Production Projects

### DB Migration WCI
- Organization: Publicis Sapient (WCI Carbon Trading)
- Re-architected legacy microservice data flow from Python/DynamoDB to Node.js/PostgreSQL.
- Built migration/transformation scripts to preserve full data integrity.
- Executed zero-downtime production cutover with 100% consistency targets.

### WCI Regulated-Domain API Development
- Organization: Publicis Sapient (WCI Carbon Trading)
- Developed core allocation APIs for emissions cap-and-trade workflows.
- Implemented strict PostgreSQL transactional controls for audit-safe execution.
- Encoded regulated logic enforcing a 10% annual corporate carbon cap reduction.

### UHC Store And Admin Portal
- Organization: Publicis Sapient (UnitedHealthCare)
- Built UHC e-commerce store from the ground up using Next.js/Redux.
- Delivered for scale, supporting 100K+ monthly sessions.
- Currently architecting UHC Admin Portal and LSA/HSA payment integration flows.

### Canary Rollout In UHC
- Organization: Publicis Sapient (UnitedHealthCare)
- Engineered canary deployment pipeline for controlled production rollouts.
- Reduced critical release risk by 40% through gradual exposure and safer releases.

### PayPal Interoperability Project
- Organization: PayPal India (Rapid Emerging Markets)
- Built Interoperability Dashboard to visualize merchant transaction failures in real time for product managers & Internal teams.
- Developed Node.js REST APIs and React visualizations to improve debugging speed for product teams.

## Projects

### Repwise (Live)
- Type: Full-stack workout tracker / PWA
- Architected and shipped a full-stack product with unified TypeScript architecture across Next.js UI and Supabase database.
- Used AI-assisted workflows for architecture planning and automated PR generation (up to ~80% automated PR drafting in one variant).
- Owned full SDLC, including schema evolution and deployment.
- Maintained Kanban/RFC-style workflow practices in one project variant.
- Tech: Next.js, TypeScript, Supabase (PostgreSQL), Tailwind CSS, Vercel CI/CD

### Gita Reader
- Type: Offline-first React Native mobile app
- Designed decoupled local SQLite schema (two-table design) with Drizzle ORM for translation-heavy data.
- Built Python + OCR ingestion pipeline to extract/sanitize/patch legacy PDF translations into local DB.
- Added on-device FTS5 search for zero-latency lookup across 700+ records.
- Implemented custom native interactions including PanResponder swipe gestures, sticky UI states, and gradient masking.
- Tech: React Native, SQLite, Drizzle ORM, Python, OCR

### Orion
- Type: Voice-native AI assistant (mobile + backend)
- Built end-to-end system with React Native client and strictly typed Node.js backend.
- Engineered low-latency LLM inference layer using Groq (Llama3-70B) and voice transcription via Whisper.
- Implemented authentication/session architecture with JWT, refresh token rotation, Zustand, and AsyncStorage.
- Managed chat/state persistence with PostgreSQL (including Neon in one variant).
- Tech: React Native, Node.js, PostgreSQL, Groq (Llama3), Whisper, Zustand

### Agentic Systems (Live)
- Type: Multi-agent orchestration system
- Implemented handoff-style agent orchestration and parallel fan-out/fan-in execution patterns using `Promise.all`.
- Built concurrent task execution and response aggregation flows for agent pipelines.
- Tech: Node.js, TypeScript, Groq, multi-agent orchestration

## Technical Skills Superset

### Backend And APIs
- Node.js
- TypeScript
- Express
- Python
- REST API design

### Frontend
- Next.js (including Next.js 14 mention)
- React (including React 18 mention)
- Redux Toolkit
- Tailwind CSS
- React Native

### Data And Databases
- PostgreSQL
- SQLite
- DynamoDB
- Drizzle ORM
- Database normalization
- Data transformation / migration scripting

### Systems And Architecture
- Microservices patterns
- Event-driven architecture
- Distributed systems
- Zero-downtime migration design
- Regulated system design and audit-safe transactional logic

### DevOps And Cloud
- AWS: Lambda, EC2, RDS, CloudWatch
- GCP
- Docker / containerization
- CI/CD: GitHub Actions, Jenkins, Vercel CI/CD
- Datadog

### Testing And Quality
- Jest
- Unit / integration / E2E testing
- High coverage reliability practices (95%+ unit coverage reference)
- Core Web Vitals performance optimization

### AI Tooling And LLM Ecosystem
- Cursor
- GitHub Copilot
- Perplexity
- Claude Sonnet (4.5 and 4.6 mentioned)
- GPT-5.2
- Gemini 3 Pro
- Groq
- LangChain (familiar)

## Certifications
- AWS Certified Cloud Practitioner
  - Credential: VFDHBE51S24QQKC7
  - Variant years seen: 2022 and 2025 (renewed)
- GCP Certified Cloud Digital Leader
  - Credential: 5a57c6ef6a6e4d9695721b1674a3260a
  - Year seen: 2023

## Education
- B.E. Computer Science
- BITS Pilani, Hyderabad Campus, India
- Duration: 2018 - 2022
- CGPA: 7.44/10
- Program: Full-time on-campus

