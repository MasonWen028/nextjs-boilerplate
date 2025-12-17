import type { Metadata } from "next";
import { Sen } from "next/font/google";
import "./globals.css";
import "./App.css";
import Providers from "./providers";

const sen = Sen({
  weight: ['400', '700', '800'],
  subsets: ["latin"],
  variable: "--font-sen",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "OzBridge CRM - Immigration & Education Management",
  description: "Complete CRM solution for immigration and education agents. Manage clients, cases, finances, and workflows with AI-powered automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sen.variable} font-sen antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
