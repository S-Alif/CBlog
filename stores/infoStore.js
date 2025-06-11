import {create} from "zustand";
import apiHandler from "@/helpers/api/apiHandler";
import {routes, GET} from "@/helpers/api/apiConstants";
import {SidebarInset} from "@/components/ui/sidebar";

const infoStore = create((set) => ({
    category: [],
    tags: [],
    siteDetails: null,

    // set method
    setInfo:(name, value) => {
        set({
            [name]: value,
        })
    },

    // get initial data
    getInitialData: async () => {
        const [category, tags] = await Promise.all([
            apiHandler(routes.category, GET),
            apiHandler(routes.tags, GET),
        ])

        // need to get site data when implemented
        console.log(category, tags)

        set({
            category: category,
            tags: tags
        })
    }
}))

export default infoStore