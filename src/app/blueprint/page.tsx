"use client";

import React from "react";
import { motion } from "framer-motion";
import { TimelineEntry, StackSnapshot } from "@/components/Timeline";
import Link from "next/link";
import { useAudio } from "@/components/AudioProvider";

export default function BlueprintPage() {
  const { playSound } = useAudio();

  return (
    <main id="main" style={{ backgroundColor: 'var(--void)', minHeight: '100vh' }}>
      <motion.section
        id="blueprint"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          padding: '120px var(--page-padding) 80px',
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <div className="section-label">[03] THE BLUEPRINT</div>
          <h2 className="section-title">DEPLOYMENT HISTORY</h2>
        </div>

        {/* Contact sheet — film strip with DoF recession */}
        <div
          role="list"
          style={{ borderLeft: '1px solid var(--border)', paddingLeft: '20px', marginLeft: '10px' }}
        >
          <TimelineEntry
            depth="frame-near"
            timestamp="NOW — ACTIVE"
            title="PRODUCT ENGINEERING MODE"
            description="Building AI-native systems with full ownership. Exiting the consultancy model. Targeting international remote product roles."
          />
          <TimelineEntry
            depth="frame-mid"
            timestamp="JUL 2022 — PRESENT"
            title="PUBLICIS SAPIENT — SDE (3.5 YOE)"
            description="Full-Stack Software Engineer. Node.js / PostgreSQL. UHC e-commerce engine — 100K+ sessions/month, canary pipeline, LSA/HSA payments. WCI carbon cap-and-trade APIs — 10% annual cap enforcement via PostgreSQL transactions. Zero-downtime migration from DynamoDB."
          />
          <TimelineEntry
            depth="frame-far"
            timestamp="FEB 2022 — JUN 2022"
            title="PAYPAL INDIA — INTERN"
            description="Rapid Emerging Markets Team. Interoperability Dashboard. REST APIs + React. First exposure to production-scale distributed payments."
          />
          <TimelineEntry
            depth="frame-past"
            timestamp="2018 — 2022"
            title="BITS PILANI — B.E. CS"
            description="Hyderabad Campus. The foundation."
          />
        </div>

        <StackSnapshot />

        {/* Navigation to contact */}
        <div style={{ marginTop: '80px', borderTop: '1px solid var(--grid)', paddingTop: '60px', display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="/contact" style={{ textDecoration: 'none' }}>
            <motion.div
              onMouseEnter={() => playSound('solenoid')}
              whileHover="hover"
              style={{ display: 'flex', alignItems: 'center', gap: '24px', cursor: 'pointer', padding: '12px' }}
            >
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted2)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>SYSTEM_PROCEED_TO</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--brass)', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1 }}>CONTACT</div>
              </div>
              <motion.div
                variants={{ hover: { x: 10, borderColor: 'var(--brass-bright)' } }}
                style={{ width: '64px', height: '64px', borderRadius: '50%', border: '1px solid var(--brass-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" strokeLinecap="square" strokeLinejoin="miter" />
                </svg>
              </motion.div>
            </motion.div>
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
