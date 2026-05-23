import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NebulaOS",
  description: "A futuristic web-based operating system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
