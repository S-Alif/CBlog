import { Roboto, Roboto_Mono } from "next/font/google";
import "../globals.css";
import { PublicNavbar } from "@/components/navs/PublicNavbar";
import {ThemeProvider} from "next-themes";
import {Toaster} from "@/components/ui/sonner";

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
