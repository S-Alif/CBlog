"use client"
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "../ui/resizeable-navbar";
import { useState } from "react";
import Link from "next/link";
import infoStore from "@/stores/infoStore";
import DisplayDropdown from "@/components/DisplayDropdown";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {ChevronDown, LogIn, PanelRightOpen, UserRoundCheck} from "lucide-react";
import DisplaySheets from "@/components/DisplaySheets";
import {Button} from "@/components/ui/button";

export function PublicNavbar() {

    const {category} = infoStore()

    const navItems = [
        {
            name: "Home",
            link: "/",
        },
        {
            name: "Categories",
            dropdowns: category || []
        },
        {
            name: "Featured",
            link: "/#featured",
        },
    ]
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


    return (
        <div className="fixed w-full">
            <Navbar>
                {/* Desktop Navigation */}
                <NavBody>
                    <NavbarLogo />
                    <NavItems items={navItems} />
                    <div className="flex items-center gap-1">
                        <NavbarButton variant="secondary" href={"/auth/login"}>
                            Login
                        </NavbarButton>
                        <NavbarButton variant="secondary" href={"/auth/register"}>
                            Register
                        </NavbarButton>
                    </div>
                </NavBody>

                {/* Mobile Navigation */}
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo />
                        <DisplaySheets
                            trigger={
                                <Button size={"icon"}>
                                    <PanelRightOpen />
                                </Button>
                            }
                            open={isMobileMenuOpen}
                            setOpen={setIsMobileMenuOpen}
                            side={"top"}
                        >
                            <div className="flex flex-col gap-3">
                                {navItems.map((item, idx) => {
                                    return item?.link ? (
                                            <Link
                                                key={idx}
                                                href={item.link}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="text-neutral-600 dark:text-neutral-300 w-fit"
                                            >
                                                {item.name}
                                            </Link>
                                        )
                                        :
                                        (
                                            <DisplayDropdown
                                                key={idx}
                                                trigger={
                                                    <button type="button" className={"w-fit"}>
                                                        <span className="flex gap-1 items-center cursor-pointer">{item.name} <ChevronDown size={22}/></span>
                                                    </button>
                                                }
                                            >
                                                {
                                                    item.dropdowns.map((category, drIdx) => (
                                                        <DropdownMenuItem>
                                                            <Link
                                                                key={drIdx}
                                                                href={`/blog-by-category?category=${category._id}&page=1`}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className="text-neutral-600 dark:text-neutral-300 w-fit"
                                                            >
                                                                {category.name}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    ))
                                                }
                                            </DisplayDropdown>
                                        )
                                })}
                            </div>
                            <div className="flex w-full gap-4 pt-4">
                                <NavbarButton
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    variant="primary"
                                    href={"/auth/login"}
                                >
                                    <LogIn />
                                </NavbarButton>
                                
                                <NavbarButton
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    variant="primary"
                                    href={"/auth/register"}
                                >
                                    <UserRoundCheck />
                                </NavbarButton>
                            </div>
                            
                        </DisplaySheets>
                    </MobileNavHeader>
                </MobileNav>
            </Navbar>
            {/* Navbar */}
        </div>
    );
}

