import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Sans_Thai } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({ 
  subsets: ["thai", "latin"],
  variable: "--font-thai",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#6366f1",
};

export const metadata: Metadata = {
  title: {
    default: "Expense Tracker - จัดการรายรับรายจ่าย",
    template: "%s | Expense Tracker",
  },
  description: "แอปพลิเคชันจัดการรายรับรายจ่ายส่วนบุคคล บันทึกค่าใช้จ่าย วิเคราะห์การใช้เงิน วางแผนการเงินอย่างมีประสิทธิภาพ",
  keywords: ["expense tracker", "budget", "finance", "รายรับรายจ่าย", "จัดการเงิน", "บัญชีรายรับรายจ่าย"],
  authors: [{ name: "Expense Tracker Team" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    title: "Expense Tracker - จัดการรายรับรายจ่าย",
    description: "แอปพลิเคชันจัดการรายรับรายจ่ายส่วนบุคคล บันทึกค่าใช้จ่าย วิเคราะห์การใช้เงิน",
    siteName: "Expense Tracker",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${ibmPlexSansThai.variable} font-sans antialiased bg-gray-50 text-gray-900`}
        suppressHydrationWarning
      >
        {children}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
          toastOptions={{
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
