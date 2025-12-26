import { ConditionalLayout } from "@/components/features/navigation";
import {
  AuthProvider,
  FontProvider,
  GoogleOneTapProvider,
  I18nProvider,
  LoadingProvider,
  NoSSR,
  RateLimitProvider,
  ReactQueryProvider,
  ThemeProvider,
} from "@/components/providers";
import { Toaster } from "@/components/ui";
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Roboto,
  Open_Sans,
  Lato,
  Montserrat,
  Poppins,
  Raleway,
  Source_Sans_3,
  Comic_Neue,
  Pixelify_Sans,
  Comic_Relief,
} from "next/font/google";
import "./globals.css";

// Load all available fonts with Next.js font optimization
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

const sourceSansPro = Source_Sans_3({
  variable: "--font-source-sans-pro",
  subsets: ["latin"],
  display: "swap",
});

const comicNeue = Comic_Neue({
  variable: "--font-comic-neue",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const comicRelief = Comic_Relief({
  variable: "--font-comic-relief",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: false, // Disable automatic font metrics calculation to avoid warning
});

export const metadata: Metadata = {
  title: {
    default: "MangaSBS",
    template: "%s | MangaSBS",
  },
  description:
    "Discover and read manga, anime, and light novels. Your ultimate destination for Japanese entertainment content.",
  keywords: ["manga", "anime", "light novel", "manga reader", "anime database"],
  authors: [{ name: "MangaSBS" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MangaSBS",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* Suppress FedCM experimental errors in console */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                const originalError = console.error;
                const originalWarn = console.warn;
                console.error = function(...args) {
                  const msg = args[0]?.toString() || '';
                  if (msg.includes('FedCM') || msg.includes('GSI_LOGGER') || msg.includes('AbortError: signal is aborted')) {
                    return;
                  }
                  originalError.apply(console, args);
                };
                console.warn = function(...args) {
                  const msg = args[0]?.toString() || '';
                  if (msg.includes('FedCM') || msg.includes('GSI_LOGGER')) {
                    return;
                  }
                  originalWarn.apply(console, args);
                };
              })();
            `,
          }}
        />
        {/* Google Identity Services - Required for Google One Tap */}
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${montserrat.variable} ${poppins.variable} ${raleway.variable} ${sourceSansPro.variable} ${comicNeue.variable} ${pixelifySans.variable} ${comicRelief.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning={true}
      >
        <NoSSR>
          <ReactQueryProvider>
            <I18nProvider>
              <ThemeProvider>
                <FontProvider>
                  <AuthProvider>
                    <LoadingProvider>
                      <RateLimitProvider>
                        {/* Global Google One Tap - Shows on all pages when not authenticated */}
                        <GoogleOneTapProvider />
                        <ConditionalLayout>{children}</ConditionalLayout>
                      </RateLimitProvider>
                    </LoadingProvider>
                  </AuthProvider>
                </FontProvider>
              </ThemeProvider>
            </I18nProvider>
          </ReactQueryProvider>
        </NoSSR>
        <Toaster richColors position="top-center" expand={true} />
      </body>
    </html>
  );
}
