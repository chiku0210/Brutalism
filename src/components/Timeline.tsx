"use client";

import React from "react";
import { motion } from "framer-motion";

interface TimelineEntryProps {
    status: "active" | "past" | "old";
    timestamp: string;
    title: string;
    description: string;
}

export const TimelineEntry: React.FC<TimelineEntryProps> = ({ status, timestamp, title, description }) => (
    <div style={{ position: 'relative', marginBottom: '28px' }}>
        <div style={{
            position: 'absolute',
            left: '-34px',
            top: '5px',
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            backgroundColor: status === 'active' ? 'var(--brass)' : status === 'past' ? 'var(--muted2)' : 'var(--border2)'
        }} />
        <div style={{
            fontSize: '9px',
            letterSpacing: '0.1em',
            marginBottom: '4px',
            textTransform: 'uppercase',
            color: status === 'active' ? 'var(--brass)' : status === 'past' ? 'var(--muted2)' : 'var(--border)'
        }}>
            {timestamp}
        </div>
        <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            letterSpacing: '0.05em',
            color: 'var(--dust)',
            textTransform: 'uppercase',
            marginBottom: '6px'
        }}>
            {title}
        </h3>
        <p style={{
            fontSize: '11px',
            color: 'var(--dust)',
            opacity: 0.8,
            lineHeight: 1.7,
            maxWidth: '600px'
        }}>
            {description}
        </p>
    </div>
);

export const StackSnapshot = () => {
    const stack = [
        { name: "NODE.JS", type: "backend" },
        { name: "TYPESCRIPT", type: "backend" },
        { name: "POSTGRESQL", type: "backend" },
        { name: "PYTHON", type: "backend" },
        { name: "C++", type: "backend" },
        { name: "AWS", type: "devops" },
        { name: "DOCKER", type: "devops" },
        { name: "KUBERNETES", type: "devops" },
        { name: "JENKINS", type: "devops" },
        { name: "GH ACTIONS", type: "devops" },
        { name: "DATADOG", type: "devops" },
        { name: "NEXT.JS", type: "frontend" },
        { name: "REDUX", type: "frontend" },
        { name: "[LLM AGENTS]", type: "ai" },
        { name: "[LLM ORCHESTRATION]", type: "ai" },
    ];

    return (
        <div style={{
            border: '1px solid var(--grid)',
            padding: '24px',
            backgroundColor: 'var(--surface)',
            marginTop: '40px'
        }}>
            <div style={{
                fontSize: '9px',
                color: 'var(--muted2)',
                letterSpacing: '0.1em',
                marginBottom: '16px',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase'
            }}>
                $ system --inspect --stack
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {stack.map((item, i) => (
                    <span 
                        key={i} 
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '9px',
                            padding: '4px 10px',
                            border: '1px solid',
                            color: item.type === 'ai' ? 'var(--brass)' : 
                                   item.type === 'backend' ? 'var(--dust)' : 
                                   item.type === 'devops' ? 'var(--ice)' : 'var(--muted)',
                            borderColor: item.type === 'ai' ? 'var(--brass-dim)' : 'var(--border)'
                        }}
                    >
                        {item.name}
                    </span>
                ))}
            </div>
        </div>
    );
};
