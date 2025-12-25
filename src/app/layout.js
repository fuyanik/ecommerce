import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProductsProvider } from "@/context/ProductsContext";
import Navbar from "@/components/Navbar";
import BottomNavbar from "@/components/BottomNavbar";
import HPAuthorizedBanner from "@/components/HPAuthorizedBanner";
import VisitorTracker from "@/components/VisitorTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Ofis Sepeti - Online Alışveriş",
  description: "Ofis Sepeti, yazıcı, bilgisayar, mobilya, ve daha fazlası. Güvenli ve hızlı alışveriş.",
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
                <VisitorTracker />
                <Navbar />
                <HPAuthorizedBanner />
                <main className="min-h-screen">
                  {children}
                </main>
                <BottomNavbar />
              </WishlistProvider>
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
        
        {/* LiveChat Widget 
        <Script id="livechat-script" strategy="afterInteractive">
          {`
            window.__lc = window.__lc || {};
            window.__lc.license = 19417837;
            window.__lc.integration_name = "manual_onboarding";
            window.__lc.product_name = "livechat";
            ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))
          `}
        </Script>
*/}
        <noscript>
          <a href="https://www.livechat.com/chat-with/19417837/" rel="nofollow">Chat with us</a>, powered by <a href="https://www.livechat.com/?welcome" rel="noopener nofollow" target="_blank">LiveChat</a>
        </noscript>

        {/* Hotjar Tracking Code for Ofis Sepeti */}
        <Script id="hotjar-script" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:6605554,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
      </body>
    </html>
  );
}
