"use client";

import React from "react";
import { useAudio } from "./AudioProvider";

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const Footer = () => {
    const { playSound } = useAudio();
    const buildDate = new Date().toISOString().split('T')[0].replace(/-/g, '.');

    return (
        <footer style={{
            maxWidth: 'var(--max-width)',
            margin: '0 auto',
            padding: '32px var(--page-padding)',
            borderTop: '1px solid var(--border)',
            marginTop: '80px'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
            }}>
                <div style={{
                    fontSize: '11px',
                    color: 'var(--brass)',
                    letterSpacing: '0.15em',
                    fontFamily: 'var(--font-display)',
                    textTransform: 'uppercase'
                }}>
                    NIELLESS ACHARYA :: NIELLESS.COM
                </div>
                
                <div style={{
                    fontSize: '9px',
                    color: 'var(--border2)',
                    letterSpacing: '0.08em',
                    fontFamily: 'var(--font-mono)'
                }}>
                    BUILD {buildDate}
                </div>
                
                <div style={{ display: 'flex', gap: '14px' }}>
                    <a 
                        href="https://github.com/nielless" 
                        target="_blank" 
                        onMouseEnter={() => playSound("solenoid")}
                        style={{ color: 'var(--muted)', transition: 'color 0.15s' }}
                        onMouseOver={(e) => (e.currentTarget.style.color = 'var(--brass)')}
                        onMouseOut={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                    >
                        <GithubIcon size={16} />
                    </a>
                    <a 
                        href="https://linkedin.com/in/nielless" 
                        target="_blank" 
                        onMouseEnter={() => playSound("solenoid")}
                        style={{ color: 'var(--muted)', transition: 'color 0.15s' }}
                        onMouseOver={(e) => (e.currentTarget.style.color = 'var(--brass)')}
                        onMouseOut={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                    >
                        <LinkedinIcon size={16} />
                    </a>
                </div>
            </div>
            
            <div style={{
                textAlign: 'center',
                borderTop: '1px solid var(--grid)',
                paddingTop: '14px'
            }}>
                <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '15px',
                    fontStyle: 'italic',
                    color: 'var(--muted)'
                }}>
                    "Build until it holds."
                </p>
            </div>
        </footer>
    );
};
