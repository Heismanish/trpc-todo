import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/app/_trpc/Provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo-trpc",
  description: "A todo app built using next and trpc.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
