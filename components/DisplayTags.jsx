import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import actorStore from "@/stores/actorStore";
import DisplayDialogue from "@/components/DisplayDialogue";
import {PencilLine, X} from "lucide-react";
import {infoToast} from "@/helpers/toasts/toastNofifications";
import apiHandler from "@/helpers/api/apiHandler";
import {DELETE, routes} from "@/helpers/api/apiConstants";
import TagsForm from "@/app/(dashboard)/dashboard/tags/TagsForm";
import infoStore from "@/stores/infoStore";

// tags
export function Tags ({item}) {
    
    const {isAdmin, isModerator} = actorStore()
    const {getInitialData} = infoStore()
    
    return (
        <div className={"flex flex-col gap-2"}>
            <Link
                href={`/blogs/blog-by-tags/${item?._id}`}
                className={buttonVariants({
                    size: "tags",
                    variant: "tags"
                })}
            >
                #{item?.name}
            </Link>
            
            {/*controls for admin*/}
            {/*moderators can only view these buttons*/}
            <div>
                {
                    (isAdmin || isModerator) &&
                    <div className={"flex gap-2 justify-center px-2 py-1 bg-gray-300 rounded-md"}>
                        {/*update form*/}
                        <DisplayDialogue
                            trigger={
                                <Button size={"icon"} variant={"secondary"}><PencilLine size={18} /></Button>
                            }
                            title={"Update tags"}
                            description={"Update tags from here (ONLY FOR ADMIN)"}
                        >
                            {
                                isAdmin && <TagsForm data={item} />
                            }
                        </DisplayDialogue>
                        
                        {/*remove tag button*/}
                        <DisplayDialogue
                            title={"Are you sure ?"}
                            description={"This action cannot be undone"}
                            trigger={
                                <Button size={"icon"} variant={"secondary"}><X size={18}/></Button>
                            }
                        >
                            <div>
                                <h2 className={"pb-4"}>If this tag has any blog associated with it, then it cannot be removed. Consider updating it then.</h2>
                                <Button
                                    size={"lg"}
                                    variant={"destructive"}
                                    onClick={async () => {
                                        if(!isAdmin) return infoToast("Only an admin can update or remove a category")
                                        
                                        {/* remove tags */}
                                        const result = await apiHandler(
                                            `${routes.tags}/${item?._id}`,
                                            DELETE,
                                            {},
                                            true,
                                            true
                                        )
                                        if(result) await getInitialData()
                                    }}
                                >
                                    Remove
                                </Button>
                            </div>
                        </DisplayDialogue>
                    
                    </div>
                }
            </div>
        </div>
    )
}

// display tags
export function DisplayTags({items}) {
    return (
        <div className={"flex flex-wrap gap-2"}>
            {
                items?.map((item, index) => (
                    <Tags item={item} key={index} />
                ))
            }
        </div>
    )
}