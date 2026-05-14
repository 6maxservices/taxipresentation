import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContactButtons from "./components/ContactButtons";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "Discover Greece with George",
  description: "Premium private tours and transfers in Athens, Greece.",
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
