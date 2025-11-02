import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Sora } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Sarva Math Suite",
  description: "A suite of powerful and beautiful math tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
    className={`${sora.variable} antialiased h-full bg-[#fdfcf9] text-gray-800`}
  >
        <div className="min-h-screen flex flex-col">
          {/* Page content */}
          <main className="flex-grow">{children}</main>

          {/* Footer */}
          <footer className="border-t border-gray-200 py-6 text-sm text-gray-500 text-center">
            <div className="max-w-5xl mx-auto px-4">
              <p className="mb-2">
                Built by{" "}
                <a
                  href="https://sarvajithkarun.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-500 hover:underline"
                >
                  Sarvajith Karun
                </a>{" "}
                •{" "}
                <Link href="/" className="text-purple-500 hover:underline">
                  Home
                </Link>
              </p>
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} Sarvajith Karun. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}