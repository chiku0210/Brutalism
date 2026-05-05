"use client";

import React from "react";
import { motion } from "framer-motion";
import { TimelineEntry, StackSnapshot } from "@/components/Timeline";
import Link from "next/link";
import { useAudio } from "@/components/AudioProvider";

export default function BlueprintPage() {
  const { playSound } = useAudio();
  return (
    <main style={{ backgroundColor: 'var(--void)', minHeight: '100vh' }}>
      <motion.section 
          id="blueprint" 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          style={{
              maxWidth: 'var(--max-width)',
              margin: '0 auto',
              padding: '60px var(--page-padding) 80px',
          }}
      >
          <div style={{ marginBottom: '32px' }}>
              <div className="section-label">[03] THE BLUEPRINT</div>
              <h2 className="section-title">DEPLOYMENT HISTORY</h2>
          </div>
          
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '28px', marginLeft: '10px' }}>
              <TimelineEntry 
                  status="active"
                  timestamp="JUL 2022 → PRESENT"
                  title="PUBLICIS SAPIENT — SDE"
                  description="Engineering lead for high-stakes projects across two major clients. [UHC]: Built enterprise e-commerce UI from scratch (Next.js/Redux), developed internal Admin Portal, and engineered automated canary pipelines. [WCI]: Executed DynamoDB-to-PostgreSQL migration and built greenfield backend APIs for regulated carbon trading systems with programmatic cap enforcement."
              />
              <TimelineEntry 
                  status="past"
                  timestamp="FEB 2022 → JUN 2022"
                  title="PAYPAL INDIA — SDE INTERN"
                  description="Rapid Emerging Markets Team. Built the Interoperability Dashboard for real-time visualization of merchant transaction failures. Developed REST APIs and interactive React visualizations to reduce time-to-debug for critical payment failures."
              />
              <TimelineEntry 
                  status="old"
                  timestamp="2018 → 2022"
                  title="BITS PILANI — B.E. CS"
                  description="Hyderabad Campus. Computer Science. The foundation. Explored systems engineering, distributed computing, and the rigorous logic of computer science."
              />

          </div>

          <StackSnapshot />
      </motion.section>
    </main>
  );
}
