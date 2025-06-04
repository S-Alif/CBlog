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

	userDashboard: async (req) => {

	}

}

export default dashboardService