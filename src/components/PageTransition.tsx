"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isWiping, setIsWiping] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    if (pathname !== "/") {
        // Trigger wipe when navigating between content pages
        setIsWiping(true);
        const timer = setTimeout(() => {
            setDisplayChildren(children);
            setIsWiping(false);
        }, 400);
        return () => clearTimeout(timer);
    } else {
        setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {displayChildren}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isWiping && (
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 1, originX: 1, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.7, 0, 0.3, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "var(--brass)",
              zIndex: 1000,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
