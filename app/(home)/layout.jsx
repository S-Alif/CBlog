import { Roboto, Roboto_Mono } from "next/font/google";
import "../globals.css";
import { PublicNavbar } from "@/components/navs/PublicNavbar";
import {ThemeProvider} from "next-themes";
import {Toaster} from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-roboto",
    display: "swap",
});
const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-roboto-mono",
    display: "swap",
});

export const metadata = {
    title: "Welcome to CBlog",
    description: "A blog for CSE students",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${roboto.variable} ${robotoMono.variable} antialiased`}
                id={"root"}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NextTopLoader
                        height={10}
                        color={"#f25518"}
                        zIndex={2000}
                        crawl={true}
                        template='<div class="bar" role="bar"><div class="peg"></div></div>
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                        speed={300}
                    />
                    <PublicNavbar />
                    <main className={"w-full h-full"}>
                        {children}
                    </main>
                </ThemeProvider>
                <Toaster
                    visibleToasts={5}
                    position="top-center"
                    richColors
                />
            </body>
        </html>
    );
}
