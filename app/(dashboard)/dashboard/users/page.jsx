import {IndividualSection, PageSection} from "@/components/Sections";
import DisplayDialogue from "@/components/DisplayDialogue";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {FilterIcon} from "lucide-react";
import UserFilterOptions from "@/components/UserFilterOptions";


export default async function UserDashboardPage({searchParams}) {
    
    const params = await searchParams
    const searching = params?.search || null // get the search term or null
    
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
            
            </IndividualSection>
        
        </PageSection>
    );
 }
