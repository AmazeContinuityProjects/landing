import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Or your preferred font
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AmazeSuite | VIT Student Ecosystem",
  description: "The unified student ecosystem featuring AmazeCC, AmazeSort, AmazeTrack, and GoRobo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* Set the global background color to match the UI components */}
      <body className={`${inter.className} min-h-screen bg-[#0A0D14] text-slate-200 antialiased flex flex-col`}>
        
        <Navbar />
        
        {/* Main content wrapper expands to fill space between nav and footer */}
        <main className="flex-1 w-full">
          {children}
        </main>
        
        <Footer />
        
      </body>
    </html>
  );
}
