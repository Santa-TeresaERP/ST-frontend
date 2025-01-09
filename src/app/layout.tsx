"use client";

import localFont from "next/font/local";
import "./globals.css";
import ReactQueryProvider from "../core/provider/react-query-provider";
import HeaderClient from "./components/components-header/HeaderClient";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <HeaderClient />
      <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
