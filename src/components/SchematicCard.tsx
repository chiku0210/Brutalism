"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioProvider";
import { X } from "lucide-react";

interface SchematicCardProps {
  id: string;
  counter: string;
  title: string;
  status: "LIVE" | "REGULATED" | "ACTIVE" | string;
  description: string;
  tags: string[];
  visualization: React.ReactNode;
  expandedDetails?: {
    bullets: string[];
    techTags: string[];
    watermark?: string;
  };
  fullWidth?: boolean;
}

export const SchematicCard: React.FC<SchematicCardProps> = ({
  counter,
  title,
  status,
  description,
  tags,
  visualization,
  expandedDetails,
  fullWidth = false,
}) => {
  const { playSound } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInteraction = () => {
    playSound("thud");
    if (expandedDetails) setIsExpanded(true);
  };

  const isMigrationCard = title.includes("MIGRATION");

  return (
    <>
      <motion.div
        onClick={handleInteraction}
        onMouseEnter={() => playSound("solenoid")}
        whileHover={{ backgroundColor: "var(--surface2)", borderColor: "var(--brass)" }}
        style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            position: 'relative',
            gridColumn: fullWidth ? 'span 2' : 'auto'
        }}
      >
        {fullWidth && isMigrationCard ? (
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '32px',
                alignItems: 'start'
            }}>
                <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--brass)', letterSpacing: '0.12em', marginBottom: '4px' }}>{counter}</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', letterSpacing: '0.06em', color: 'var(--dust)', textTransform: 'uppercase' }}>{title}</h3>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--dust)', opacity: 0.8, lineHeight: 1.7, marginTop: '8px', marginBottom: '14px' }}>
                        {description}
                    </p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '3px 8px', border: '1px solid var(--hot)', color: 'var(--hot)', backgroundColor: 'rgba(255,77,26,0.06)' }}>REGULATED</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '3px 8px', border: '1px solid var(--border)', color: 'var(--muted2)' }}>ZERO DOWNTIME</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                        {tags.map((tag, i) => (
                            <React.Fragment key={i}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted2)', border: '1px solid var(--border)', padding: '2px 7px' }}>
                                    {tag}
                                </span>
                                {i < tags.length - 1 && <span style={{ fontSize: '9px', color: 'var(--brass)' }}>→</span>}
                            </React.Fragment>
                        ))}
                    </div>
                    {expandedDetails?.watermark && (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--border2)', letterSpacing: '0.1em', marginTop: '12px' }}>
                            @{expandedDetails.watermark}
                        </div>
                    )}
                </div>
                <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--brass)', letterSpacing: '0.1em', marginBottom: '14px', textTransform: 'uppercase' }}>Migration Schematic</div>
                    {visualization}
                    <div style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted2)', lineHeight: 2, textTransform: 'uppercase' }}>
                        3 MICROSERVICES MIGRATED<br />
                        PRIVILEGE MGMT + USERS + ACTION LOGGING<br />
                        STRICT AUDIT COMPLIANCE
                    </div>
                </div>
            </div>
        ) : (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--brass)', letterSpacing: '0.12em', marginBottom: '4px' }}>{counter}</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', letterSpacing: '0.06em', color: 'var(--dust)', textTransform: 'uppercase' }}>{title}</h3>
                </div>
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    padding: '3px 8px',
                    border: '1px solid',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                    color: status === 'LIVE' ? 'var(--signal)' : status === 'REGULATED' ? 'var(--hot)' : 'var(--muted2)',
                    borderColor: status === 'LIVE' ? '#1a4a1a' : status === 'REGULATED' ? '#4a1a10' : 'var(--border)',
                    backgroundColor: status === 'LIVE' ? 'rgba(57,255,20,0.06)' : status === 'REGULATED' ? 'rgba(255,77,26,0.06)' : 'transparent'
                }}>
                    {status}
                </div>
                </div>

                <div style={{ marginBottom: '14px', height: '32px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                    {visualization}
                </div>

                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--dust)', opacity: 0.8, lineHeight: 1.7, marginBottom: '14px' }}>
                    {description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                    {tags.map((tag, i) => (
                        <React.Fragment key={i}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted2)', border: '1px solid var(--border)', padding: '2px 7px' }}>
                                {tag}
                            </span>
                            {i < tags.length - 1 && <span style={{ fontSize: '9px', color: 'var(--brass)' }}>→</span>}
                        </React.Fragment>
                    ))}
                </div>
                
                {expandedDetails?.watermark && (
                    <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        color: 'var(--border2)',
                        letterSpacing: '0.1em',
                        marginTop: '12px',
                        textAlign: 'right'
                    }}>
                        @{expandedDetails.watermark}
                    </div>
                )}
            </>
        )}
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                backgroundColor: 'rgba(6, 6, 8, 0.98)',
                backdropFilter: 'blur(12px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  width: '100%',
                  maxWidth: '1000px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '48px',
                  position: 'relative'
              }}
            >
              <button 
                onClick={() => {
                    playSound("solenoid");
                    setIsExpanded(false);
                }}
                style={{
                    position: 'absolute',
                    top: '32px',
                    right: '32px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    padding: '8px'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brass)', letterSpacing: '0.25em', marginBottom: '16px' }}>{counter}</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', letterSpacing: '0.05em', color: 'var(--dust)', textTransform: 'uppercase', marginBottom: '48px' }}>{title}</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
                <div>
                    <section style={{ marginBottom: '48px' }}>
                        <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span>Key Decisions & Tradeoffs</span>
                            <div style={{ height: '1px', background: 'var(--grid)', flex: 1 }} />
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {expandedDetails?.bullets.map((bullet, i) => (
                                <li key={i} style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '16px', lineHeight: 1.8, marginBottom: '12px' }}>
                                    <span style={{ color: 'var(--brass)' }}>▸</span>
                                    <span>{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span>Full Stack Snapshot</span>
                            <div style={{ height: '1px', background: 'var(--grid)', flex: 1 }} />
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {expandedDetails?.techTags.map((tag, i) => (
                                <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--brass)', border: '1px solid var(--brass-dim)', padding: '6px 16px', backgroundColor: 'rgba(200, 169, 110, 0.05)' }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
                
                <div style={{ backgroundColor: 'var(--void)', border: '1px solid var(--border)', padding: '32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '32px' }}>System Architecture</div>
                    <div style={{ flex: 1, border: '1px dashed var(--grid)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted2)', textAlign: 'center', lineHeight: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            [ Architecture Schematic ]<br />
                            SVG Vector Layer<br />
                            v4.0.0
                        </div>
                    </div>
                    <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--grid)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--border2)' }}>STRICT_MODE: ON</div>
                        <button style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '9px',
                            color: 'var(--brass)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            border: '1px solid var(--brass-dim)',
                            padding: '4px 12px',
                            backgroundColor: 'transparent',
                            cursor: 'pointer'
                        }}>
                            View GitHub
                        </button>
                    </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
