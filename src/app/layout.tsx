import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ShadowCraft - CSS Box Shadow Generator",
  description:
    "Professional CSS box-shadow generator with multiple layers, live preview, and one-click copy. Create subtle, dramatic, neon, and layered shadows with ease.",
  keywords: [
    "CSS box shadow",
    "shadow generator",
    "CSS tool",
    "web design",
    "frontend",
    "box-shadow",
  ],
  authors: [{ name: "ShadowCraft" }],
  openGraph: {
    title: "ShadowCraft - CSS Box Shadow Generator",
    description:
      "Professional CSS box-shadow generator with multiple layers, live preview, and one-click copy.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShadowCraft - CSS Box Shadow Generator",
    description:
      "Professional CSS box-shadow generator with multiple layers, live preview, and one-click copy.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
