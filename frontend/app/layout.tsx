import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrivateMind AI - Local-First Personal Assistant",
  description: "Privacy-first personal AI workspace for documents, memories, and tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
