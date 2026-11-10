import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Funding Radar — Autonomous Investor Intelligence",
  description:
    "Discover recently funded comparable startups with TinySet, verify primary source evidence, and receive a ranked actionable list of investors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0d14] text-slate-100 antialiased selection:bg-sky-500/20 selection:text-sky-200">
        <Header />
        <main className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
          <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {children}
          </div>

          <footer className="border-t border-[#1e2634] bg-[#0c1017] py-6 text-xs text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <p>
                Built with <span className="text-slate-300 font-medium">TinyFish &amp; TinySet</span> for live structured discovery.
              </p>
              <p className="text-[11px] text-slate-400">
                All funding claims link to primary company and investor public disclosures. Not investment advice.
              </p>
            </div>
          </footer>
        </main>
      </body>
    </html>
  );
}
