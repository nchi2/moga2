import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";
import localFont from "next/font/local";
import { Geist, Roboto, Rubik_Scribble } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--roboto-text",
});

const rubick = Rubik_Scribble({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  variable: "--rubick-text",
});

const metallica = localFont({
  src: "./MetalMania-Regular.ttf",
  variable: "--metallica-text",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Blue Market",
    default: "Blue Market",
  },
  description: "Sell and buy all the things!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${roboto.variable} ${rubick.variable} ${metallica.variable} text-white max-w-screen-sm mx-auto`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
