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
              padding: '60px var(--page-padding) 80px',
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
      </motion.section>
    </main>
  );
}
