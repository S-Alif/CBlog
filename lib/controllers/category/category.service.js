import connectDB from "@/lib/db/dbConfig"
import { blogModel } from "@/lib/models/blog.model"
import { categoryModel } from "@/lib/models/category.model"
import { ApiResponse } from "@/lib/utils/api/response/apiResponse"
import { categorySchema } from "@/lib/utils/validator/validatorSchemas"
import mongoose from "mongoose"
import { ApiError } from "next/dist/server/api-utils"

await connectDB()

const categoryService = {
    // create and update
    save: async (req, context) => {
        // console.log(req)
        const data = await req?.json()
        const { params } = await context
        let categoryId = null
        if (params) categoryId = await params?.categoryId
        // console.log(categoryId, data)
        const validate = categorySchema.validate(data)

        if (validate.error) {
            throw new ApiError(400, validate.error.message)
        }

        const existing = await categoryModel.countDocuments(
            categoryId ? { _id: { $ne: categoryId }, name: data.name } : { name: data.name }
        )
        if (existing > 0) {
            throw new ApiError(400, "Category with this name already exists")
        }

        const saveCategory = await categoryModel.findByIdAndUpdate(
            { _id: categoryId ? categoryId : new mongoose.Types.ObjectId() },
            data,
            { upsert: true, new: true, runValidators: true }
        )

        return new ApiResponse(200, saveCategory, "Category saved successfully")
    },
    // remove
    remove: async (req, context) => {
        const { params } = await context
        const { categoryId } = await params

        if (!categoryId) {
            throw new ApiError(400, "Category id is required")
        }
        const blogs = await blogModel.countDocuments({ categoryId: categoryId })
        if (blogs > 0) {
            throw new ApiError(400, "Category has blogs associated with it")
        }

        await categoryModel.findByIdAndDelete({ _id: categoryId })

        return new ApiResponse(200, {}, "Category deleted successfully")
    },
    // get all
    getAll: async () => {
        const categories = await categoryModel.find({})
        return new ApiResponse(200, categories, "Categories fetched successfully")
    },
}

export default categoryService