"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const CustomCursor = () => {
  const [cursorType, setCursorType] = useState<"default" | "hover" | "text" | "void">("default");
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = target.closest("a, button, [role='button'], .interactive");
      const isText = target.closest("p, span, h1, h2, h3, h4, h5, h6, li, blockquote, pre, code");

      if (isInteractive) {
        setCursorType("hover");
      } else if (isText) {
        setCursorType("text");
      } else {
        // Check if it's "void" (background)
        const isVoid = target.tagName === "BODY" || target.id === "root-container" || target.classList.contains("void-bg");
        setCursorType(isVoid ? "void" : "default");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const checkTouch = () => setIsTouch(true);
    window.addEventListener("touchstart", checkTouch);
    return () => window.removeEventListener("touchstart", checkTouch);
  }, []);

  if (isTouch || !isVisible) return null;

  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: "rgba(200, 169, 110, 0)",
      border: "1px solid var(--brass-dim)",
      borderRadius: "50%",
    },
    hover: {
      width: 24,
      height: 24,
      backgroundColor: "rgba(200, 169, 110, 1)",
      border: "1px solid var(--brass)",
      borderRadius: "50%",
    },
    text: {
      width: 2,
      height: 18,
      backgroundColor: "rgba(200, 169, 110, 1)",
      border: "none",
      borderRadius: "0%",
    },
    void: {
      width: 12,
      height: 12,
      backgroundColor: "rgba(200, 169, 110, 0)",
      border: "1px solid var(--border)",
      borderRadius: "50%",
    }
  };

  return (
    <motion.div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
      initial="default"
      animate={{
        ...variants[cursorType],
        scale: isClicked ? 1.4 : 1,
      }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 300,
        mass: 0.5,
      }}
    />
  );
};
