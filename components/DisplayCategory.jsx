import Link from "next/link";
import {ArrowRight} from "lucide-react"
import {buttonVariants} from "@/components/ui/button";

// category
export function Category ({item}) {
    return (
        <div className={"max-w-[200px]"}>
            <div className={"aspect-square max-w-[200px] overflow-hidden rounded-md"}>
                <img
                    src={item?.image}
                    alt={item?.name}
                    className={"object-cover object-center w-full h-full block"}
                />
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
export function DisplayCategory() {
    return (
        <div></div>
    );
}