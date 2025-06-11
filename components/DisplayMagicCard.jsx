/**
 * DisplayMagicCard is a wrapper around the MagicCard component that dynamically
 * sets the gradient color based on the current theme (light or dark).
 *
 * It uses `next-themes` to detect the active theme and applies the appropriate gradient.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to render inside the MagicCard.
 * @param {string} [props.darkModeGradient="#262626"] - The gradient color to use in dark mode.
 * @param {string} [props.lightModeGradient="#D9D9D955"] - The gradient color to use in light mode.
 *
 * @returns {JSX.Element} A themed MagicCard component with the appropriate gradient applied.
 *
 * @example
 * <DisplayMagicCard>
 *   <h2>Hello, Magic</h2>
 * </DisplayMagicCard>
 */
"use client"

import {MagicCard} from "@/components/magicui/magic-card";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

export default function DisplayMagicCard ({
    children,
    darkModeGradient = "#262626",
    lightModeGradient = "#D9D9D955",
}) {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
        if(typeof window !== "undefined") {
            setMounted(true)
        }
    }, [])
    
    if (!mounted) {
        return <MagicCard gradientSize={200} gradientColor="#262626">{children}</MagicCard>
    }
    
    return (
        <MagicCard
            gradientColor={theme === "dark" ? darkModeGradient : lightModeGradient}
            className="p-0"
        >
            {children}
        </MagicCard>
    )
}