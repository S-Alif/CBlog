import {CLIENT_URL} from "@/lib/constants/envImports";
import {setParamsInUrl} from "@/helpers/set-params-in-url";
import apiHandler from "@/helpers/api/apiHandler";
import {GET, routes} from "@/helpers/api/apiConstants"
import {cookies} from "next/headers";
import {IndividualSection, PageSection} from "@/components/Sections";
import {DisplayBlogCards} from "@/components/DisplayBlogCards";
import BlogFilterOptions from "@/components/BlogFilterOptions";
import DisplayDialogue from "@/components/DisplayDialogue";
import {FilterIcon} from "lucide-react";
import {Button, buttonVariants} from "@/components/ui/button";
import Link from "next/link";


export const metadata = {
    title: "Manage all blogs"
}


// get the blogs
async function getBlogs (params, searching = null){
    let url = `${CLIENT_URL}${routes.blog.admin}`
    
    // get the searched blogs
    if(searching) {
        url = `${CLIENT_URL}${routes.blog.blog}/search`
        const newUrl = setParamsInUrl(url, params)
        
        const searchResult = await apiHandler(
            newUrl,
            GET,
            {},
            false,
            false,
            {
                headers: {
                    Cookie: await cookies()
                }
            }
        )
        
        if(searchResult) return searchResult
        return []
    }
    
    // get the queried blogs
    // set the search params
    const newUrl = setParamsInUrl(url, params)
    
    const result = await apiHandler(
        newUrl,
        GET,
        {},
        false,
        false,
        {
            headers: {
                Cookie: await cookies()
            }
        }
    )
    if(result) return result
    return []
}

// dashboard page
export default async function BlogDashboard({searchParams}) {
    const params = await searchParams
    const searching = params?.search || null // get the search term or null
    let blogs
    
    if(searching) {
        blogs = await getBlogs(params, true)
    }
    else {
        blogs = await getBlogs(params)
    }
    
    
    return (
        <PageSection
            id={"blogs-dashboard-page"}
            className={"page-section !pt-10"}
        >
            <IndividualSection
                sectionId={"display-blog-list"}
                sectionTitle={"Manage all blogs"}
                sectionSideComponents={
                    <DisplayDialogue
                        title={"Filter blogs"}
                        description={"Filter all types blogs from here"}
                        trigger={
                            <Link
                                href={{
                                    pathname: "/dashboard/blogs",
                                    query: {
                                        ...params,
                                    }
                                }}
                                className={buttonVariants({size: "icon", variant: "outline"})}
                                title={"Filter options toggle"}
                            >
                                <FilterIcon />
                            </Link>
                        }
                    >
                        <BlogFilterOptions />
                    </DisplayDialogue>
                }
            >
                <DisplayBlogCards items={blogs?.blogs} />
                
            </IndividualSection>
        </PageSection>
    );
 }
