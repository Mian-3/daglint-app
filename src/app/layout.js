import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

export const metadata = {
  title: "Daglint — Premium Store",
  description: "Shop premium products online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-cream-50 text-ink-900 antialiased">
        <SessionProviderWrapper>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}