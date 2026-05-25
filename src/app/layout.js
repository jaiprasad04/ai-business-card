import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "CardAI Creator - Premium AI Digital Business Cards",
  description: "Create stunning, interactive digital business cards using AI templates and a built-in AI chatbot assistant for your visitors.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-dvh w-full" style={{ colorScheme: 'light' }}>
      <body className={`${inter.variable} ${outfit.variable} h-full w-full flex flex-col antialiased bg-slate-50 text-slate-900 font-sans`}>
        <Providers>
          <Navbar />
          <div className="flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
