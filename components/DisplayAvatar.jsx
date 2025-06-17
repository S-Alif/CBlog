import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";

function CreateAvatar ({user}) {
    return (
        <div className={"flex gap-4 items-center"}>
            <Avatar>
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
export default function DisplayAvatar ({user, setLink = false}) {
    
    if(setLink) {
        return (
            <Link href={`/user/${user?._id}`}>
                <CreateAvatar user={user} />
            </Link>
        )
    }
    
    return (
        <div>
            <CreateAvatar user={user} />
        </div>
    )
}