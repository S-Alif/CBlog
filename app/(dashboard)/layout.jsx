import { Roboto, Roboto_Mono } from "next/font/google";
import "../globals.css";
import {ThemeProvider} from "next-themes";
import {Toaster} from "@/components/ui/sonner";
import SideNavbar from "@/components/navs/SideNavbar";

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
    title: "Dashboard",
    description: "For admins and moderators to control everything on the platform",
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
                <SideNavbar>
                    {children}
                </SideNavbar>
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
