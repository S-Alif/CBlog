import { roles } from '../../constants/roleConstants'
import { controllerHandler } from '../../utils/api/controllerHandler'
import { requireAuth } from '../../utils/api/requireAuth'
import blogService from './blog.service'

const blogController = {
	saveBlog: controllerHandler(requireAuth(blogService.saveBlog, [roles.USER])),

	changeBlogStatus: controllerHandler(requireAuth(blogService.changeBlogStatus, [roles.ADMIN, roles.MODERATOR])),
	removeBlog: controllerHandler(requireAuth(blogService.removeBlog, [roles.USER, roles.ADMIN])),

	getBlogById: controllerHandler(blogService.getBlogById),
	getAllBlogsByUser: controllerHandler(requireAuth(blogService.getAllBlogsByUser, [roles.USER, roles.ADMIN, roles.MODERATOR])),

	getAllBlogsForUsers: controllerHandler(blogService.getAllBlogs),
	getAllBlogsForAdmin: controllerHandler(requireAuth(blogService.getAllBlogs, [roles.ADMIN, roles.MODERATOR])),

	searchBlogs: controllerHandler(blogService.searchBlogs),
	incrementViewCount: controllerHandler(blogService.incrementViewCount)
}

export default blogController