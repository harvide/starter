import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@repo/ui/globals.css";
import { AdminCheckWrapper } from "@/components/wrapper/admin-check-wrapper";
import { Toaster } from "@repo/ui/components/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harvide Starter",
  description: "Never handle flows manually again. Use Harvide Starter to kickstart your next project with pre-configured authentication and UI components."
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
        <AdminCheckWrapper />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
