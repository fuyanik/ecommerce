import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProductsProvider } from "@/context/ProductsContext";
import Navbar from "@/components/Navbar";
import BottomNavbar from "@/components/BottomNavbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Çizgi Ticaret - Online Alışveriş",
  description: "Teknoloji, ev eşyaları, mobilya, bebek ürünleri ve daha fazlası. Güvenli ve hızlı alışveriş.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                <main className="min-h-screen">
                  {children}
                </main>
                <BottomNavbar />
              </WishlistProvider>
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
