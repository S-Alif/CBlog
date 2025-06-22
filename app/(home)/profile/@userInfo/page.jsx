// this is the dashboard for user
"use client"

// link buttons
import {IndividualSection} from "@/components/Sections";
import actorStore from "@/stores/actorStore";
import {Fragment, useEffect, useState} from "react";
import apiHandler from "@/helpers/api/apiHandler";
import {routes} from "@/helpers/api/apiConstants";
import {DisplayDataCards} from "@/components/DisplayDataCards";
import {DisplayBlogCards} from "@/components/DisplayBlogCards";


// profile top
export default function DashboardUser() {
    
    const {
        userDashboard,
        setUserDashboard,
        userPopularBlogs,
        userLatestBlogs,
        setData,
    } = actorStore()
    const [loading, setLoading] = useState(false)
    
    // blogs data
    const getBlogsData = async () => {
        const [popular, newest] = await Promise.all([
            apiHandler(`${routes.user.blogs}/?limit=4&sort=popular`),
            apiHandler(`${routes.user.blogs}/?limit=4`)
        ])
        // console.log(popular.blogs, newest.blogs)
        
        if(popular) setData("userPopularBlogs", popular?.blogs || [])
        if(newest) setData("userLatestBlogs", newest?.blogs || [])
    }
    
    // fetch user dashboard if there not fetched
    useEffect(() => {
        (async () => {
            if(userDashboard) return
            setLoading(true)
            await setUserDashboard()
            await getBlogsData()
            setLoading(false)
        })()
        
    }, [])
    
    
    return (
        <Fragment>
            <IndividualSection
                sectionId={"profile-top-data-cards"}
                loading={loading}
            >
                {/*data cards*/}
                <DisplayDataCards items={userDashboard?.cards || []} />
            
            </IndividualSection>
            
            {/*popular blogs*/}
            <IndividualSection
                className={"individual-section"}
                sectionId={"profile-top-popular-blogs"}
                sectionTitle={"Popular Blogs"}
                loading={loading}
            >
                <DisplayBlogCards items={userPopularBlogs} />
            
            </IndividualSection>
            
            {/*newest blogs*/}
            <IndividualSection
                className={"individual-section"}
                sectionId={"profile-top-newest-blogs"}
                sectionTitle={"Latest Blogs"}
                loading={loading}
            >
                <DisplayBlogCards items={userLatestBlogs} />
            
            </IndividualSection>
        </Fragment>
    )
}