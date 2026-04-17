import type { Metadata } from "next";
import { Cinzel_Decorative, Cinzel, IM_Fell_English, Special_Elite } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const imFell = IM_Fell_English({
  variable: "--font-fell",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const specialElite = Special_Elite({
  variable: "--font-typewriter",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Ecos del Alma — Memorias del Laberinto y la Luz",
  description: "Un espacio digital privado y eterno para los ecos de nuestro amor.",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${cinzelDecorative.variable} ${cinzel.variable} ${imFell.variable} ${specialElite.variable} antialiased`}
        style={{
          background: '#0a0a0a',
          color: '#d4c5b0',
          fontFamily: "'IM Fell English', serif",
        }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
