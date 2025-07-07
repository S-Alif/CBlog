import {CLIENT_URL} from "@/lib/constants/envImports";
import {setParamsInUrl} from "@/helpers/set-params-in-url";
import apiHandler from "@/helpers/api/apiHandler";
import {GET, routes} from "@/helpers/api/apiConstants"
import {cookies} from "next/headers";
import {IndividualSection, PageSection} from "@/components/Sections";
import {DisplayBlogCards} from "@/components/DisplayBlogCards";


export const metadata = {
    title: "Manage all blogs"
}


// get the blogs
async function getBlogs (params){
    const url = `${CLIENT_URL}${routes.blog.admin}`
    // set the search params
    const newUrl = setParamsInUrl(url, params)
    
    const result = await apiHandler(
        url,
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
    const blogs = await getBlogs(params)
    
    return (
        <PageSection
            id={"blogs-dashboard-page"}
            className={"page-section !pt-10"}
        >
            <IndividualSection
                sectionId={"display-blog-list"}
                sectionTitle={"Manage all blogs"}
            >
                <DisplayBlogCards items={blogs?.blogs} />
            
            </IndividualSection>
        </PageSection>
    );
 }
