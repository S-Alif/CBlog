"use client"

// link buttons
import actorStore from "@/stores/actorStore";
import {usePathname, useRouter} from "next/navigation";
import {IndividualSection} from "@/components/Sections";
import DisplayAvatar from "@/components/DisplayAvatar";
import {Button} from "@/components/ui/button";
import {LayoutDashboard, UserPen} from "lucide-react";
import {useIsMobile} from "@/hooks/use-mobile";
import {useEffect} from "react";


const linkButtons = [
    {
        link: "/profile",
        label: "Dashboard",
        icon: <LayoutDashboard />
    },
    {
        link: "/profile/info",
        label: "Profile",
        icon: <UserPen />
    },
]


// profile top
export default function ProfileTop() {
    
    const {user, setUser} = actorStore()
    const router  = useRouter()
    const isMobile = useIsMobile()
    const pathname = usePathname()
    
    
    useEffect(() => {
        if(!user) setUser()
    }, [])
    
    
    return (
        <IndividualSection
            // className={"individual-section"}
            sectionId={"profile-top"}
            containerClassName={"bg-gray-200 p-3 rounded-md"}
        >
            <div className={"w-full h-[30vh] rounded-lg"}>
                <img
                    src={user?.bannerImg}
                    alt={`${user?.name || "User"} profile`}
                    className={"object-cover object-center w-full h-full rounded-lg"}
                />
            </div>
            
            <div className={"pt-4"}>
                <div className={"flex items-center justify-between gap-4"}>
                    <DisplayAvatar userData={user} squared={true} size={"lg"} />
                    
                    {/*links*/}
                    <div>
                        {
                            linkButtons.map(({ link, label, icon }) => (
                                <Button
                                    key={label}
                                    size="tabs"
                                    variant={"tabs"}
                                    className={`${pathname == link && "before:w-4 before:h-1 before:rounded before:bg-primary before:absolute before:bottom-[-2px] before:left-0"}`}
                                    onClick={() => {
                                        router.push(link)
                                    }}
                                >
                                    {icon} {!isMobile && <span>{label}</span> }
                                </Button>
                            ))
                        }
                    </div>
                </div>
            </div>
        
        </IndividualSection>
    )
}