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
  title: {
    default: "Tech Knowledge Map",
    template: "%s | Tech Knowledge Map"
  },
  description: "Interactive knowledge map exploring technology, programming, and personal insights through React Flow visualization and blog posts.",
  keywords: ["technology", "programming", "knowledge map", "React Flow", "interactive", "visualization", "blog", "tech insights"],
  authors: [{ name: "Takaaki Taniguchi" }],
  creator: "Takaaki Taniguchi",
  publisher: "Takaaki Taniguchi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tanigu12.github.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tanigu12.github.io',
    title: 'Tech Knowledge Map',
    description: 'Interactive knowledge map exploring technology, programming, and personal insights through React Flow visualization and blog posts.',
    siteName: 'Tech Knowledge Map',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Knowledge Map',
    description: 'Interactive knowledge map exploring technology, programming, and personal insights through React Flow visualization and blog posts.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
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
