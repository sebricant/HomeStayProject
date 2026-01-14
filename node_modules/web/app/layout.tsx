import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Palm Grove Homestay | Alleppey",
  description: "Experience the serenity of Alleppey backwaters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
