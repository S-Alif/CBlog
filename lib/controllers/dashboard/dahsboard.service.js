import { roles } from '../../constants/roleConstants'
import { blogModel } from '../../models/blog.model'
import { categoryModel } from '../../models/category.model'
import { tagModel } from '../../models/tags.model'
import { userModel } from '../../models/user.model'
import { ApiError } from '../../utils/api/response/apiError'
import { ApiResponse } from '../../utils/api/response/apiResponse'

const monthNames = ["", "January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"]

const dashboardService = {

	// admin dashboard data
	adminDashboard: async (req) => {
		const role = req.roles
		if (!role || !role?.includes(roles.ADMIN)) throw new ApiError(403, "Forbidden")

		// admin dashboard cards
		const [
			totalUsers,
			totalAdmins,
			totalModerators,
			totalCategories,
			totalTags,
			totalBlogs,
			publishedBlogs,
			blockedBlogs,
			featuredBlogs,
			usersPerMonth,
			blogsPerMonth,
			blogsByCategory,
			blogsByTag
		] = await Promise.all([
			userModel.countDocuments(),
			userModel.countDocuments({ roles: roles.ADMIN }),
			userModel.countDocuments({ roles: roles.MODERATOR }),
			categoryModel.countDocuments(),
			tagModel.countDocuments(),
			blogModel.countDocuments(),
			blogModel.countDocuments({ isPublished: true }),
			blogModel.countDocuments({ isBlocked: true }),
			blogModel.countDocuments({ isFeatured: true }),
			userModel.aggregate([
				{
					$group: {
						_id: { $month: "$createdAt" },
						count: { $sum: 1 }
					}
				},
				{ $sort: { "_id": 1 } }
			]),
			blogModel.aggregate([
				{
					$group: {
						_id: { $month: "$createdAt" },
						count: { $sum: 1 }
					}
				},
				{ $sort: { "_id": 1 } }
			]),
			blogModel.aggregate([
				{
					$group: {
						_id: "$categoryId",
						count: { $sum: 1 }
					}
				},
				{
					$lookup: {
						from: "categories",
						localField: "_id",
						foreignField: "_id",
						as: "category"
					}
				},
				{
					$unwind: "$category"
				},
				{
					$project: {
						_id: 0,
						name: "$category.name",
						count: 1
					}
				}
			]),
			blogModel.aggregate([
				{ $unwind: "$tags" },
				{
					$group: {
						_id: "$tags",
						count: { $sum: 1 }
					}
				},
				{
					$lookup: {
						from: "tags",
						localField: "_id",
						foreignField: "_id",
						as: "tag"
					}
				},
				{ $unwind: "$tag" },
				{
					$project: {
						_id: 0,
						name: "$tag.name",
						count: 1
					}
				}
			])
		])

		// cards
		const cards = [
			{ name: "Total Users", data: totalUsers },
			{ name: "Admins", data: totalAdmins },
			{ name: "Moderators", data: totalModerators },
			{ name: "Categories", data: totalCategories },
			{ name: "Tags", data: totalTags },
			{ name: "Total Blogs", data: totalBlogs },
			{ name: "Published Blogs", data: publishedBlogs },
			{ name: "Blocked Blogs", data: blockedBlogs },
			{ name: "Featured Blogs", data: featuredBlogs }
		]

		// graph data
		const graphs = [
			{
				name: "Users Per Month",
				data: usersPerMonth.map(item => ({ month: monthNames[item._id], count: item.count }))
			},
			{
				name: "Blogs Per Month",
				data: blogsPerMonth.map(item => ({ month: monthNames[item._id], count: item.count }))
			},
			{
				name: "Blogs by Category",
				data: blogsByCategory.map(item => ({ month: monthNames[item._id], count: item.count }))
			},
			{
				name: "Blogs by Tag",
				data: blogsByTag.map(item => ({ month: monthNames[item._id], count: item.count }))
			}
		]

		return new ApiResponse(200, { cards, graphs }, "Dashboard data fetched successfully")
	},

	// user dashboard data
	userDashboard: async (req, context) => {
		const role = req?.roles || []
		if (!role && (!role.includes(roles.ADMIN) || !role.includes(roles.MODERATOR))) {
			throw new ApiError(403, "Forbidden")
		}
		// check for user id
		let userId = await context?.params?.userId
		if (!userId) {
			// check params for user id
			userId = req?.id
			if (!userId) {
				throw new ApiError(400, "User ID is required")
			}
		}

		// cards
		const [totalBlogs, publishedBlogs, draftBlogs, totalViews] = await Promise.all([
			blogModel.countDocuments({ authorId: userId }),
			blogModel.countDocuments({ authorId: userId, isPublished: true }),
			blogModel.countDocuments({ authorId: userId, isPublished: false }),
			blogModel.aggregate([
				{ $match: { authorId: userId } },
				{ $group: { _id: null, total: { $sum: "$totalViews" } } }
			]).then(res => res[0]?.total || 0)
		])

		const cards = [
			{ name: "Total Blogs", data: totalBlogs },
			{ name: "Published Blogs", data: publishedBlogs },
			{ name: "Draft Blogs", data: draftBlogs },
			{ name: "Total Views", data: totalViews }
		]

		// will create graphs later when working on reactions

		return new ApiResponse(200, { cards, graphs: [] }, "User dashboard loaded")
	}

}

export default dashboardService