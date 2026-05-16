import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContactButtons from "./components/ContactButtons";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  metadataBase: new URL('https://georgeathenstaxi.gr'),
  title: "George’s Papatheodorou Taxi Transfer & Tours",
  description: "Premium private tours and transfers in Athens, Greece. Luxury service beyond the guidebook.",
  keywords: "Athens taxi, Greece private tours, airport transfers Athens, George Papatheodorou, private driver Greece",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <ContactButtons />
      </body>
    </html>
  );
}
