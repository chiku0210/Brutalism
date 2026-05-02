"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

type SoundType = "solenoid" | "thud" | "shutter" | "harmonium" | "diesel";

interface AudioContextType {
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  playSound: (type: SoundType) => void;
  resumeContext: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (typeof window === "undefined") return null;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const resumeContext = async () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      await ctx.resume();
      console.log("AudioContext resumed. State:", ctx.state);
    }
  };

  const playSound = (type: SoundType) => {
    if (isMuted) return;

    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    switch (type) {
      case "solenoid": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(180, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }
      case "thud": {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.frequency.setValueAtTime(100, now);
        osc2.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.1);
        osc2.stop(now + 0.1);
        break;
      }
      case "shutter": {
        // DSLR Shutter: High transient + mechanical mechanical mirror thud
        const mirrorOsc = ctx.createOscillator();
        const mirrorGain = ctx.createGain();
        mirrorOsc.frequency.setValueAtTime(80, now);
        mirrorGain.gain.setValueAtTime(0.5, now);
        mirrorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = "square";
        clickOsc.frequency.setValueAtTime(2400, now);
        clickGain.gain.setValueAtTime(0.1, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        mirrorOsc.connect(mirrorGain); mirrorGain.connect(ctx.destination);
        clickOsc.connect(clickGain); clickGain.connect(ctx.destination);
        
        mirrorOsc.start(now); clickOsc.start(now);
        mirrorOsc.stop(now + 0.1); clickOsc.stop(now + 0.1);
        break;
      }
      case "harmonium": {
        // Bina No. 8 Harmonium (Raag Bhairav Sa - C4)
        // Layering harmonics for that rich reed texture
        const freq = 261.63; // C4
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(0.3, now + 0.05);
        masterGain.gain.linearRampToValueAtTime(0, now + 1.5);

        [1, 2.01, 3.02, 4, 6].forEach((h, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq * h, now);
          g.gain.setValueAtTime(0.1 / (i + 1), now);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(now);
          osc.stop(now + 1.5);
        });

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, now);
        masterGain.connect(filter);
        filter.connect(ctx.destination);
        break;
      }
      case "diesel": {
        // Diesel Idle: Low rumble + rhythmic tremolo
        const engineOsc = ctx.createOscillator();
        const engineGain = ctx.createGain();
        const tremor = ctx.createOscillator();
        const tremorGain = ctx.createGain();

        engineOsc.frequency.setValueAtTime(45, now);
        engineOsc.type = "triangle";
        
        tremor.frequency.setValueAtTime(6, now); // 6Hz idle pulse
        tremorGain.gain.setValueAtTime(0.4, now);
        tremor.connect(tremorGain);
        tremorGain.connect(engineGain.gain);

        engineGain.gain.setValueAtTime(0, now);
        engineGain.gain.linearRampToValueAtTime(0.4, now + 0.1);
        engineGain.gain.linearRampToValueAtTime(0, now + 2.0);

        engineOsc.connect(engineGain);
        engineGain.connect(ctx.destination);
        
        engineOsc.start(now); tremor.start(now);
        engineOsc.stop(now + 2.0); tremor.stop(now + 2.0);
        break;
      }
    }
  };

  return (
    <AudioContext.Provider value={{ isMuted, setIsMuted, playSound, resumeContext }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
