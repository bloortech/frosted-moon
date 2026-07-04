import type { Metadata } from "next";
import { Newsreader, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
  variable: "--font-newsreader",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  title: "Frosted Moon ☾ eggless home bakery in Kota",
  description:
    "Sweet little things, baked under the moon. Eggless cakes, cookies, and dessert jars made to order in Kota, Rajasthan. Order on WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${hanken.variable}`}>
        {children}
      </body>
    </html>
  );
}
