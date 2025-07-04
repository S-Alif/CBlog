import Link from "next/link";
import {ArrowRight, PencilLine, X} from "lucide-react"
import {Button, buttonVariants} from "@/components/ui/button";
import actorStore from "@/stores/actorStore";
import DisplayDialogue from "@/components/DisplayDialogue";
import CategoryForm from "@/app/(dashboard)/dashboard/category/CategoryForm";
import {infoToast} from "@/helpers/toasts/toastNofifications";

// category
export function Category ({item}) {
    
    const {isAdmin, isModerator} = actorStore()
    
    return (
        <div className={"max-w-[200px]"}>
            <div className={"aspect-square max-w-[200px] overflow-hidden rounded-md relative"}>
                <img
                    src={item?.image}
                    alt={item?.name}
                    className={"object-cover object-center w-full h-full block"}
                />
                
                {/*controls for admin*/}
                {
                    (isAdmin || isModerator) &&
                    <div className={"absolute top-2 right-2 bg-transparent flex gap-3"}>
                        {/*update form*/}
                        <DisplayDialogue
                            trigger={
                                <Button size={"icon"} variant={"secondary"}><PencilLine size={18} /></Button>
                            }
                            title={"Update Category"}
                            description={"Update category from here (ONLY FOR ADMIN)"}
                        >
                            {
                                isAdmin && <CategoryForm data={item}/>
                            }
                        </DisplayDialogue>
                        
                        {/*remove category button*/}
                        <Button
                            size={"icon"}
                            variant={"secondary"}
                            onClick={async () => {
                                if(!isAdmin) return infoToast("Only an admin can update or remove a category")
                            }}
                        >
                            <X size={18}/>
                        </Button>
                        
                    </div>
                }
            </div>
            <div className={"flex gap-2 justify-between items-center pt-4"}>
                <h4 className={"font-semibold"}>{item?.name}</h4>
                <Link
                    href={`/blogs/blog-by-category/${item?._id}`}
                    className={buttonVariants({
                        size: "icon",
                        variant: "outline",
                    })}
                >
                    <ArrowRight />
                </Link>
            </div>
        </div>
    )
}

// display categories
export function DisplayCategory({items = []}) {
    return (
        <div className={"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4"}>
            {
                items?.map((item, index) => (
                    <Category item={item} key={index} />
                ))
            }
            {
                items.length === 0 && <h2 className={"text-base font-medium"}>No data found</h2>
            }
        </div>
    );
}