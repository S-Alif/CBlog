import connectDB from "@/lib/db/dbConfig"
import { blogModel } from "@/lib/models/blog.model"
import {tagModel} from "@/lib/models/tags.model"
import { ApiError } from "@/lib/utils/api/response/apiError"
import { ApiResponse } from "@/lib/utils/api/response/apiResponse"
import { tagSchema } from "@/lib/utils/validator/validatorSchemas"
import mongoose from "mongoose"

await connectDB()

const tagService = {

    // create and update
    save: async (req, context) => {
        const data = await req?.json()

        const { params } = await context
        let tagId = null
        if (params) tagId = await params?.tagId

        const validate = tagSchema.validate(data)
        if (validate.error) {
            throw new ApiError(400, validate.error.message)
        }

        const existing = await tagModel.countDocuments(
            tagId ? { _id: { $ne: tagId }, name: data.name } : { name: data.name }
        )
        if (existing > 0) {
            throw new ApiError(400, "Tag already exists")
        }
 
        const saveTag = await tagModel.findByIdAndUpdate(
            { _id: tagId ? tagId : new mongoose.Types.ObjectId() },
            data,
            { upsert: true, new: true, runValidators: true }
        )

        return new ApiResponse(200, saveTag, "Category saved successfully")
    },

    // remove tag
    remove: async (req, context) => {
        const { params } = await context
        const { tagId } = await params 

        if (!tagId) {
            throw new ApiError(400, "Tag id is required")
        }

        const blogs = await blogModel.countDocuments({ tags: tagId })
        if (blogs > 0) {
            throw new ApiError(400, "Tag has blogs associated with it")
        }
        await tagModel.findByIdAndDelete({ _id: tagId })

        return new ApiResponse(200, {}, "Tag deleted successfully")
    },

    // get all tags
    getAll: async () => {
        const tags = await tagModel.find({})
        return new ApiResponse(200, tags, "Tags fetched successfully")
    }
}

export default tagService