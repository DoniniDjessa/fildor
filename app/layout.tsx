import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Poppins } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fil d'Or - Gestion Atelier",
  description: "Application de gestion pour atelier de couture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body
        className={`${playfairDisplay.variable} ${montserrat.variable} ${poppins.variable} antialiased h-full`}
      >
        {children}
      </body>
    </html>
  );
}
