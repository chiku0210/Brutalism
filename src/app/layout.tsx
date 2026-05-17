import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "NIELLESS — Full-Stack Engineer",
  description: "Backend-first engineer building systems that hold. Node.js, PostgreSQL, AWS, AI-native.",
  openGraph: {
    title: "NIELLESS — Full-Stack Engineer",
    description: "Backend-first engineer building systems that hold. Node.js, PostgreSQL, AWS, AI-native.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
