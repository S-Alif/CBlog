import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";
import actorStore from "@/stores/actorStore";

function CreateAvatar ({
    userData,
    squared = false,
    size="sm",
    children
}) {
    return (
        <div className={"flex gap-4 items-center"}>
            <Avatar className={`${squared ? "rounded-md" : ""} ${size === "lg" ? "w-[75px] h-[75px]" : ""}`}>
                <AvatarImage src={userData?.image} />
                <AvatarFallback>{userData?.name?.substring(0,2) || "user profile"}</AvatarFallback>
            </Avatar>
            <div>
                <h3 className={"capitalize font-bold text-sm"}>{userData?.name}</h3>
                {children}
            </div>
        </div>
    )
}

// display avatar
export default function DisplayAvatar ({
    userData,
    setLink = false,
    squared = false,
    size="sm",
    children
}) {
    const {user} = actorStore()
    const isUserHimself = (user?._id === userData?._id)
    
    if(setLink) {
        return (
            <Link href={`${isUserHimself ? "/profile" : `/user/${user?._id}`}`}>
                <CreateAvatar
                    userData={userData}
                    squared={squared}
                    size={size}
                >
                    {children}
                </CreateAvatar>
            </Link>
        )
    }
    
    return (
        <div>
            <CreateAvatar
                userData={userData}
                squared={squared}
                size={size}
            >
                {children}
            </CreateAvatar>
        </div>
    )
}