"use client"

import React, {useEffect} from 'react';
import infoStore from "@/stores/infoStore";
import actorStore from "@/stores/actorStore";

export default function Dashboard() {
    
    const {getInitialData} = infoStore()
    const {setUser} = actorStore()
    
    useEffect(() => {
        if(typeof window !== "undefined") {
            getInitialData()
            setUser()
        }
    }, [])
    
    return (
        <div>
            dashboard
        </div>
    )
}