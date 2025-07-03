import { Roboto, Roboto_Mono } from "next/font/google";
import "../globals.css";
import {ThemeProvider} from "next-themes";
import {Toaster} from "@/components/ui/sonner";
import SideNavbar from "@/components/navs/SideNavbar";
import {checkAuth} from "@/helpers/check-auth/check-auth";
import {roles} from "@/lib/constants/roleConstants";
import {redirect} from "next/navigation";

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

export default async function RootLayout({ children }) {
    
    const validUser = await checkAuth([roles.ADMIN, roles.MODERATOR])
    if(!validUser) return redirect("/auth/login")
    
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
