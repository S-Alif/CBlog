"use client"

import {
    LayoutDashboard, List, Newspaper, Tags
} from "lucide-react"

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import Link from "next/link"

// nav items
export const navItems = [
    {
        title: "Dashboard",
        slug: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Category",
        slug: "Handle categories",
        url: "/dashboard/category",
        icon: List,
    },
    {
        title: "Tags",
        slug: "Handle tags",
        url: "/dashboard/tags",
        icon: Tags,
    },
    {
        title: "Blogs",
        slug: "Handle blogs",
        url: "/dashboard/blogs",
        icon: Newspaper,
    },
]

export function NavMain() {
    return (
        <SidebarGroup>
            <SidebarMenu className={"mt-5"}>
                {navItems.map((item, index) => (
                    <SidebarMenuButton key={index} className={"mb-2 w-full"}>
                        <Link href={item?.url} className={"flex gap-3 items-center w-full"}>
                            <item.icon size={18} /> <span className={"text-base"}>{item?.title}</span>
                        </Link>
                    </SidebarMenuButton>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
