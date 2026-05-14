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
}

const NavTick = ({ link, index, isActive, onNavigate }: NavTickProps) => {
  const { playSound } = useAudio();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => { setIsHovered(true); playSound("solenoid"); }}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => playSound("solenoid")}
      onClick={() => onNavigate(link.href)}
      whileHover={{ x: 8 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        cursor: 'pointer', padding: '10px 0', position: 'relative',
        zIndex: isHovered || isActive ? 10 : 1, pointerEvents: 'auto'
      }}
    >
      <motion.div
        initial={false}
        animate={{
          opacity: isHovered || isActive ? 1 : 0.4,
          x: isHovered ? 4 : 0,
          color: isHovered || isActive ? 'var(--brass)' : 'var(--muted2)'
        }}
        style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase',
          letterSpacing: '0.12em', width: '80px', textAlign: 'right', whiteSpace: 'nowrap'
        }}
      >
        {isHovered || isActive ? link.name : `0${index + 1}`}
      </motion.div>

      <motion.div
        style={{ height: '1px', backgroundColor: isActive ? "var(--brass)" : "var(--border)" }}
        animate={{
          width: isHovered ? 48 : isActive ? 36 : 12,
          backgroundColor: isHovered || isActive ? "var(--brass)" : "var(--border)",
          boxShadow: isHovered || isActive ? "0 0 15px var(--brass)" : "none",
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />

      {isHovered && (
        <motion.div
          layoutId="focus-ring"
          style={{
            position: 'absolute', right: '-10px',
            width: '4px', height: '4px', borderRadius: '50%',
            backgroundColor: 'var(--brass)', boxShadow: '0 0 10px var(--brass)'
          }}
        />
      )}
    </motion.div>
  );
};

export const Nav = () => {
  const { isMuted, setIsMuted, playSound } = useAudio();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home",      href: "/" },
    { name: "Engine",    href: "/engine" },
    { name: "Blueprint", href: "/blueprint" },
    { name: "Contact",   href: "/contact" },
  ];

  if (pathname === "/") return null;

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 90,
          transition: 'all 0.5s ease',
          padding: '14px var(--page-padding)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: isScrolled ? '1px solid var(--border)' : '1px solid transparent',
          backgroundColor: isScrolled ? 'rgba(6, 6, 8, 0.96)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none'
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px', color: 'var(--brass)',
            letterSpacing: '0.1em', textTransform: 'uppercase'
          }}>
            NIELLESS ACHARYA
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden md:flex">
            {navLinks.slice(1).map(link => (
              <Link
                key={link.name}
                href={link.href}
                onMouseEnter={() => playSound('solenoid')}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: pathname === link.href ? 'var(--brass)' : 'var(--muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transition: 'color 0.15s',
                  textDecoration: 'none',
                  /* Active brass underline per spec */
                  borderBottom: pathname === link.href ? '1px solid var(--brass)' : '1px solid transparent',
                  paddingBottom: '2px'
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link
              href="/contact"
              onMouseEnter={() => playSound('solenoid')}
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
                transition: 'all 0.15s ease',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              [Contact]
            </Link>

            <button
              onClick={() => { setIsMuted(!isMuted); if (isMuted) playSound('solenoid'); }}
              onMouseEnter={() => playSound('solenoid')}
              style={{
                background: 'none', border: 'none',
                color: 'var(--muted)', cursor: 'pointer',
                padding: '4px', display: 'flex', alignItems: 'center'
              }}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Left-edge ticks — hidden when aperture ring is visible */}
      <div style={{
        position: 'fixed', left: '92px', top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 90,
        display: 'flex', flexDirection: 'column', gap: '12px',
        padding: '40px 20px', userSelect: 'none'
      }} className="hidden lg:flex">
        {navLinks.map((link, i) => (
          <NavTick
            key={i} link={link} index={i}
            isActive={pathname === link.href}
            onNavigate={href => router.push(href)}
          />
        ))}
      </div>
    </>
  );
};
