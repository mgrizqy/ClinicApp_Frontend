"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const {checkSession,isLoading} = useAuthStore();

  useEffect(()=>{
    checkSession();
  },[checkSession])

  return (

    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      {isLoading ? (
          <div className="flex items-center justify-center h-screen w-screen bg-slate-50 text-slate-600 font-sans">
            Loading Clinic Session...
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
