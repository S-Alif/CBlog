"use client"

import {Card, CardContent, CardFooter} from "@/components/ui/card";
import DisplayAvatar from "@/components/DisplayAvatar";
import actorStore from "@/stores/actorStore";
import {format} from "date-fns";
import Link from "next/link"
import {Send, ChartNoAxesColumn, InfoIcon, SparkleIcon, XIcon} from "lucide-react"
import DisplayDialogue from "@/components/DisplayDialogue";
import {Category} from "@/components/DisplayCategory";
import {DisplayTags} from "@/components/DisplayTags";
import {usePathname, useRouter} from "next/navigation";
import BlogStatusForm from "@/components/BlogStatusForm";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import apiHandler from "@/helpers/api/apiHandler";
import {DELETE, routes} from "@/helpers/api/apiConstants";
import {infoToast} from "@/helpers/toasts/toastNofifications";
import {Textarea} from "@/components/ui/textarea";


// blog cards
export function BlogCards({item}) {
    
    const {user, isAdmin, isModerator} = actorStore()
    const pathname = usePathname()
    const isDashboard = pathname.includes("/dashboard/blogs")
    const router = useRouter()
    
    const [blog, setBlog] = useState(item)
    const [removeReason, setRemoveReason] = useState("")
    
    
    // status update
    const handleStatusUpdate = (result) => {
        setBlog(result)
    }
    
    // delete blogs
    const removeBlog = async () => {
        
        if(removeReason?.trim().length < 100) {
            return infoToast("Remove reason should be at least 100 characters")
        }
        
        const result = await apiHandler(
            `${routes.blog.blog}/${item._id}`,
            DELETE,
            {
                removeReason: removeReason
            },
            true,
            true
        )
        if(result) router.refresh()
    }
    
    
    return (
        <Card className={"py-3 shadow-lg"}>
            <CardContent className={"px-3 flex-grow"}>
                <div className={"aspect-video overflow-hidden rounded-md relative"}>
                    <img
                        src={blog?.image}
                        alt={blog?.name || "Blog image"}
                        className={"object-cover object-center w-full h-full"}
                    />
                    
                    <div className={"absolute top-2 right-2 flex gap-2"}>
                        {
                            blog?.isFeatured &&
                            <div className={"rounded-md w-9 h-9 bg-primary flex justify-center items-center"}>
                                <SparkleIcon color="#fff"/>
                            </div>
                        }
                        {
                            isAdmin &&
                            <DisplayDialogue
                                title={"Are you sure ?"}
                                description={"You want to delete this blog ? This cannot be undone"}
                                trigger={
                                    <Button
                                        size={"icon"}
                                        variant={"destructive"}
                                        title={"Remove the blog"}
                                    >
                                        <XIcon />
                                    </Button>
                                }
                            >
                                <div>
                                    <p className={"pb-5"}>If you delete this blog, it will be removed from the database
                                        and will be irrecoverable</p>
                                    
                                    <Textarea
                                        className={"mb-3"}
                                        placeholder={"Write remove reason in at least 100 characters"}
                                        value={removeReason}
                                        onChange={(e) => setRemoveReason(e.target.value)}
                                    />
                                    
                                    <Button
                                        size={"lg"}
                                        variant={"destructive"}
                                        onClick={removeBlog}
                                        title={"Remove the blog"}
                                    >
                                        Remove Blog
                                    </Button>
                                </div>
                            
                            </DisplayDialogue>}
                    
                    </div>
                </div>
                
                <h2 className={"py-4 font-bold text-base lg:text-lg"}>{blog?.name}</h2>
                <p className={"pb-4 text-balanced"}>{blog?.shortDesc}</p>
            </CardContent>
            <CardFooter className={"px-3"}>
                <div className={"flex items-center justify-between gap-4 bg-gray-100 w-full p-4 rounded-md"}>
                    <DisplayAvatar
                        userData={blog?.authorId}
                        squared={true}
                        setLink={true}
                    >
                        <p className={"text-sm text-gray-400"}>{format(blog?.createdAt, 'MMMM dd, yyyy')}</p>
                    </DisplayAvatar>
                    {/*options*/}
                    <div className={"flex items-center justify-between gap-4"}>
                        {/*blog status options*/}
                        {
                            ((isAdmin || isModerator) && isDashboard) &&
                            <DisplayDialogue
                                title={"Change blog status"}
                                trigger={
                                    <button className={"cursor-pointer"} title={"Change blog status"}>
                                        <InfoIcon size={18} />
                                    </button>
                                }
                            >
                                <BlogStatusForm data={blog} handleStatusUpdate={handleStatusUpdate} />
                            
                            </DisplayDialogue>
                        }
                        
                        {/*display blog details*/}
                        {
                            ((user?._id === blog?.authorId?._id) || (isAdmin || isModerator)) &&
                            <DisplayDialogue
                                title={"Blog details"}
                                description={`For - ${blog?.name}`}
                                trigger={
                                    <button className={"cursor-pointer"} title={"Blog information"}>
                                        <ChartNoAxesColumn size={18} />
                                    </button>
                                }
                            >
                                <h3 className={"text-7xl"}>{blog?.totalViews}</h3>
                                <div className={"pt-4"}>
                                    <h3 className={"font-bold text-base pb-4"}>Category</h3>
                                    <Category item={blog?.categoryId}/>
                                </div>
                                <div className={"pt-4"}>
                                    <DisplayTags items={blog?.tags} />
                                </div>
                            
                            </DisplayDialogue>
                        }
                        {/*link to the blog*/}
                        <Link href={`/blogs/${blog?._id}`} title={"Read the blog"}>
                            <Send size={18}/>
                        </Link>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}


// display blog cards
export function DisplayBlogCards({items = []}) {
    return (
        <div className={"w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"}>
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