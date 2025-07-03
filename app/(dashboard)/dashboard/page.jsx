"use client"

import { useEffect} from 'react';
import infoStore from "@/stores/infoStore";
import actorStore from "@/stores/actorStore";
import DashboardPage from "@/app/(dashboard)/dashboard/DashboardPage";

export default function Dashboard() {
    
    const {getInitialData} = infoStore()
    const { setUser } = actorStore()
    
    useEffect(() => {
        if(typeof window !== "undefined") {
            getInitialData()
            setUser()
        }
    }, [])
    
    return (
        <DashboardPage />
    )
}