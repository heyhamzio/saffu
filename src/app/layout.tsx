import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saffu | Hamza Shaikh Portfolio",
  description:
    "Saffu is a chat-first portfolio for Hamza Shaikh. Ask anything about his work, projects, and design-engineering journey."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
