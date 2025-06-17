"use client"
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
} from "../ui/resizeable-navbar";
import {Fragment, useState} from "react";
import Link from "next/link";
import infoStore from "@/stores/infoStore";
import DisplayDropdown from "@/components/DisplayDropdown";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {ChevronDown, LogIn, PanelRightOpen, UserRoundCheck} from "lucide-react";
import DisplaySheets from "@/components/DisplaySheets";
import {Button} from "@/components/ui/button";
import actorStore from "@/stores/actorStore";
import DisplayAvatar from "@/components/DisplayAvatar";
import {roles} from "@/lib/constants/roleConstants";


// navbar avatar
export function AvatarInfo ({user, setIsMobileMenuOpen = null, logout}) {
    
    const isAdmin = user?.roles?.includes(roles.ADMIN)
    const isModerator = user?.roles?.includes(roles.MODERATOR)
    
    return (
        <DisplayDropdown
            trigger={
                <button type={"button"} className={"cursor-pointer"}>
                    <DisplayAvatar user={user} />
                </button>
            }
        >
            {
                (isAdmin || isModerator) &&
                <DropdownMenuItem>
                    <Link
                        href={`/dashboard`}
                        onClick={() => {
                            setIsMobileMenuOpen && setIsMobileMenuOpen(false);
                        }}
                        className="text-zinc-800 dark:text-neutral-300 w-full"
                    >
                        {isAdmin && "Admin "}{isModerator && "Moderator "}Dashboard
                    </Link>
                </DropdownMenuItem>
            }
            <DropdownMenuItem>
                <Link
                    href={`/profile`}
                    onClick={() => {
                        setIsMobileMenuOpen && setIsMobileMenuOpen(false);
                    }}
                    className="text-zinc-800 dark:text-neutral-300 w-full"
                >
                    Profile
                </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem>
                <Button
                    onClick={() => {
                        logout()
                        setIsMobileMenuOpen && setIsMobileMenuOpen(false);
                    }}
                    className="w-full"
                >
                    Logout
                </Button>
            </DropdownMenuItem>
        </DisplayDropdown>
    )
}

// navbar
export function PublicNavbar() {

    const {category} = infoStore()
    const {user, logout} = actorStore()

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
                        {
                            !user ?
                            <Fragment>
                                <NavbarButton variant="secondary" href={"/auth/login"}>
                                    Login
                                </NavbarButton>
                                <NavbarButton variant="secondary" href={"/auth/register"}>
                                    Register
                                </NavbarButton>
                            </Fragment>
                            :
                            <AvatarInfo user={user} logout={logout} />
                        }
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
                                                                key={`category.name-${drIdx}`}
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
                                {
                                    !user ?
                                    <Fragment>
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
                                    </Fragment>
                                    :
                                    <AvatarInfo user={user} setIsMobileMenuOpen={setIsMobileMenuOpen} logout={logout} />
                                }
                            </div>
                            
                        </DisplaySheets>
                    </MobileNavHeader>
                </MobileNav>
            </Navbar>
            {/* Navbar */}
        </div>
    );
}
