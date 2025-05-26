import { ApiResponse } from "@/lib/utils/api/response/apiResponse"

const categoryService = {
    // create and update
    save: async (req) => {
        console.log("categoryService.save")
        const data = await req.json()
        return new ApiResponse(200, data, "Category saved successfully")
    },
    // remove
    remove: async (req) => {

    },
    // get all
    getAll: async () => {

    },
}

export default categoryService