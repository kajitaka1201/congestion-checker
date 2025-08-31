import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/ui-elements/header";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata: Metadata = {
  title: "Congestion Checker",
  description: "喫茶店の混雑を確認するウェブアプリ"
};

export const viewport: Viewport = {
  width: 1024
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
