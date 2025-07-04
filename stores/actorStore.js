// cannot use the name "userStore"
// react thinks this is a hook and sometime creates problem

import {create} from "zustand";
import apiHandler from "@/helpers/api/apiHandler";
import {GET, routes} from "@/helpers/api/apiConstants";
import {roles} from "@/lib/constants/roleConstants";

const actorStore = create((set) => ({
    user: null,
    isAdmin: false,
    isModerator: false,
    userDashboard: null,
    adminDashboard: null,
    userPopularBlogs: [], // store some popular blogs for user
    userLatestBlogs: [], // store some latest blogs of user
    
    setData: (stateName, data) => {
        set({
            [stateName]: data
        })
    },
    
    // fetches user profile after login or after updating it
    setUser: async () => {
        const result = await apiHandler(
            routes.user.profile,
            GET,
            {},
            false,
            false
        )
        // console.log(result)
        if(result) {
            set({
                user: result,
                isAdmin: result?.roles.includes(roles.ADMIN),
                isModerator: result?.roles.includes(roles.MODERATOR),
            })
        }
    },
    
    // fetches user dashboard after login or refreshing it manually
    setUserDashboard: async () => {
        const result = await apiHandler(
            routes.dashboard.user,
            GET
        )
        // console.log(result)
        if(result) {
            set({
                userDashboard: result,
            })
        }
    },
    
    // fetches user dashboard after login or refreshing it manually
    setAdminDashboard: async () => {
        const result = await apiHandler(
            routes.dashboard.admin,
            GET
        )
        // console.log(result)
        if(result) {
            set({
                adminDashboard: result,
            })
        }
    },
    
    // logout user from client and server side
    logout: async () => {
        await apiHandler(
            routes.auth.logout,
            GET,
            {},
            true
        )
        set({
            user: null,
        })
        window.location.replace("/")
    }
}))

export default actorStore