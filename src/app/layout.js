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
  title: "DeepChat | Smart AI Chat Assistant",
  description:
    "Chat intelligently with Gemini — a sleek AI-powered assistant built using Next.js and Gemini API. Enjoy real-time responses, clean UI, and persistent memory for a next-gen chat experience.",
  keywords: [
    "DeepChat",
    "Gemini Chat",
    "AI Chat App",
    "Next.js Chatbot",
    "Gemini API",
    "AI Assistant",
    "Deep Debnath Projects",
    "Gemini Clone",
    "AI Web App",
    "Chat with Gemini",
  ],
  authors: [
    {
      name: "Deep Debnath",
      url: "https://deep-debnath-portfolio.vercel.app",
    },
  ],
  openGraph: {
    title: "DeepChat | Smart AI Chat Assistant",
    description:
      "A modern Gemini-powered chat experience — fast, interactive, and beautifully designed with Next.js.",
    url: "https://deepchat-assistant.vercel.app/",
    siteName: "Gemini Chat",
    images: [
      {
        url: "https://botnation.ai/site/wp-content/uploads/2022/02/meilleur-chatbot.jpg",
        width: 1200,
        height: 630,
        alt: "Chatbot Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DeepChat | Smart AI Chat Assistant",
    description:
      "Experience Gemini AI — a sleek, intelligent chat assistant built with Next.js and modern UI.",
    images: [
      "https://botnation.ai/site/wp-content/uploads/2022/02/meilleur-chatbot.jpg",
    ],
    creator: "@deepdebnath",
  },
  icons: {
    icon: "/favicon.ico",
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
