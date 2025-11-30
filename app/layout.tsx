import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pemilihan RT. 61 Kel. Batu Ampar, Kec. Balikpapan Utara, Balikpapan - 2025",
  description: "Pemilihan RT. 61 Kel. Batu Ampar, Kec. Balikpapan Utara, Balikpapan - 2025 adalah pemilihan calon RT. 61 yang dilakukan oleh calon RT. 61.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
