import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ClerkProvider } from '@clerk/nextjs';
import Heartbeat from "./components/Heartbeat";

export const metadata = {
  title: "GivethNotes",
  description: "A private learning journal for serious developers",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className="h-dvh bg-[#0c0c0c] text-gray-200 antialiased"
        >
          <Heartbeat /> {/* Keep the API connection alive */}
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
