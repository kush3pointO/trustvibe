import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustVibe - End the interrogation. Start the conversation.",
  description: "Find out how it actually feels from real stories of the TrustVibe community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
