import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Patriot Media Entertainment",
    template: "%s · Patriot Media Entertainment",
  },
  description:
    "Live events and film production. Patriot Media Entertainment builds shows and stories around the people and places that shape this country.",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/images/monogram-p.png", sizes: "1024x1024", type: "image/png" },
    ],
    apple: [{ url: "/images/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Patriot Media Entertainment",
    description:
      "Live events and film production. Patriot Media Entertainment builds shows and stories around the people and places that shape this country.",
    images: [
      {
        url: "/images/og-brand.jpg",
        width: 1968,
        height: 528,
        alt: "Patriot Media Entertainment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patriot Media Entertainment",
    description:
      "Live events and film production. Patriot Media Entertainment builds shows and stories around the people and places that shape this country.",
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
