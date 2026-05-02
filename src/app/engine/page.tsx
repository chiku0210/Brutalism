"use client";

import React from "react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { SchematicCard } from "@/components/SchematicCard";
import Link from "next/link";
import { useAudio } from "@/components/AudioProvider";

export default function EnginePage() {
  const { playSound } = useAudio();
  return (
    <main style={{ backgroundColor: 'var(--void)', minHeight: '100vh' }}>
      <motion.section 
          id="engine" 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          style={{
              maxWidth: 'var(--max-width)',
              margin: '0 auto',
              padding: '120px var(--page-padding) 80px',
          }}
      >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
              <div>
                  <div className="section-label">[02] THE ENGINE</div>
                  <h2 className="section-title">SYSTEM SCHEMATICS</h2>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--border2)', textAlign: 'right', lineHeight: 1.8, textTransform: 'uppercase' }}>
                  NIELLESS ACHARYA :: {projects.length} SYSTEMS<br />PRODUCTION GRADE
              </div>
          </div>
          
          <div className="project-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '14px' 
          }}>
              {projects.map((project) => (
                  <SchematicCard key={project.id} {...project} />
              ))}
          </div>

          <div style={{ marginTop: '120px', borderTop: '1px solid var(--grid)', paddingTop: '60px', display: 'flex', justifyContent: 'flex-end' }}>
              <Link href="/blueprint" style={{ textDecoration: 'none' }}>
                  <motion.div 
                    onMouseEnter={() => playSound("solenoid")}
                    whileHover="hover"
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '24px',
                        cursor: 'pointer',
                        padding: '12px'
                    }}
                  >
                      <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted2)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>SYSTEM_PROCEED_TO</div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--brass)', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1 }}>CAREER BLUEPRINT</div>
                      </div>
                      <motion.div 
                        variants={{
                            hover: { x: 10, borderColor: 'var(--brass-bright)' }
                        }}
                        style={{ 
                            width: '64px', 
                            height: '64px', 
                            borderRadius: '50%', 
                            border: '1px solid var(--brass-dim)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            transition: 'all 0.3s ease'
                        }}
                      >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M5 12H19M19 12L13 6M19 12L13 18" strokeLinecap="square" strokeLinejoin="miter"/>
                          </svg>
                      </motion.div>
                  </motion.div>
              </Link>
          </div>
      </motion.section>
    </main>
  );
}
