"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/database", label: "Database" },
  ];

  return (
    <html lang="en">
      <body className="overflow-hidden">
        <nav className="bg-black text-white text-lg p-3 flex justify-between items-center">
          <div className="font-bold">BookList</div>
          <div className="flex gap-5">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`hover:bg-gray-600 rounded transition duration-200 ${isActive ? "font-bold" : ""}`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
