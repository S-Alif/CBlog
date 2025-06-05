import mongoose from 'mongoose'
import { blogModel } from '../../models/index'
import { ApiError } from '../../utils/api/response/apiError'
import { ApiResponse } from '../../utils/api/response/apiResponse'
import { blogAdminSchema, blogSchema, searchDataSchema } from '../../utils/validator/validatorSchemas'
import { roles } from '../../constants/roleConstants'
import { getSearchParams } from '../../utils/searchParams/getSearchParams'
import connectDB from '../../db/dbConfig'


await connectDB()

// get blogs
const getBlogs = async (query, sortOptions = { createdAt: -1 }, skip, limit) => {
    const blogs = await blogModel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate({ path: "categoryId", select: "name image" })
        .populate({ path: "tags", select: "name" })
        .populate({ path: "authorId", select: "name image" })
        .lean()

    const totalBlogs = await blogModel.countDocuments(query)
    const totalPages = Math.ceil(totalBlogs / limit)

    return { blogs, totalPages }
}


const blogService = {

    // create and update blog by user
    saveBlog: async (req, context) => {
        const data = await req?.json()
        const userId = req?.id // logged in user id
        const { blogId = null } = await context?.params || {}

        if (!userId) throw new ApiError(401, 'Unauthorized')

        const validateData = blogSchema.validate(data)
        if (validateData.error) {
            throw new ApiError(400, validateData.error.message)
        }

        // check duplications
        const existingBlog = await blogModel.countDocuments({
            name: data?.name,
            ...(blogId ? { _id: { $ne: blogId } } : {})
        })

        if (existingBlog > 0) {
            throw new ApiError(400, 'Blog with this name already exists')
        }

        const saveBlog = await blogModel.findByIdAndUpdate(
            { _id: blogId ? blogId : new mongoose.Types.ObjectId() },
            data,
            {
                new: true,
                upsert: true, // create if not exists
                runValidators: true,
                setDefaultsOnInsert: true,
                lean: true
            }
        ).populate({
            path: 'categoryId',
            select: 'name'
        }).populate({
            path: 'tags',
            select: 'name'
        })

        return new ApiResponse(200, saveBlog, "Blog saved successfully")
    },

    // change blog status by admin or moderator
    changeBlogStatus: async (req, context) => {
        const role = req?.role || [] // user role

        const isAdmin = role?.includes(roles.ADMIN)
        const isModerator = role?.includes(roles.MODERATOR)

        const { blogId } = await context?.params
        if (!blogId) throw new ApiError(400, 'Blog ID is required')

        const data = await req?.json()
        const validateData = blogAdminSchema.validate(data)
        if (validateData.error) {
            throw new ApiError(400, validateData.error.message)
        }

        if (!isAdmin && !isModerator) throw new ApiError(403, 'Forbidden: Only admin or moderator can change blog status')

        const updatedBlog = await blogModel.findByIdAndUpdate({ _id: blogId }, data, {
            new: true,
            runValidators: true,
            lean: true
        })

        if (!updatedBlog) throw new ApiError(404, 'Blog not found')

        return new ApiResponse(200, updatedBlog, "Blog status updated successfully")
    },

    // delete blog by user or admin
    removeBlog: async (req, context) => {
        const role = req?.role // user role
        const userId = req?.id // logged-in user ID

        const { blogId } = context?.params || {}
        if (!blogId) throw new ApiError(400, 'Blog ID is required')

        const blog = await blogModel.findById({ _id: blogId }).select('authorId').toLean()
        if (!blog) throw new ApiError(404, 'Blog not found')

        const isAdmin = role?.includes(roles.ADMIN)
        const isAuthor = blog.authorId.toString() === userId.toString()

        if (!isAdmin && !isAuthor) {
            throw new ApiError(403, 'Forbidden: Only the blog author or an admin can delete the blog')
        }

        await blogModel.findByIdAndDelete({ _id: blogId })

        return new ApiResponse(200, {}, "Blog deleted successfully")
    },

    // get blog by id
    getBlogById: async (req, context) => {
        const { blogId } = await context?.params
        if (!blogId) throw new ApiError(400, 'Blog ID is required')

        const role = req?.role || [] // user role
        const isAdmin = role?.includes(roles.ADMIN)
        const isModerator = role?.includes(roles.MODERATOR)

        const query = { _id: blogId }
        if (!isAdmin && !isModerator) {
            query.isPublished = true // only published blogs for users
            query.isBlocked = false // not blocked blogs for users
        }

        const blog = await blogModel.find(query)
            .populate({
                path: 'categoryId',
                select: 'name image'
            })
            .populate({
                path: 'tags',
                select: 'name'
            })
            .populate({
                path: 'authorId',
                select: 'name image'
            })

        if (!blog) throw new ApiError(404, 'Blog not found')
        return new ApiResponse(200, blog, "Blog fetched successfully")
    },

    // get all blogs by user - can be sorted by popular and recent
    // A user / admin / moderator can see all types of user's blogs in the dashboard(user)
    getAllBlogsByUser: async (req, context) => {
        const role = req?.role || [] // user role
        const isAdmin = role?.includes(roles.ADMIN)
        const isModerator = role?.includes(roles.MODERATOR)

        // get search params
        const { page, sort = "newest" } = getSearchParams(req)

        const userId = await context?.params?.userId || req?.id
        if (!userId) throw new ApiError(400, "User ID is required")

        if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "Invalid User ID")

        const query = { _id: blogId }
        if (!isAdmin && !isModerator) {
            query.isPublished = true // only published blogs for users
            query.isBlocked = false // not blocked blogs for users
        }

        const pageNum = parseInt(page) || 1
        const pageLimit = 20
        const skip = (pageNum - 1) * pageLimit

        let sortOption = { createdAt: -1 }
        if (sort === "popular") {
            sortOption = { totalViews: -1 }
        }

        const { blogs, totalPages } = await getBlogs(query, sortOption, skip, pageLimit)

        return new ApiResponse(200, { blogs, totalPages }, "Blogs fetched successfully")
    },

    // get all blogs - for cards - will be sorted by featured, popular and recent and category and tags
    // users will not see unpublished or blocked blogs in the public view
    // Admin and moderator can see all blogs in the dashboard
    getAllBlogs: async (req) => {
        const role = req?.role || []
        const isAdmin = role.includes(roles.ADMIN)
        const isModerator = role.includes(roles.MODERATOR)

        const { page, sort = "recent", categoryId, tagId } = getSearchParams(req)

        // query
        const query = {}
        if (!isAdmin && !isModerator) {
            query.isPublished = true
            query.isBlocked = false
        }

        // filters
        if (categoryId) {
            if (!mongoose.isValidObjectId(categoryId)) throw new ApiError(400, "Invalid Category ID")
            query.categoryId = categoryId
        }

        if (tagId) {
            if (!mongoose.isValidObjectId(tagId)) throw new ApiError(400, "Invalid Tag ID")
            query.tags = tagId
        }

        // Sorting
        let sortOption = { createdAt: -1 } // default: recent
        if (sort === "popular") {
            sortOption = { totalViews: -1 }
        }
        else if (sort === "featured") {
            sortOption = { isFeatured: -1, createdAt: -1 }
        }

        // Pagination
        const pageNum = parseInt(page) || 1
        const pageLimit = 60
        const skip = (pageNum - 1) * pageLimit

        const { blogs, totalPages } = await getBlogs(query, sortOption, skip, pageLimit)

        return new ApiResponse(200, { blogs, totalPages }, "Blogs fetched successfully")
    },

    // search a blog by name
    searchBlogs: async (req) => {
        const role = req?.role || []
        const isAdmin = role.includes(roles.ADMIN)
        const isModerator = role.includes(roles.MODERATOR)

        const { page } = getSearchParams(req)

        const data = await req?.json() || ""
        const validateData = searchDataSchema.validate(data)
        if (validateData.error) {
            throw new ApiError(400, validateData.error.message)
        }

        const pageNum = parseInt(page) || 1
        const pageLimit = 20
        const skip = (pageNum - 1) * pageLimit

        const query = {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { shortDesc: { $regex: search, $options: "i" } },
                { blogContent: { $regex: search, $options: "i" } }
            ]
        }

        if (!isAdmin && !isModerator) {
            query.isPublished = true
            query.isBlocked = false
        }

        const sortOptions = { createdAt: -1 } // default sort by recent
        const { blogs, totalPages } = await getBlogs(query, sortOptions, skip, pageLimit)

        return new ApiResponse(200, { blogs, totalPages }, "Search completed")
    },

    // increase view count of a blog
    incrementViewCount: async (req, context) => {
        const { blogId } = await context?.params
        await blogModel.findByIdAndUpdate({ _id: blogId }, { $inc: { totalViews: 1 } })
    }
}

export default blogService