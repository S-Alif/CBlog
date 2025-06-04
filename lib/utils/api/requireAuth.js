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

        // If no token is found and roles are specified, throw an unauthorized error
        if (!token && allowedRoles.length > 0) {
            throw new ApiError(401, "Unauthorized")
        }
        const decoded = await verifyToken(token)

        // If the token is invalid or expired and roles are specified, throw an unauthorized error
        if (!decoded && allowedRoles.length > 0) {
            throw new ApiError(401, "Unauthorized")
        }

        // If no roles are specified, allow access to all users
        // This is needed to reduce writing more controllers and services for each single use
        // This is for when we need to attach some remove or add some specific data based on the user roles
        // check "getUserById" in user.controller.js to see how it is working
        if (allowedRoles.length === 0) {
            if (decoded) {
                req.id = decoded.id
                req.roles = decoded.roles
                req.email = decoded.email
            }
            return handler(...args)
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
