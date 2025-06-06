import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Frontend/Navbar";
import Footer from "@/components/Frontend/Footer";
import {
  ClerkProvider,
  ClerkLoaded,
  ClerkLoading
} from '@clerk/nextjs'
import Loading from "@/components/Loader/loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebGenie - AI-Powered Website Generator",
  description: "Generate and refine websites instantly using AI. Create your MVP effortlessly with WebGenie.",
  keywords: "AI website generator, no-code website builder, AI web design, website creation, MVP builder, WebGenie",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ClerkLoading>
            <Loading />
          </ClerkLoading>
          <ClerkLoaded>
            <Navbar />
            <div className="min-h-[90vh]">
            {children}
            </div>
            <Footer />
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
