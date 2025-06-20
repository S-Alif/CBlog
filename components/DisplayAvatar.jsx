import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";

function CreateAvatar ({user, squared = false, size="sm"}) {
    return (
        <div className={"flex gap-4 items-center"}>
            <Avatar className={`${squared ? "rounded-md" : ""} ${size == "lg" ? "w-[75px] h-[75px]" : ""}`}>
                <AvatarImage src={user?.image} />
                <AvatarFallback>{user?.name?.substring(0,2) || "user profile"}</AvatarFallback>
            </Avatar>
            <div>
                <h3 className={"capitalize fw-bold"}>{user?.name}</h3>
            </div>
        </div>
    )
}

// display avatar
export default function DisplayAvatar ({user, setLink = false, squared = false, size="sm"}) {
    
    if(setLink) {
        return (
            <Link href={`/user/${user?._id}`}>
                <CreateAvatar user={user} squared={squared} size={size} />
            </Link>
        )
    }
    
    return (
        <div>
            <CreateAvatar user={user} squared={squared} size={size} />
        </div>
    )
}