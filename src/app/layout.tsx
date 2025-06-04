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
  title: "عيد الأضحى المبارك | Amine",
  description: "موقع تهاني عيد الأضحى المبارك من أمين. أرسل تهنئتك وشارك الفرحة!",
  icons: {
    icon: "/Mouton de l'Aïd al-Adha.png",
  },
  authors: [{ name: "Haicheur Mohamed Amine" }],
  keywords: [
    "عيد الأضحى",
    "تهاني",
    "أمين",
    "Eid al-Adha",
    "Eid Mubarak",
    "Amine",
    "مبارك",
    "موقع تهاني",
  ],
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
