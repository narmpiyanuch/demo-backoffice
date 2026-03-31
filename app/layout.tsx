import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WhiteLabelProvider } from "@/contexts/WhiteLabelContext";
import DynamicMetadata from "@/components/DynamicMetadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Backoffice System",
  description: "White Label Backoffice Configuration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WhiteLabelProvider>
          <DynamicMetadata />
          {children}
        </WhiteLabelProvider>
      </body>
    </html>
  );
}
