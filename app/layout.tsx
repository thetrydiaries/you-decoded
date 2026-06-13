import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "You, Decoded — Your Personality Passport",
  description:
    "Eighteen lenses, one you. Astrology, MBTI, Enneagram, Human Design and more — decoded into a single beautiful passport. Just for fun, entirely about you.",
  openGraph: {
    title: "You, Decoded",
    description: "Eighteen lenses, one you. Get your personality passport.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Loaded at runtime (not next/font) so builds don't depend on network access */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-aurora min-h-screen">
        <div className="starfield" aria-hidden />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
