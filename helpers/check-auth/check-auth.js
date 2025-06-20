// lib/auth/checkAuth.js
import { cookies } from "next/headers"
import {verifyToken} from "@/lib/utils/token/tokenHelper";

// check auth for protected routes
export async function checkAuth(allowedRoles = []) {
    const cookieStore = await cookies()
    const token = await cookieStore.get("token")?.value
    // console.log(token)
    
    if (!token) return false
    const decoded = await verifyToken(token)
    // console.log(decoded)
    
    if(decoded){
        const userRoles = decoded.roles
        if (allowedRoles.some(role => userRoles.includes(role))) {
            return decoded
        }
        return false
    }
    return false
}
