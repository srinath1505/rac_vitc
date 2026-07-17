import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import SmoothScroll from "@/components/layout/SmoothScroll";
import CustomCursor from "@/components/layout/CustomCursor";
import Preloader from "@/components/layout/Preloader";
import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rotaractvitc.org"),
  title: {
    default: `${site.name} | Service Above Self`,
    template: `%s | ${site.shortName}`,
  },
  description:
    "Official website of the Rotaract Club of VIT Chennai. Empowering young leaders through service, fellowship, and professional development under RI District 3234.",
  keywords: [
    "Rotaract",
    "VIT Chennai",
    "VITC",
    "Rotary Club",
    "Chennai Spotlight",
    "District 3234",
    "Kadal Karai",
    "Beach Cleanup",
    "Green Rotaractor",
  ],
  openGraph: {
    title: `${site.name} | Service Above Self`,
    description:
      "Building Leaders, Creating Impact, Transforming Communities. Join the Rotaract Club of VIT Chennai.",
    type: "website",
    siteName: site.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* If JS is disabled, never trap content behind the preloader. */}
        <noscript>
          <style>{`#preloader{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-paper text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>

        <Preloader />
        <PageTransition />
        <SmoothScroll />
        <CustomCursor />
        <Navbar />

        <main id="main" className="relative">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
