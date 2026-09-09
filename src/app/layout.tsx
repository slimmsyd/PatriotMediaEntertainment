import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { site } from "@/lib/content-defaults";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const description = `Live events and film production. ${site.name} builds shows and stories around the people and places that shape this country.`;

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description,
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/images/monogram-p.png", sizes: "1024x1024", type: "image/png" },
    ],
    apple: [{ url: "/images/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: site.name,
    description,
    images: [
      {
        url: "/images/og-brand.jpg",
        width: 1968,
        height: 528,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description,
    images: ["/images/og-brand.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
