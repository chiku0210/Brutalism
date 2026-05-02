"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAudio } from "./AudioProvider";

interface AnalogPanelProps {
    title: string;
    labelColor: string;
    borderColor: string;
    description: string;
    hint: string;
    soundType: "harmonium" | "shutter" | "diesel";
    visualization: React.ReactNode;
}

export const AnalogPanel: React.FC<AnalogPanelProps> = ({
    title,
    labelColor,
    borderColor,
    description,
    hint,
    soundType,
    visualization
}) => {
    const { playSound } = useAudio();

    return (
        <motion.div
            onMouseEnter={() => playSound(soundType)}
            style={{
                backgroundColor: 'var(--surface)',
                padding: '20px',
                borderTop: `2px solid ${borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                height: '100%'
            }}
            whileHover={{ backgroundColor: 'var(--surface2)' }}
            className="group"
        >
            <div>
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '0.12em',
                    marginBottom: '12px',
                    color: labelColor,
                    textTransform: 'uppercase'
                }}>
                    {title}
                </div>
                <div style={{ marginBottom: '14px' }}>
                    {visualization}
                </div>
            </div>
            <div>
                <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '13px',
                    fontStyle: 'italic',
                    color: 'var(--muted)',
                    lineHeight: 1.6
                }}>
                    {description}
                </p>
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '8px',
                    color: 'var(--border2)',
                    marginTop: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                }}>
                    {hint}
                </div>
            </div>
        </motion.div>
    );
};

export const AudiophileVisual = () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '40px' }}>
        {[0.4, 0.6, 1, 0.9, 0.7, 0.5, 0.8, 0.6].map((h, i) => (
            <motion.div
                key={i}
                style={{ width: '7px', backgroundColor: 'var(--brass)', borderRadius: '1px' }}
                animate={{ height: [`${h * 14}px`, `${h * 40}px`, `${h * 20}px`] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1, ease: "easeInOut" }}
            />
        ))}
    </div>
);

export const LensVisual = () => (
    <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        border: '2px solid var(--border2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    }}>
        <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            border: '1px solid var(--muted2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--void)', border: '1px solid var(--border)' }} />
        </div>
    </div>
);

export const DieselVisual = () => (
    <div style={{ marginBottom: '6px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ fontSize: '8px', color: 'var(--border2)' }}>0</span>
            <span style={{ fontSize: '8px', color: 'var(--hot)' }}>4500 RPM</span>
        </div>
        <div style={{ height: '5px', backgroundColor: 'var(--surface2)', border: '1px solid var(--border)', position: 'relative' }}>
            <motion.div 
                style={{ height: '100%', backgroundColor: 'var(--hot)', opacity: 0.85 }}
                animate={{ width: ["65%", "68%", "65%"] }}
                transition={{ repeat: Infinity, duration: 0.1 }}
            />
        </div>
    </div>
);
