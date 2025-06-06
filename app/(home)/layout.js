import { Roboto, Roboto_Mono } from "next/font/google";
import "../globals.css";

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
            >
                {children}
            </body>
        </html>
    );
}
