import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/components/AudioProvider";
import { CustomCursor } from "@/components/CustomCursor";
import { PageTransition } from "@/components/PageTransition";
import { Nav } from "@/components/Nav";

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
  title: "NIELLESS ACHARYA | Modern Brutalism × Mechanical Elegance",
  description: "Full-Stack Engineer. AI-native builder. Backend-first.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${bebasNeue.variable} ${jetbrainsMono.variable} ${crimsonPro.variable} antialiased`}
        style={{ cursor: 'none' }}
      >
        <AudioProvider>
          <CustomCursor />
          <div id="root-container" className="bg-void min-h-screen">
            <Nav />
            <PageTransition>
                {children}
            </PageTransition>
          </div>
        </AudioProvider>
      </body>
    </html>
  );
}
