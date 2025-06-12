// cannot use the name "userStore"
// react thinks this is a hook and sometime creates problem

import {create} from "zustand";
import apiHandler from "@/helpers/api/apiHandler";
import {GET, routes} from "@/helpers/api/apiConstants";

const actorStore = create((set) => ({
    user: null,
    
    // fetches user profile after login or after updating it
    setUser: async () => {
        const result = await apiHandler(
            routes.user.profile,
            GET
        )
        if(result) {
            set({
                user: result.user,
            })
        }
    },
    
    // logout user from client and server side
    logout: async () => {
        await apiHandler(
            routes.auth.logout,
            GET
        )
        set({
            user: null,
        })
    }
}))

export default actorStore