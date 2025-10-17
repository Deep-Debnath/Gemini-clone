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

export const metadata = {
  title: "Gemini Chat | AI Chat Assistant",
  description:
    "A modern AI-powered chat app built with Next.js and Gemini API. Chat naturally with real-time responses and smart memory.",
  keywords: [
    "Gemini Chat App",
    "AI Chat App",
    "Next.js AI",
    "Chatbot",
    "OpenAI Gemini",
    "AI Assistant",
  ],
  authors: [{ name: "Deep Debnath", url: "https://my-portfolio-ob9g.vercel.app/" }],
  openGraph: {
    title: "Gemini ChatApp | AI Chat Assistant",
    description:
      "Experience fast, interactive, and intelligent conversations powered by Gemini AI.",
    url: "https://gemini-clone-5csw.vercel.app/",
    siteName: "Gemini Chat",
    images: [
      {
        url: "/globe.svg", 
        width: 1200,
        height: 630,
        alt: "Gemini Chat Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};


export default function RootLayout({ children }) {
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
