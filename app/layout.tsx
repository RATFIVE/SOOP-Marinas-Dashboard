import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/theme-provider";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { ActiveThemeProvider } from "@/components/active-theme";
import MotionLayout from "@/components/motion-layout";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#111827",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOOP Marinas Dashboard",
  description: "Real-time marina sensor data monitoring dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background overscroll-none font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          enableColorScheme
        >
          <ActiveThemeProvider initialTheme="light">
            <MotionLayout>
              {children}
            </MotionLayout>
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
