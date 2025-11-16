import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Loadly – Generator reklam",
  description:
    "Wklej link, wygeneruj i opublikuj gotową reklamę na Facebooka i Instagrama.",
  keywords: [
    "AI",
    "reklamy",
    "generator reklam",
    "social media",
    "Facebook Ads",
    "Instagram Ads",
    "marketing",
    "automatyzacja",
    "Loadly",
  ],

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "Loadly – Generator reklam",
    description:
      "Wklej link produktu i wygeneruj gotową kreację reklamową w kilka sekund.",
    url: "https://loadly.pl",
    siteName: "Loadly",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Loadly – Generator reklam",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Loadly – Generator reklam",
    description:
      "Wklej link, wygeneruj i opublikuj reklamę na FB/IG jednym kliknięciem.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
