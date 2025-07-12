"use client"

import infoStore from "@/stores/infoStore";
import actorStore from "@/stores/actorStore";
import {useEffect} from "react";


export default function DashboardLayout({children}) {
    
    const {getInitialData} = infoStore()
    const { setUser } = actorStore()
    
    useEffect(() => {
        if(typeof window !== "undefined") {
            getInitialData()
            setUser()
        }
    }, [])
    
    return children
 }
