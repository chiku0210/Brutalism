"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioProvider";
import { Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavTickProps {
    link: { name: string; href: string };
    index: number;
    isActive: boolean;
    onNavigate: (href: string) => void;
    rotation: number;
}

const DialTick = ({ link, index, isActive, onNavigate, rotation }: NavTickProps) => {
    const { playSound } = useAudio();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div 
            onMouseEnter={() => {
                setIsHovered(true);
                playSound("solenoid");
            }}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onNavigate(link.href)}
            style={{ 
                position: 'absolute',
                right: '10px',
                top: '50%',
                width: '220px', 
                height: '1px', // Exact 1px height for rotation precision
                transformOrigin: 'left center', 
                transform: `translateY(-50%) rotate(${rotation}deg)`,
                zIndex: isHovered || isActive ? 10 : 1,
                pointerEvents: 'auto',
                cursor: 'pointer'
            }}
        >
            {/* Label - Positioned relative to the 1px center line */}
            <motion.div 
                initial={false}
                animate={{ 
                    opacity: isHovered || isActive ? 1 : 0.4,
                    x: isHovered ? 4 : 0,
                    color: isHovered || isActive ? 'var(--brass)' : 'var(--muted)'
                }}
                style={{
                    position: 'absolute',
                    right: '48px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    width: '80px',
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                    lineHeight: '1'
                }}
            >
                {`0${index + 1}`}
            </motion.div>
            
            {/* The Tick Line */}
            <motion.div
                style={{ 
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    height: '1px',
                    backgroundColor: isActive ? "var(--brass)" : "var(--border)",
                }}
                animate={{ 
                    width: isHovered ? 40 : isActive ? 24 : 12,
                    backgroundColor: isHovered || isActive ? "var(--brass)" : "var(--border2)",
                    boxShadow: isHovered || isActive ? "0 0 15px var(--brass)" : "none",
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            />

            {/* Expanded Hit Area for UX */}
            <div style={{
                position: 'absolute',
                inset: '-10px 0',
                zIndex: -1
            }} />
        </motion.div>
    );
};

export const Nav = () => {
  const { isMuted, setIsMuted, playSound } = useAudio();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Engine", href: "/engine" },
    { name: "Blueprint", href: "/blueprint" },
  ];

  if (pathname === "/") return null;

  // Dial rotation logic: 
  // Home: 30deg (Home is top)
  // Engine: 0deg (Engine is centered)
  // Blueprint: -30deg (Blueprint is bottom)
  const dialRotation = pathname.startsWith("/engine") ? 0 : pathname.startsWith("/blueprint") ? -30 : 30;

  const nextModule = pathname.startsWith("/engine") 
    ? { name: "Blueprint", label: "PROCEED_TO", href: "/blueprint", direction: "forward" } 
    : pathname.startsWith("/blueprint") 
    ? { name: "Engine", label: "GO_BACK_TO", href: "/engine", direction: "backward" } 
    : null;

  return (
    <>
      <nav 
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 90,
            transition: 'all 0.5s ease',
            padding: '14px var(--page-padding)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: isScrolled ? '1px solid var(--border)' : '1px solid transparent',
            backgroundColor: isScrolled ? 'rgba(6, 6, 8, 0.96)' : 'transparent',
            backdropFilter: isScrolled ? 'blur(12px)' : 'none'
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                color: 'var(--brass)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
            }}>
            NIELLESS ACHARYA
            </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button
              onMouseEnter={() => playSound("solenoid")}
              style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--brass-dim)',
                  padding: '4px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--brass)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
              }}
            >
              [Contact]
            </button>

            <button 
              onClick={() => {
                  setIsMuted(!isMuted);
                  if (isMuted) playSound("solenoid");
              }}
              onMouseEnter={() => playSound("solenoid")}
              style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
              }}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Left-edge Vintage Camera Dial */}
      <div style={{
          position: 'fixed',
          left: '-230px', // Half of a 460px circle
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 100,
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          border: '1px solid var(--border)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(10, 10, 12, 0.2)',
          boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.5)'
      }} className="hidden lg:flex">
          <motion.div 
            animate={{ rotate: dialRotation }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                borderRadius: '50%',
                border: '4px double var(--grid)',
            }}
          >
              {/* Dial Ticks */}
              {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  // Ticks are at -30, 0, 30 degrees relative to horizontal
                  const tickRotation = (i - 1) * 30; 
                  return (
                      <DialTick 
                        key={i}
                        link={link}
                        index={i}
                        isActive={isActive}
                        rotation={tickRotation}
                        onNavigate={(href) => {
                            playSound("thud");
                            router.push(href);
                        }}
                      />
                  );
              })}
          </motion.div>
          
          {/* Static Center Marker Line */}
          <div style={{
              position: 'absolute',
              right: '-10px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '1px',
              backgroundColor: 'var(--brass)',
              boxShadow: '0 0 10px var(--brass)',
              zIndex: 110
          }} />
      </div>

      {/* Right-edge Proceed Indicator */}
      <AnimatePresence>
        {nextModule && (
            <div style={{
                position: 'fixed',
                right: '32px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 90,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                userSelect: 'none'
            }} className="hidden lg:flex">
                <Link href={nextModule.href} style={{ textDecoration: 'none' }}>
                    <motion.div 
                        onMouseEnter={() => playSound("solenoid")}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        whileHover="hover"
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '16px',
                            cursor: 'pointer',
                            padding: '10px 0',
                            position: 'relative',
                            flexDirection: nextModule.direction === "backward" ? "row-reverse" : "row"
                        }}
                    >
                        <motion.div
                            style={{ 
                                height: '1px',
                                width: '36px',
                                backgroundColor: "var(--border)",
                            }}
                            variants={{
                                hover: { 
                                    width: 48, 
                                    backgroundColor: "var(--brass)",
                                    boxShadow: "0 0 15px var(--brass)"
                                }
                            }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: nextModule.direction === "backward" ? "row-reverse" : "row" }}>
                            <div style={{ textAlign: nextModule.direction === "backward" ? 'left' : 'right' }}>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                    {nextModule.label}
                                </div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--brass)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {nextModule.name}
                                </div>
                            </div>
                            <motion.div 
                                variants={{
                                    hover: { x: nextModule.direction === "backward" ? -4 : 4, color: 'var(--brass-bright)' }
                                }}
                                style={{ 
                                    color: 'var(--brass)', 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    transform: nextModule.direction === "backward" ? 'rotate(180deg)' : 'none'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12H19M19 12L13 6M19 12L13 18" strokeLinecap="square" strokeLinejoin="miter"/>
                                </svg>
                            </motion.div>
                        </div>
                    </motion.div>
                </Link>
            </div>
        )}
      </AnimatePresence>
    </>
  );
};
