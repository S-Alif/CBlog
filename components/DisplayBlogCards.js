import {Card, CardContent, CardFooter} from "@/components/ui/card";
import DisplayAvatar from "@/components/DisplayAvatar";
import actorStore from "@/stores/actorStore";
import {format} from "date-fns";
import Link from "next/link"
import {Send, ChartNoAxesColumn} from "lucide-react"

export function BlogCards({item}) {
    
    const {user} = actorStore()
    
    return (
        <Card className={"py-3 shadow-lg"}>
            <CardContent className={"px-3"}>
                <div className={"aspect-video overflow-hidden rounded-md"}>
                    <img
                        src={item?.image}
                        alt={item?.name || "Blog image"}
                        className={"object-cover object-center w-full h-full"}
                    />
                </div>
                
                <h2 className={"py-4 font-bold text-base lg:text-lg"}>{item?.name}</h2>
                <p className={"pb-4 text-balanced"}>{item?.shortDesc}</p>
            </CardContent>
            <CardFooter className={"px-3"}>
                <div className={"flex items-center justify-between gap-4 bg-gray-100 w-full p-4 rounded-md"}>
                    <DisplayAvatar
                        user={item?.authorId}
                        squared={true}
                        setLink={true}
                    >
                        <p className={"text-sm text-gray-400"}>{format(item?.createdAt, 'MMMM dd, yyyy')}</p>
                    </DisplayAvatar>
                    {/*options*/}
                    <div className={"flex items-center justify-between gap-4"}>
                        {
                            (user?._id === item?.authorId?._id) &&
                            <button className={"cursor-pointer"}>
                                <ChartNoAxesColumn />
                            </button>
                        }
                        <Link href={`/blog/${item?._id}`}>
                            <Send size={18} />
                        </Link>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}


// display blogs
export function DisplayBlogCards({items = []}) {
    return (
        <div className={"w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"}>
            {
                items.map((item, index) => (
                    <BlogCards item={item} key={index}/>
                ))
            }
            {
                items.length === 0 &&
                <h3 className={"font-bold text-2xl text-center"}>No Blogs to show</h3>
            }
        </div>
    )
}