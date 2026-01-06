import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "GivethNotes",
  description: "A private learning journal for serious developers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="h-dvh bg-[#0c0c0c] text-gray-200 antialiased"
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
