import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

// tags
export function Tags ({item}) {
    return (
        <Link
            href={`/blogs/blog-by-tags/${item?._id}`}
            className={buttonVariants({
                size: "tags",
                variant: "tags"
            })}
        >
            #{item?.name}
        </Link>
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