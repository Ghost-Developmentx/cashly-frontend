// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cashly - AI Financial Advisor",
  description: "Your AI-powered financial advisor for small businesses",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <ClerkProvider>
        <html lang="en">
        <body className={inter.className}>{children}</body>
        </html>
      </ClerkProvider>
  );
}