"use client";

import React from "react";
import { motion } from "framer-motion";

export const Waveform = () => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '28px' }}>
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        style={{ width: '3px', backgroundColor: 'var(--brass)', borderRadius: '1px', opacity: 0.7 }}
        animate={{ height: [8, 28, 12, 24, 8] }}
        transition={{ 
          repeat: Infinity, 
          duration: 1 + Math.random(), 
          delay: i * 0.05,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

export const MetricBar = ({ label, percentage, color = "var(--brass)" }: { label: string, percentage: number, color?: string }) => (
  <div style={{ width: '100%', marginBottom: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted2)', letterSpacing: '0.08em', marginBottom: '4px' }}>
      <span>{label}</span>
    </div>
    <div style={{ height: '4px', width: '100%', backgroundColor: 'var(--surface2)', border: '1px solid var(--border)', position: 'relative' }}>
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${percentage}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
        style={{ height: '100%', backgroundColor: color }} 
      />
    </div>
  </div>
);

export const FanOut = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--brass)' }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ height: '1px', width: '22px', backgroundColor: 'var(--border2)' }} />
          <div style={{ width: '8px', height: '8px', border: '1px solid var(--brass)' }} />
        </div>
      ))}
    </div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted2)', margin: '0 4px' }}>→</div>
    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--muted2)' }} />
  </div>
);

export const MigrationFlow = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 0', width: '100%' }}>
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted2)', letterSpacing: '0.06em' }}>PYTHON</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted2)', letterSpacing: '0.06em' }}>DYNAMODB</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--border2)', marginTop: '2px' }}>LEGACY</div>
    </div>
    
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--brass)', letterSpacing: '0.08em', marginBottom: '4px' }}>RE-ARCH</div>
        <div style={{ height: '1px', backgroundColor: 'var(--brass)', width: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', fontSize: '9px', color: 'var(--brass)' }}>▶</div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--signal)', marginTop: '2px', letterSpacing: '0.08em' }}>100% CONSISTENCY</div>
    </div>

    <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--dust)', letterSpacing: '0.06em' }}>NODE.JS</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--dust)', letterSpacing: '0.06em' }}>POSTGRESQL</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--signal)', marginTop: '2px' }}>PRODUCTION</div>
    </div>
  </div>
);
