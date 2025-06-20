// this is the dashboard for user
"use client"

// link buttons
import {IndividualSection} from "@/components/Sections";
import actorStore from "@/stores/actorStore";
import {Fragment, useEffect, useState} from "react";
import apiHandler from "@/helpers/api/apiHandler";
import {routes} from "@/helpers/api/apiConstants";
import {DisplayDataCards} from "@/components/DisplayDataCards";


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
    const [popularBlogs, setPopularBlogs] = useState([])
    const [latestBlogs, setLatestBlogs] = useState([])
    
    // blogs data
    const getBlogsData = async () => {
        const [popular, newest] = await Promise.all([
            apiHandler(`${routes.user.blogs}/?limit=4&sort=popular`),
            apiHandler(`${routes.user.blogs}/?limit=4`)
        ])
        
        if(popular) setPopularBlogs(popular?.blogs || [])
        if(newest) setLatestBlogs(newest?.blogs || [])
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
                sectionId={"profile-top-data-cards"}
                sectionTitle={"Your Popular Blogs"}
                loading={loading}
            >
            
            
            
            </IndividualSection>
        </Fragment>
    )
}