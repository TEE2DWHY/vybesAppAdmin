import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VybesApp",
  description:
    "VybesApp is a modern dating and social platform designed to help users build authentic connections through innovative features. Whether you're looking for love, friendship, or just good vibes, VybesApp brings people together in a fun and engaging way.",
  keywords: [
    "dating app",
    "social platform",
    "relationships",
    "VybesApp",
    "connections",
    "love",
    "friendship",
    "vibes",
  ],
  openGraph: {
    title: "VybesApp",
    description:
      "VybesApp is a modern dating and social platform designed to help users build authentic connections through innovative features.",
    url: "https://www.vybesapp.netlify.app",
    images: [
      {
        url: "https://vybesapp.netlify.app/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75",
        alt: "VybesApp logo or relevant image",
      },
    ],
  },
  twitter: {
    title: "VybesApp",
    description:
      "VybesApp is a modern dating and social platform designed to help users build authentic connections through innovative features.",
    images: [
      {
        url: "https://vybesapp.netlify.app/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content={String(metadata.description ?? "")} />
        <meta
          name="keywords"
          content={
            Array.isArray(metadata.keywords)
              ? metadata.keywords.join(", ")
              : String(metadata.keywords ?? "")
          }
        />
        <meta
          property="og:title"
          content={String(metadata.openGraph?.title ?? "")}
        />
        <meta
          property="og:description"
          content={String(metadata.openGraph?.description ?? "")}
        />
        <meta
          property="og:url"
          content={String(metadata.openGraph?.url ?? "")}
        />
        <meta
          name="twitter:title"
          content={String(metadata.twitter?.title ?? "")}
        />
        <meta
          name="twitter:description"
          content={String(metadata.twitter?.description ?? "")}
        />
      </head>
      <body className={`${outfit.variable} antialiased`}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
