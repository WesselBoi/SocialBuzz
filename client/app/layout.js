import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "SocialBuzz",
  description: "A social media platform built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
