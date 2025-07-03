"use client"

import {Fragment, useEffect, useState} from "react";
import actorStore from "@/stores/actorStore";
import {IndividualSection} from "@/components/Sections";
import {DisplayDataCards} from "@/components/DisplayDataCards";

export default function DashboardPage () {
    
    const [loading, setLoading] = useState(false)
    const {
        user,
        isAdmin,
        isModerator,
        setAdminDashboard,
        adminDashboard
    } = actorStore()
    
    // get the admin dashboard
    const getAdminDashboards = async () => {
        setLoading(true)
        await setAdminDashboard()
        setLoading(false)
    }
    
    useEffect(() => {
        console.log(adminDashboard, isAdmin, isModerator)
        if(typeof window !== "undefined") {
            if(!isAdmin && !isModerator && adminDashboard != null) return
            getAdminDashboards()
        }
    }, [user])
    
    return (
        <Fragment>
            <IndividualSection
                sectionId={"dashboard-summary"}
                loading={loading}
                sectionTitle={"Summary"}
                className={"w-full"}
            >
                <DisplayDataCards items={adminDashboard?.cards || []} />
            
            </IndividualSection>
            
            
        </Fragment>
    )
}