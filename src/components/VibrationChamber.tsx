"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioProvider";

const Oscilloscope = ({ mode }: { mode: "idle" | "harmonium" | "diesel" | "shutter" }) => {
    return (
        <div style={{
            height: '200px',
            width: '100%',
            backgroundColor: '#050505',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* CRT Grid Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: 0.2,
                pointerEvents: 'none'
            }} />

            <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
                <motion.path
                    d={mode === "diesel" 
                        ? "M 0 100 Q 20 20 40 100 Q 60 180 80 100 T 160 100 T 240 100 T 320 100 T 400 100 T 480 100 T 560 100 T 640 100 T 720 100 T 800 100"
                        : mode === "harmonium"
                        ? "M 0 100 C 50 100, 50 50, 100 50 C 150 50, 150 150, 200 150 C 250 150, 250 100, 300 100 S 350 50, 400 50 S 450 150, 500 150 S 550 100, 600 100 S 650 50, 700 50 S 750 150, 800 150"
                        : "M 0 100 L 800 100"
                    }
                    fill="none"
                    stroke={mode === "diesel" ? "var(--hot)" : mode === "harmonium" ? "var(--brass)" : mode === "shutter" ? "var(--dust)" : "var(--muted2)"}
                    strokeWidth="2"
                    animate={mode === "diesel" 
                        ? { d: [
                            "M 0 102 Q 20 22 40 102 Q 60 182 80 102 T 160 102 T 240 102 T 320 102 T 400 102 T 480 102 T 560 102 T 640 102 T 720 102 T 800 102",
                            "M 0 98 Q 20 18 40 98 Q 60 178 80 98 T 160 98 T 240 98 T 320 98 T 400 98 T 480 98 T 560 98 T 640 98 T 720 98 T 800 98",
                            "M 0 102 Q 20 22 40 102 Q 60 182 80 102 T 160 102 T 240 102 T 320 102 T 400 102 T 480 102 T 560 102 T 640 102 T 720 102 T 800 102"
                          ] }
                        : mode === "harmonium"
                        ? { d: [
                            "M 0 100 C 50 100, 50 40, 100 40 C 150 40, 150 160, 200 160 C 250 160, 250 100, 300 100 S 350 40, 400 40 S 450 160, 500 160 S 550 100, 600 100 S 650 40, 700 40 S 750 160, 800 160",
                            "M 0 100 C 50 100, 50 60, 100 60 C 150 60, 150 140, 200 140 C 250 140, 250 100, 300 100 S 350 60, 400 60 S 450 140, 500 140 S 550 100, 600 100 S 650 60, 700 60 S 750 140, 800 140",
                            "M 0 100 C 50 100, 50 40, 100 40 C 150 40, 150 160, 200 160 C 250 160, 250 100, 300 100 S 350 40, 400 40 S 450 160, 500 160 S 550 100, 600 100 S 650 40, 700 40 S 750 160, 800 160"
                          ] }
                        : {}
                    }
                    transition={{ repeat: Infinity, duration: mode === "diesel" ? 0.05 : 2, ease: "linear" }}
                />
                
                {mode === "shutter" && (
                    <motion.rect
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.1 }}
                        width="800"
                        height="200"
                        fill="white"
                    />
                )}
            </svg>

            {/* CRT Scanline Effect */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 4px, 3px 100%',
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export const VibrationChamber = () => {
    const { playSound } = useAudio();
    const [activeMode, setActiveMode] = useState<"idle" | "harmonium" | "diesel" | "shutter">("idle");

    const modes = [
        { 
            id: "harmonium", 
            label: "Audiophile", 
            desc: "Raag Bhairav Alankars. Bina No. 8. The vibration of the reed.",
            sound: "harmonium" 
        },
        { 
            id: "diesel", 
            label: "Diesel Head", 
            desc: "Ford EcoSport. Mechanical grunt. Raw engineering over simulation.",
            sound: "diesel" 
        },
        { 
            id: "shutter", 
            label: "The Lens", 
            desc: "Strictly DSLR. The heavy mechanical snap of the mirror box.",
            sound: "shutter" 
        }
    ];

    return (
        <section id="vibration-chamber" style={{
            maxWidth: 'var(--max-width)',
            margin: '0 auto',
            padding: '120px var(--page-padding)',
            borderTop: '1px solid var(--grid)'
        }}>
            <div style={{ marginBottom: '48px' }}>
                <div className="section-label">[05] THE VIBRATION CHAMBER</div>
                <h2 className="section-title">Harmonic Resonance & Mechanical Grunt</h2>
                <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '16px',
                    fontStyle: 'italic',
                    color: 'var(--muted)',
                    maxWidth: '600px',
                    lineHeight: 1.8
                }}>
                    The machine is not just code. It is physical. It vibrates. It hums. This is an invitation to feel the frequency of the builder.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '40px',
                alignItems: 'start'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {modes.map((mode) => (
                        <button
                            key={mode.id}
                            onMouseEnter={() => {
                                setActiveMode(mode.id as any);
                                playSound(mode.sound as any);
                            }}
                            onMouseLeave={() => setActiveMode("idle")}
                            style={{
                                textAlign: 'left',
                                backgroundColor: activeMode === mode.id ? 'var(--surface2)' : 'var(--surface)',
                                border: `1px solid ${activeMode === mode.id ? 'var(--brass)' : 'var(--border)'}`,
                                padding: '24px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                color: activeMode === mode.id ? 'var(--brass)' : 'var(--muted2)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.2em',
                                marginBottom: '12px'
                            }}>
                                {mode.label}
                            </div>
                            <div style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '24px',
                                color: activeMode === mode.id ? 'var(--dust)' : 'var(--muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {mode.id}
                            </div>
                            <AnimatePresence>
                                {activeMode === mode.id && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '11px',
                                            color: 'var(--muted)',
                                            marginTop: '16px',
                                            lineHeight: 1.6
                                        }}
                                    >
                                        {mode.desc}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </button>
                    ))}
                </div>

                <div style={{ position: 'sticky', top: '120px' }}>
                    <Oscilloscope mode={activeMode} />
                    <div style={{
                        marginTop: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        color: 'var(--border2)',
                        textTransform: 'uppercase'
                    }}>
                        <span>Frequency: {activeMode === "diesel" ? "45Hz" : activeMode === "harmonium" ? "261.63Hz" : "0Hz"}</span>
                        <span>State: {activeMode.toUpperCase()}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
