import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContactButtons from "./components/ContactButtons";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  metadataBase: new URL('https://georgeathenstaxi.gr'),
  title: "George Papatheodorou | Premium Taxi Transfer & Tours in Athens",
  description: "Discover Greece with George Papatheodorou. Premium private taxi transfers, customized day tours, and multi-day trips starting from Athens. No upfront deposits. Book your unforgettable Greek experience today.",
  keywords: "Athens taxi, Greece private tours, airport transfers Athens, George Papatheodorou, private driver Greece, Sounio tour, Delphi tour",
  openGraph: {
    title: "George Papatheodorou | Premium Taxi Transfer & Tours",
    description: "Premium private taxi transfers and customized tours in Athens and across Greece. No upfront deposits required.",
    url: 'https://georgeathenstaxi.gr',
    siteName: 'George Athens Taxi',
    images: [
      {
        url: '/logos/logo_option_1.png',
        width: 1200,
        height: 630,
        alt: 'George Papatheodorou Taxi Transfer & Tours Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "George Papatheodorou | Premium Taxi Transfer & Tours",
    description: "Premium private taxi transfers and customized tours in Athens and across Greece.",
    images: ['/logos/logo_option_1.png'],
  },
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
