"use client";

import React, { useState, useEffect } from "react";
import { HeroBoot } from "@/components/HeroBoot";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <main style={{ position: 'relative' }}>
        <HeroBoot onCompile={() => router.push('/engine')} />
    </main>
  );
}
