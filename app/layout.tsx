import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { EmailProvider } from "@/contexts/EmailContext";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bixby",
  description: "Now With Email!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased overscroll-none")}>
        <EmailProvider>{children}</EmailProvider>
      </body>
    </html>
  );
}
