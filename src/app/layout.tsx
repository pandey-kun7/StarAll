import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "StarAll — Autonomous Investor Intelligence",
  description:
    "Discover recently funded comparable startups with TinySet, verify primary source evidence, and receive a ranked actionable list of investors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="bg-[#fbfaf7] text-stone-900 antialiased selection:bg-amber-100 selection:text-amber-900">
        <Header />
        <main className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
          <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {children}
          </div>

          <footer className="border-t border-[#e8e4dc] bg-[#f7f5ee] py-6 text-xs text-stone-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <p>
                Built with <span className="text-stone-800 font-medium">TinyFish &amp; TinySet</span> for live structured discovery.
              </p>
              <p className="text-[11px] text-stone-500">
                All funding claims link to primary company and investor public disclosures. Not investment advice.
              </p>
            </div>
          </footer>
        </main>
      </body>
    </html>
  );
}
