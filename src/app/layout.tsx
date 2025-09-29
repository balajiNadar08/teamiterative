import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PreTranslatedProvider } from "../../context/PreTranslatedContext";
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
  title: "Team Iterative",
  description: "",
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
        <PreTranslatedProvider>{children}</PreTranslatedProvider>
      </body>
    </html>
  );
}
