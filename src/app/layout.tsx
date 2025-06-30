import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { GeistSans } from "geist/font/sans";
import { WrapperWithQuery } from "@/components/wrapper";
import { createMetadata } from "@/lib/metadata";
import NextTopLoader from "nextjs-toploader";

export const metadata = createMetadata({
  title: {
    template: "%s | Better Auth",
    default: "Better Auth",
  },
  description: "The most comprehensive authentication library for typescript",
  metadataBase: new URL("https://demo.better-auth.com"),
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
      </head>
      <body className={`${GeistSans.className} font-sans`}>
        <NextTopLoader color="#000" showSpinner={false} />
        <ThemeProvider attribute="class" defaultTheme="dark">
          <WrapperWithQuery>{children}</WrapperWithQuery>
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
