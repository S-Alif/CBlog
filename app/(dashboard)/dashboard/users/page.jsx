import {IndividualSection, PageSection} from "@/components/Sections";
import DisplayDialogue from "@/components/DisplayDialogue";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {FilterIcon} from "lucide-react";
import UserFilterOptions from "@/components/UserFilterOptions";
import {CLIENT_URL} from "@/lib/constants/envImports";
import {GET, routes} from "@/helpers/api/apiConstants";
import {setParamsInUrl} from "@/helpers/set-params-in-url";
import apiHandler from "@/helpers/api/apiHandler";
import {cookies} from "next/headers";
import DisplayUserCards from "@/components/DisplayUserCards";


export const metadata = {
    title: "Manage all users"
}

// get users
async function getUsers(params, searching){
    let url = `${CLIENT_URL}${routes.user.get}`
    
    // get the searched users
    if(searching) {
        url = `${CLIENT_URL}${routes.user.get}/search`
        
        const searchResult = await apiHandler(
            url,
            GET,
            {
                query: params?.search
            },
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


// user dashboard page
export default async function UserDashboardPage({searchParams}) {
    
    const params = await searchParams
    const searching = params?.search || null // get the search term or null
    
    let users
    
    if(searching) {
        users = await getUsers(params, true)
    }
    else {
        users = await getUsers(params)
    }
    
    return (
        <PageSection
            id={"user-dashboard-page"}
            className={"page-section !pt-10"}
        >
            <IndividualSection
                sectionId={"display-blog-list"}
                sectionTitle={"Manage all users"}
                sectionSideComponents={
                    <DisplayDialogue
                        title={"Filter users"}
                        description={"Filter all types users from here"}
                        trigger={
                            <Link
                                href={{
                                    pathname: "/dashboard/users",
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
                        <UserFilterOptions />
                    </DisplayDialogue>
                }
            >
                {/*display the users*/}
                <DisplayUserCards items={users?.users} />
            
            </IndividualSection>
        
        </PageSection>
    );
 }
