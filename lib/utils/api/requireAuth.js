import { cookies } from "next/headers"
import { ApiError } from "./response/apiError"
import { verifyToken } from "../token/tokenHelper"

// this function is used to check if the user is authenticated
// if the user is authenticated, the user's id, roles, and email are added to the request object
// if the user is not authenticated, an error is thrown
// allowedRoles is an array of roles that are allowed to access the route
// if a route is not protected, this function will not be used

export const requireAuth = (handler, allowedRoles = []) => {
    return async (...args) => {
        const req = args[0]
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        // console.log(token)

        if (!token) {
            throw new ApiError(401, "Unauthorized")
        }
        const decoded = await verifyToken(token)
        if (!decoded) {
            throw new ApiError(401, "Unauthorized")
        }

        // console.log(decoded, allowedRoles)
        // console.log(decoded.roles, allowedRoles)
        if (allowedRoles && !allowedRoles.some((role) => decoded.roles.includes(role))) {
            throw new ApiError(403, "Forbidden")
        }

        req.id = decoded.id
        req.roles = decoded.roles
        req.email = decoded.email

        return handler(...args)
    }
}
