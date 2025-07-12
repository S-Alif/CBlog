import mongoose from 'mongoose'
import { blogModel } from '../../models/index'
import { ApiError } from '../../utils/api/response/apiError'
import { ApiResponse } from '../../utils/api/response/apiResponse'
import { blogAdminSchema, blogSchema, searchDataSchema } from '../../utils/validator/validatorSchemas'
import { roles } from '../../constants/roleConstants'
import { getSearchParams } from '../../utils/searchParams/getSearchParams'
import connectDB from '../../db/dbConfig'
import sendEmail from "@/lib/utils/mail/sendMail";
import adminChangeBlogStatus from "@/lib/utils/mail/templates/adminChangeBlogStatus";
import blogRemovalTemplate from "@/lib/utils/mail/templates/blogRemoval";
import {createSlug} from "@/lib/utils/handle-slugs";


await connectDB()

// get blogs
const getBlogs = async (query, sortOptions = { createdAt: -1 }, skip, limit) => {
    const blogs = await blogModel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .select("-blogContent -isBlocked -isPublished -updatedAt")
        .populate({ path: "categoryId", select: "name image" })
        .populate({ path: "tags", select: "name" })
        .populate({ path: "authorId", select: "name image" })


    const totalBlogs = await blogModel.countDocuments(query)
    const totalPages = Math.ceil(totalBlogs / limit)

    return { blogs, totalPages }
}


const blogService = {

    // create and update blog by user
    saveBlog: async (req, context) => {
        const data = await req?.json()
        const userId = req?.id // logged in user id
        // console.log("User ID:", userId)
        const { blogId = null } = await context?.params || {}

        if (!userId) throw new ApiError(401, 'Unauthorized')

        const validateData = blogSchema.validate(data)
        if (validateData.error) {
            throw new ApiError(400, validateData.error.message.replace(/\"/g, ''))
        }

        // check duplications
        const existingBlog = await blogModel.countDocuments({
            name: data?.name,
            ...(blogId ? { _id: { $ne: blogId } } : {})
        })

        if (existingBlog > 0) {
            throw new ApiError(400, 'Blog with this name already exists')
        }
        
        // remove slug from data if user tries to send it manually
        if ('slug' in data) delete data.slug
        
        // check if blog exists and set new slug
        let blogDoc = null
        let newBlogId = null
        
        if (blogId) {
            blogDoc = await blogModel.findOne({ _id: blogId, authorId: userId }).lean()
            if (!blogDoc) {
                throw new ApiError(404, 'Blog not found or you are not the author of this blog')
            }
            
            if (blogDoc?.name !== data?.name) {
                data.slug = createSlug(data.name, blogId)
            }
        }
        else {
            newBlogId = new mongoose.Types.ObjectId()
            data.authorId = userId
            data.slug = createSlug(data?.name, newBlogId.toString())
        }
        
        

        const saveBlog = await blogModel.findByIdAndUpdate(
            { _id: blogId ? blogId : newBlogId, authorId: userId },
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
        const role = req?.roles || [] // user role

        const isAdmin = role?.includes(roles.ADMIN)
        const isModerator = role?.includes(roles.MODERATOR)

        const { blogId } = await context?.params
        if (!blogId) throw new ApiError(400, 'Blog ID is required')

        const data = await req?.json()
        const validateData = blogAdminSchema.validate(data)
        if (validateData.error) {
            throw new ApiError(400, validateData.error.message.replace(/\"/g, ''))
        }

        if (!isAdmin && !isModerator) throw new ApiError(403, 'Forbidden: Only admin or moderator can change blog status')

        // check blog status
        // A blog can be blocked while already featured
        // A blog cannot be featured while being blocked
        const blogStatus = await blogModel.findOne({ _id: blogId }).select("isBlocked blockReason isFeatured").lean()
        
        if(!blogStatus) throw new ApiError(404, "Blog not found")
        if(blogStatus.isBlocked && data.isFeatured) throw new ApiError(400, "Blog status is blocked")
        
        // finally update blog
        const updatedBlog = await blogModel.findByIdAndUpdate({ _id: blogId }, data, {
            new: true,
            runValidators: true
        }).populate({
            path: "authorId",
            select: "name email"
        })
        if (!updatedBlog) throw new ApiError(404, 'Blog not found')
        
        const blogData = updatedBlog.toObject()
        
        // notifying author
        await sendEmail(
            blogData.authorId.email,
            adminChangeBlogStatus(
                blogData.authorId.name,
                blogData.name,
                blogData.isBlocked,
                blogData.blockReason,
                blogData.isFeatured
            ),
            `Blog status changed by an ${isAdmin ? "admin" : "moderator"}`
        )
        
        return new ApiResponse(200, blogData, "Blog status updated successfully")
    },

    // delete blog by user or admin
    removeBlog: async (req, context) => {
        const role = req?.roles // user role
        const userId = req?.id // logged-in user ID

        const { blogId = null } = context?.params || {}
        if (!blogId) throw new ApiError(400, 'Blog ID is required')
        
        // remove reason for admin removing the blog
        const data = await req?.json()

        const blog = await blogModel.findById({ _id: blogId })
            .populate({
                path: "authorId",
                select: "name email"
            }).lean()
        if (!blog) throw new ApiError(404, 'Blog not found')

        const isAdmin = role?.includes(roles.ADMIN)
        const isAuthor = blog.authorId?._id?.toString() === userId

        // console.log(role, blog, userId)

        if (!isAdmin && !isAuthor) {
            throw new ApiError(403, 'Forbidden: Only the blog author or an admin can delete the blog')
        }
        
        // admin needs to provide the reason to remove blog
        if(!isAuthor && isAdmin){
            const reason = data?.removeReason
            const invalidReason = !reason || typeof reason !== 'string' || reason.length < 100
            if(invalidReason){
                throw new ApiError(400, 'Cannot remove blog without remove reason')
            }
        }

        // remove blog
        await blogModel.findByIdAndDelete({ _id: blogId })
        
        // notify user
        await sendEmail(
            blog.authorId.email,
            blogRemovalTemplate(
                blog.authorId.name,
                blog.name,
                isAuthor ? "user" : "admin",
                isAdmin ? data?.removeReason : ""
            )
        )

        return new ApiResponse(200, {}, "Blog deleted successfully")
    },

    // get blog by id or slugs
    // changing the name will require me to change in a lot of places
    getBlogById: async (req, context) => {
        const { blogId, slug } = await context?.params
        if (!blogId) throw new ApiError(400, 'Blog ID is required')

        const role = req?.roles || [] // user role
        const isAdmin = role?.includes(roles.ADMIN)
        const isModerator = role?.includes(roles.MODERATOR)
        
        const isObjectId = mongoose.Types.ObjectId.isValid(blogId)

        const query = isObjectId ? { _id: blogId } : { slug: slug ? slug : blogId }
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
        const role = req?.roles || [] // user role
        const isAdmin = role?.includes(roles.ADMIN)
        const isModerator = role?.includes(roles.MODERATOR)
        const isUser = role?.includes(roles.USER) // checking for logged in

        // get search params
        const { page, sort = "newest", limit } = getSearchParams(req)

        // console.log("context:"+await context?.params?.userId)
        // console.log("request:"+req?.id)
        const userId = await context?.params?.userId || req?.id
        if (!userId) throw new ApiError(400, "User ID is required")

        if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "Invalid User ID")

        const query = {authorId: userId}
        if (!isAdmin && !isModerator && !isUser) {
            query.isPublished = true // only published blogs for users
            query.isBlocked = false // not blocked blogs for users
        }
        else {
            if(sort === "published") query.isPublished = true
            if(sort === "blocked") query.isBlocked = false
        }
        
        if(sort === "featured") {
            query.isFeatured = true
        }

        const pageNum = parseInt(page) || 1
        const pageLimit = limit && parseInt(limit) < 20 ? limit : 20
        const skip = (pageNum - 1) * pageLimit

        let sortOption = { createdAt: -1 }
        if (sort === "popular") {
            sortOption = { totalViews: -1 }
        }

        const { blogs, totalPages } = await getBlogs(query, sortOption, skip, pageLimit)
        // console.log(query, sortOption)
        return new ApiResponse(200, { blogs, totalPages }, "Blogs fetched successfully")
    },

    // get all blogs - for cards - will be sorted by featured, popular and recent and category and tags
    // users will not see unpublished or blocked blogs in the public view
    // Admin and moderator can see all blogs in the dashboard
    getAllBlogs: async (req) => {
        const role = req?.roles || []
        // console.log("User roles:", role)
        const isAdmin = role.includes(roles.ADMIN)
        const isModerator = role.includes(roles.MODERATOR)

        const { page, limit = 20, sort = "recent", category = "all", tag = "all", published = "all", blocked = "all" } = getSearchParams(req)

        // console.log("Search Params:", { page, sort, category, tag, published, blocked })
        // query
        const query = {}
        if (!isAdmin && !isModerator) {
            query.isPublished = true
            query.isBlocked = false
        }
        else {
            // console.log("Admin or Moderator detected")
            if (published === "yes") query.isPublished = true
            if (published === "no") query.isPublished = false
            if (blocked === "yes") query.isBlocked = true
            if (blocked === "no") query.isBlocked = false
        }

        // filters
        if (category !== "all") {
            if (!mongoose.isValidObjectId(category)) throw new ApiError(400, "Invalid Category ID")
            query.categoryId = category
        }

        if (tag !== "all") {
            if (!mongoose.isValidObjectId(tag)) throw new ApiError(400, "Invalid Tag ID")
            query.tags = tag
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
        const pageLimit = limit && parseInt(limit) <= 60 ? limit : 20
        const skip = (pageNum - 1) * pageLimit

        if (pageLimit > 60) {
            throw new ApiError(400, "Page limit cannot be more than 60")
        }
        // console.log(query)

        const { blogs, totalPages } = await getBlogs(query, sortOption, skip, pageLimit)

        return new ApiResponse(200, { blogs, totalPages }, "Blogs fetched successfully")
    },

    // search a blog by name
    searchBlogs: async (req) => {
        const role = req?.roles || []
        const isAdmin = role.includes(roles.ADMIN)
        const isModerator = role.includes(roles.MODERATOR)

        const { page, search= "" } = getSearchParams(req)

        const validateData = searchDataSchema.validate({search})
        if (validateData?.error) {
            throw new ApiError(400, validateData.error.message)
        }

        const pageNum = parseInt(page) || 1
        const pageLimit = 40
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