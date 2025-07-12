"use client"

import {useRouter, useSearchParams} from "next/navigation";

export default function useUpdateSearchParams() {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    // Get all current params as an object
    const params = {}
    for (const [key, value] of searchParams.entries()) {
        params[key] = value
    }
    
    // Function to update a param
    const updateParams = (key, value) => {
        const newParams = new URLSearchParams(searchParams)
        
        if (!value || value === "default") {
            newParams.delete(key)
        } else {
            newParams.set(key, value)
        }
        
        router.replace(`?${newParams.toString()}`, { scroll: false })
    }
    
    return { params, updateParams }
 }
