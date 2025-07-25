"use client"
import { cn } from "@/lib/utils";
import {ChevronDown, Menu, X} from "lucide-react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "motion/react";

import React, { useRef, useState } from "react";
import Link from "next/link";
import DisplayDropdown from "@/components/DisplayDropdown";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";


export const Navbar = ({
    children,
    className
}) => {
    const ref = useRef(null);
    const { scrollY } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const [visible, setVisible] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <motion.div
            ref={ref}
            // IMPORTANT: Change this to class of `fixed` if you want the navbar to be fixed
            className={cn("sticky inset-x-0 top-20 z-[10000] w-full", className)}>
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(child, { visible })
                    : child)}
        </motion.div>
    );
};

export const NavBody = ({
    children,
    className,
    visible
}) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(10px)" : "none",
                boxShadow: visible
                    ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
                    : "none",
                width: visible ? "40%" : "100%",
                y: visible ? 20 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            style={{
                minWidth: "800px",
            }}
            className={cn(
                "relative z-[10000] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex dark:bg-transparent",
                visible && "bg-white/80 dark:bg-neutral-950/80",
                className
            )}>
            {children}
        </motion.div>
    );
};

export const NavItems = ({
    items,
    className,
    onItemClick
}) => {
    const [hovered, setHovered] = useState(null);

    return (
        <motion.div
            onMouseLeave={() => setHovered(null)}
            className={cn(
                "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2",
                className
            )}>
            {items.map((item, idx) => {
                return item?.link ? (
                    <Link
                        onMouseEnter={() => setHovered(idx)}
                        onClick={onItemClick}
                        className="relative px-4 py-2 text-neutral-600 dark:text-neutral-300"
                        key={`link-${idx}`}
                        href={item.link}
                    >
                        {hovered === idx && (
                            <motion.div
                                layoutId="hovered"
                                className="absolute inset-0 h-full w-full rounded-full bg-gray-100 dark:bg-neutral-800" />
                        )}
                        <span className="relative z-[60]">{item.name}</span>
                    </Link>
                ) :
                    (
                        <DisplayDropdown
                            key={idx}
                            trigger={
                                <button
                                    type="button"
                                    onMouseEnter={() => setHovered(idx)}
                                    className="relative px-4 py-2 text-neutral-600 dark:text-neutral-300 cursor-pointer"
                                >
                                    {hovered === idx && (
                                        <motion.div
                                            layoutId="hovered"
                                            className="absolute inset-0 h-full w-full rounded-full bg-gray-100 dark:bg-neutral-800" />
                                    )}
                                    <span className="relative z-[60] flex gap-1">{item.name} <ChevronDown size={17}/></span>
                                </button>
                            }
                        >
                            {
                                item.dropdowns.map((dropdowns, drIdx) => (
                                    <DropdownMenuItem key={`dropdown-${drIdx}`}>
                                        <Link
                                            href={`blog-by-category?category=${dropdowns?._id}&page=1`}
                                            className="relative text-neutral-600 dark:text-neutral-300"
                                        >
                                            <span className="block z-[60]">{dropdowns?.name}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                ))
                            }
                        </DisplayDropdown>
                    )
            })}
        </motion.div>
    );
};

export const MobileNav = ({
    children,
    className,
    visible
}) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(10px)" : "none",
                boxShadow: visible
                    ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
                    : "none",
                width: visible ? "90%" : "100%",
                paddingRight: visible ? "12px" : "0px",
                paddingLeft: visible ? "12px" : "0px",
                borderRadius: visible ? "4px" : "2rem",
                y: visible ? 20 : 0,
                zIndex: 100
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            className={cn(
                "relative !z-[3000] mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
                visible && "bg-white/80 dark:bg-neutral-950/80",
                className
            )}>
            {children}
        </motion.div>
    );
};

export const MobileNavHeader = ({
    children,
    className
}) => {
    return (
        <div
            className={cn("flex w-full flex-row items-center justify-between", className)}>
            {children}
        </div>
    );
};

export const MobileNavMenu = ({
    children,
    className,
    isOpen,
    onClose
}) => {
    return (
        <AnimatePresence>
            <div className={"z-[100]"}>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                            "absolute inset-x-0 top-16 !z-[100] flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white px-4 py-4 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] dark:bg-neutral-950",
                            className
                        )}>
                        {children}
                    </motion.div>
                )}
            </div>
        </AnimatePresence>
    );
};

export const MobileNavToggle = ({
    isOpen,
    onClick
}) => {
    return isOpen ? (
        <X className="text-black dark:text-white" onClick={onClick} />
    ) : (
        <Menu className="text-black dark:text-white" onClick={onClick} />
    );
};

export const NavbarLogo = () => {
    return (
        <Link
            href="/#"
            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black">
            <img
                src="/logo-crop.jpg"
                alt="logo"
                width={30}
                height={30} />
            <span className="font-bold text-black dark:text-white">CBlog</span>
        </Link>
    );
};

export const NavbarButton = ({
    href,
    as: Tag = Link,
    children,
    className,
    variant = "primary",
    ...props
}) => {
    const baseStyles =
        "px-4 py-2 rounded-md bg-white button bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

    const variantStyles = {
        primary:
            "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
        secondary: "bg-transparent shadow-none dark:text-white",
        dark: "bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
        gradient:
            "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
    };

    return (
        <Link
            href={href || undefined}
            className={cn(baseStyles, variantStyles[variant], className)}
            {...props}>
            {children}
        </Link>
    );
};
