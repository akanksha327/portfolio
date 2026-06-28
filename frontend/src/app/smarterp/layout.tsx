import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SmartERP - Modern SaaS Enterprise Platform",
  description: "A professional, handcrafted Enterprise Resource Planning dashboard for modern business operations, ledger tracking, and inventory management.",
  keywords: ["SmartERP", "ERP", "SaaS Dashboard", "Accounting Software", "Inventory Control", "Enterprise Portal"],
};

export default function SmartERPLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.variable} font-sans antialiased`}>
      {children}
    </div>
  );
}
