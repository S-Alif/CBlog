"use client"

import {Fragment, useEffect, useState} from "react";
import actorStore from "@/stores/actorStore";
import {IndividualSection} from "@/components/Sections";
import {DisplayDataCards} from "@/components/DisplayDataCards";
import BarCharts from "@/components/charts/BarCharts";


// dashboard page
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
        // console.log(adminDashboard, isAdmin, isModerator)
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
            >
                <DisplayDataCards items={adminDashboard?.cards || []} />
            
            </IndividualSection>
            
            <IndividualSection
                sectionId={"dashboard-graphs"}
                loading={loading}
                sectionTitle={"Data visuals"}
                className={"individual-section pb-20"}
            >
                <div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
                    {
                        adminDashboard?.graphs?.map((chart, index) => (
                            <BarCharts
                                key={index}
                                data={chart?.data}
                                chartCaption={chart?.name}
                                nameKey={"name"}
                                dataKey={"count"}
                            />
                        ))
                    }
                </div>
            </IndividualSection>
            
        </Fragment>
    )
}