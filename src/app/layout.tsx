import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/components/AudioProvider";
import { CustomCursor } from "@/components/CustomCursor";
import { PageTransition } from "@/components/PageTransition";
import { Nav } from "@/components/Nav";
import { ApertureRing } from "@/components/ApertureRing";
import { ExposureMeter } from "@/components/ExposureMeter";
import { WarpLayer, ViewfinderHUD } from "@/components/ViewfinderLanding";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NIELLESS ACHARYA \u2014 Full-Stack Engineer",
  description: "Full-Stack Engineer. AI-native builder. Backend-first. Systems that hold under load.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${bebasNeue.variable} ${jetbrainsMono.variable} ${crimsonPro.variable} antialiased`}
      >
        {/* Skip link — a11y */}
        <a href="#main" className="skip-link">Skip to content</a>

        <AudioProvider>
          {/* Always-sharp fixed layers — sit OUTSIDE the warp */}
          <CustomCursor />
          <ApertureRing />
          <ExposureMeter />

          {/*
            ViewfinderHUD — fixed crosshair + corner brackets.
            Also outside the warp so it is never blurred.
          */}
          <ViewfinderHUD />

          {/*
            WarpLayer wraps ONLY the page content (Nav + PageTransition).
            It applies scale(1.055) + blur(10px) on mount then animates
            to scale(1) + blur(0) over 1.1s.
            Nav is inside so it blurs with the page — intentional:
            the whole "scene" goes out of focus, not just body copy.
            Fixed instruments (Cursor, ApertureRing, ExposureMeter) are
            above and unaffected.
          */}
          <WarpLayer>
            <div id="root-container" style={{ minHeight: '100vh' }}>
              <Nav />
              <PageTransition>
                {children}
              </PageTransition>
            </div>
          </WarpLayer>
        </AudioProvider>
      </body>
    </html>
  );
}
