import { blogModel } from '../../models/blog.model'


const blogService = {

    // create and update blog by user
    saveBlog: async (req, context) => {

    },

    // change blog status by admin or moderator
    changeBlogStatus: async (req, context) => {

    },

    // delete blog by user or admin
    removeBlog: async (req, context) => {

    },

    // get blog by id
    getBlogById: async (req, context) => {

    },

    // get all blogs by user - will be sorted by popular and recent
    // A user / admin / moderator can see all types of user's blogs in the dashboard(user)
    getAllBlogsByUser: async (req, context) => {

    },

    // get all blogs - for cards - will be sorted by featured, popular and recent and category and tags
    // users will not see unpublished or blocked blogs in the public view
    // Admin and moderator can see all blogs in the dashboard
    getAllBlogs: async (req, context) => {

    },

    // search a blog by name
    searchBlogs: async (req, context) => {

    },

    // increase view count of a blog
    incrementViewCount: async (req, context) => {
        const { blogId } = await context?.params
        await blogModel.findByIdAndUpdate(blogId, { $inc: { totalViews: 1 } })
    }
}

export default blogService