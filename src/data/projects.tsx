import React from "react";
import { Waveform, MetricBar, FanOut, MigrationFlow } from "@/components/Visualizations";

export const projects = [
  {
    id: "orion",
    counter: "SYSTEM_001",
    title: "ORION",
    status: "ACTIVE",
    description: "Voice-native AI assistant. End-to-end agent orchestration layer for low-latency verbal reasoning. Engineered sub-500ms voice-to-voice response times.",
    tags: ["REACT NATIVE", "NODE.JS", "GROQ", "WHISPER"],
    visualization: <Waveform />,
    expandedDetails: {
      bullets: [
        "Architected end-to-end pipeline for real-time LLM inference and voice transcription.",
        "Integrated Whisper large-v3 via Groq for high-concurrency STT processing.",
        "Implemented stateful agent handoffs using Node.js event emitters.",
        "Custom JWT-based authentication with refresh token rotation and state persistence."
      ],
      techTags: ["REACT NATIVE", "NODE.JS", "POSTGRESQL", "GROQ", "WHISPER", "ZUSTAND"],
      watermark: "LOW_LATENCY_AI"
    }
  },
  {
    id: "repwise",
    counter: "SYSTEM_002",
    title: "REPWISE",
    status: "LIVE",
    description: "AI-architected workout tracker. 80% of application code generated via agentic SDLC loops. Zero-touch deployment with automated PR generation.",
    tags: ["NEXT.JS", "TYPESCRIPT", "SUPABASE", "VERCEL"],
    visualization: <MetricBar label="80% AGENTIC PR GENERATION" percentage={80} />,
    expandedDetails: {
      bullets: [
        "Utilized agentic AI workflows for architectural planning and automated code generation.",
        "Designed a unified TypeScript architecture sharing types across Supabase and Next.js UI.",
        "Automated PR reviews and bug fixes using agentic feedback loops.",
        "Maintained zero-downtime schema evolution and RFC-style PR documentation."
      ],
      techTags: ["NEXT.JS", "TYPESCRIPT", "SUPABASE", "TAILWIND", "VERCEL CI/CD"],
      watermark: "AGENTIC_SDLC"
    }
  },
  {
    id: "gita-reader",
    counter: "SYSTEM_003",
    title: "GITA READER",
    status: "ACTIVE",
    description: "Offline-first mobile system. Python + OCR pipeline to sanitize legacy PDF translations. FTS5 full-text search for zero-latency queries.",
    tags: ["REACT NATIVE", "SQLITE", "PYTHON", "OCR"],
    visualization: <MetricBar label="700+ RECORDS · ZERO LATENCY FTS5" percentage={95} color="var(--brass)" />,
    expandedDetails: {
      bullets: [
        "Architected offline React Native application with decoupled SQLite schema using Drizzle ORM.",
        "Engineered Python + OCR pipeline to extract and sanitize legacy PDF translations.",
        "Implemented FTS5 full-text search for instantaneous queries across 700+ records.",
        "Built advanced UI features including gesture handling and dynamic rendering."
      ],
      techTags: ["REACT NATIVE", "SQLITE", "DRIZZLE ORM", "PYTHON", "OCR"],
      watermark: "OFFLINE_FIRST"
    }
  },
  {
    id: "agentic-sys",
    counter: "SYSTEM_004",
    title: "AGENTIC SYS.",
    status: "ACTIVE",
    description: "Multi-agent Node.js orchestration. Promise.all fan-out/fan-in patterns for parallel reasoning and task execution.",
    tags: ["NODE.JS", "TYPESCRIPT", "GROQ", "LLM"],
    visualization: <FanOut />,
    expandedDetails: {
      bullets: [
        "Architected multi-agent Node.js system with handoff and parallel fan-out/fan-in execution patterns.",
        "Implemented concurrent task execution using Promise.all and response aggregation.",
        "Strict type-safe protocols for agent communication and state management.",
        "Optimized for high-concurrency tool-calling across multiple LLM providers."
      ],
      techTags: ["NODE.JS", "TYPESCRIPT", "GROQ", "DOCKER", "REDIS"],
      watermark: "PARALLEL_REASONING"
    }
  },
  {
    id: "uhc-store",
    counter: "PROD_001",
    title: "UHC STORE & ADMIN",
    status: "LIVE",
    description: "Greenfield development of enterprise e-commerce UI and internal admin portal built from scratch. Serving 100K+ monthly sessions.",
    tags: ["NEXT.JS", "REDUX", "TYPESCRIPT", "UI/UX"],
    visualization: <MetricBar label="SCRATCH-BUILT STOREFRONT & ADMIN" percentage={100} color="var(--signal)" />,
    expandedDetails: {
      bullets: [
        "Built the UnitedHealthCare e-commerce storefront UI from the ground up using Next.js and Redux.",
        "Architected and developed a greenfield internal Admin Application for store and inventory management.",
        "Optimized Core Web Vitals to ensure high performance for 100K+ monthly sessions.",
        "Maintained 95%+ unit test coverage across all critical UI components."
      ],
      techTags: ["NEXT.JS", "REACT", "REDUX TOOLKIT", "JEST", "TAILWIND"],
      watermark: "GREENFIELD_UI"
    }
  },
  {
    id: "uhc-canary",
    counter: "PROD_002",
    title: "CANARY PIPELINE",
    status: "LIVE",
    description: "Engineered high-safety release infrastructure for automated canary deployments. Phased traffic shifting for critical health-tech systems.",
    tags: ["AWS", "CI/CD", "JENKINS", "GHA"],
    visualization: <MetricBar label="40% RISK REDUCTION · PHASED ROLLOUT" percentage={75} color="var(--ice)" />,
    expandedDetails: {
      bullets: [
        "Engineered the canary deployment pipeline to enable gradual production rollouts.",
        "Reduced critical release risks by 40% through automated health-check gates.",
        "Implemented automated rollback logic for failed production deployments.",
        "Streamlined the release cycle for multi-team deployments across UHC microservices."
      ],
      techTags: ["AWS CODEPIPELINE", "GITHUB ACTIONS", "JENKINS", "DOCKER", "KUBERNETES"],
      watermark: "RELEASE_STABILITY"
    }
  },
  {
    id: "wci-backend",
    counter: "PROD_003",
    title: "WCI BACKEND APIs",
    status: "REGULATED",
    description: "Greenfield API development for Carbon Emissions Cap-and-Trade. Programmatically enforced 10% annual corporate carbon cap reduction.",
    tags: ["NODE.JS", "POSTGRESQL", "SQL", "TRANSACTIONS"],
    visualization: <FanOut />,
    expandedDetails: {
      bullets: [
        "Developed core allocation APIs for the Carbon Emissions Cap-and-Trade system.",
        "Programmatically enforced a 10% annual reduction in corporate carbon caps.",
        "Implemented complex regulatory logic using PostgreSQL transactions for strict audit compliance.",
        "Engineered high-throughput endpoints for regulated environmental logic."
      ],
      techTags: ["NODE.JS", "POSTGRESQL", "EXPRESS", "SEQUELIZE", "AWS EC2"],
      watermark: "REGULATORY_BACKEND"
    }
  },
  {
    id: "wci-migration",
    counter: "PROD_004",
    title: "WCI DB MIGRATION",
    status: "REGULATED",
    description: "Legacy Python/DynamoDB → Node.js/PostgreSQL migration for regulated carbon cap-and-trade systems. Achieved zero-downtime cutover with 100% data consistency.",
    tags: ["DYNAMODB", "POSTGRESQL", "NODE.JS", "PYTHON"],
    visualization: <MigrationFlow />,
    fullWidth: true,
    expandedDetails: {
      bullets: [
        "Drove modernization of business-critical microservices (Users, Privilege Mgmt, Action Logging).",
        "Re-architected data flow from NoSQL (DynamoDB) to strictly-typed SQL (PostgreSQL).",
        "Wrote complex transformation scripts ensuring 100% data consistency during cutover.",
        "Achieved zero-downtime migration for regulated carbon trading infrastructure."
      ],
      techTags: ["NODE.JS", "POSTGRESQL", "PYTHON", "AWS RDS", "DYNAMODB", "SEQUELIZE"],
      watermark: "DATA_MODERNIZATION"
    }
  }
];
