import { roles } from "@/lib/constants/roleConstants"
import connectDB from "@/lib/db/dbConfig"
import { userModel } from "@/lib/models/index"
import { ApiError } from "@/lib/utils/api/response/apiError"
import { ApiResponse } from "@/lib/utils/api/response/apiResponse"
import { getSearchParams } from "@/lib/utils/searchParams/getSearchParams"
import {userUpdateByAdminAndModeratorSchema, userUpdateSchema} from "@/lib/utils/validator/validatorSchemas"
import mongoose from "mongoose"
import { cookies } from 'next/headers'

await connectDB()


const userService = {
    //update - by user
    userUpdate: async (req) => {
        const data = await req?.json()
        const id = req?.id
        const role = req?.roles

        if (!role || !id) {
            throw new ApiError(401, "Please login to update your profile")
        }
        const validate = userUpdateSchema.validate(data)
        if (validate?.error) {
            throw new ApiError(400, validate.error.message)
        }

        // remove email from data
        if (data?.email) delete data?.email
        if (data?.approveCreds) delete data?.approveCreds
        if(data?.pass && data?.pass.length < 8) delete data?.pass

        const saveUser = await userModel.findById({ _id: id })
        if (!saveUser) {
            throw new ApiError(404, "User not found")
        }
        saveUser.set(data)
        await saveUser.save()

        const user = await userModel.findById({ _id: id }).select("-pass")

        return new ApiResponse(200, user, "User saved successfully")
    },

    // update statuses by admin and moderator
    updateUserStatusByAdminAndModerator: async (req, context) => {
        const data = await req?.json()
        const { userId } = await context?.params

        if (!userId) {
            throw new ApiError(400, "User id is required")
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid user id")
        }
        const role = req?.roles
        if (!role) {
            throw new ApiError(401, "Please login to update user status")
        }
        if (!role?.some(r => [roles.ADMIN, roles.MODERATOR].includes(r))) {
            throw new ApiError(403, "Forbidden")
        }

        const validate = userUpdateByAdminAndModeratorSchema.validate(data)
        if (validate?.error) {
            throw new ApiError(400, validate.error.message)
        }

        const updateUser = await userModel.findOne({ _id: userId })
        if (!updateUser) {
            throw new ApiError(404, "User not found")
        }
        updateUser.set(data)
        await updateUser.save()

        const user = await userModel.findById({ _id: userId })

        return new ApiResponse(200, user, "User updated successfully")
    },

    // get all users
    getAllUsers: async (req) => {
        const role = req?.roles // logged in user role
        if (!role) {
            throw new ApiError(401, "Please login to get all users")
        }

        const isAdmin = role?.includes(roles.ADMIN)
        const isModerator = role?.includes(roles.MODERATOR)

        if (!isAdmin && !isModerator) {
            throw new ApiError(403, "Forbidden")
        }

        const params = getSearchParams(req)

        const limit = parseInt(params?.limit) || 40
        const page = parseInt(params?.page) || 1
        const skip = (page - 1) * limit
        const userRole = params?.role // for filtering users by role
        const gender = params?.gender // for filtering users by gender

        if (limit > 80) {
            throw new ApiError(400, "Limit cannot be greater than 80")
        }

        const query = {}
        if (userRole && userRole != "all" &&
            /^[a-z0-9]+$/i.test(userRole) && // checking if userRole is a valid alphanumeric
            Object.values(roles).includes(parseInt(userRole))
        ) {
            query.roles = parseInt(userRole)
        }
        if (gender && gender != "all") {
            query.gender = gender
        }

        const users = await userModel.find(query)
            .skip(skip)
            .limit(limit)
            .select("-pass -about -approveCreds")

        const totalUsers = await userModel.countDocuments(query)
        const totalPages = Math.ceil(totalUsers / limit)

        return new ApiResponse(200, { totalPages, users: users }, "Users fetched successfully")
    },

    // get user by id
    getUserById: async (req, context) => {
        const { userId } = await context?.params
        const role = req?.roles // logged in user role
        if (!userId) {
            throw new ApiError(400, "User id is required")
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid user id")
        }

        const user = await userModel.findById({ _id: userId })
            .select(`-pass ${role?.includes(roles.ADMIN) || role?.includes(roles.MODERATOR) ? "" : "-approveCreds -roles"}`)
        if (!user) {
            throw new ApiError(404, "User not found")
        }

        return new ApiResponse(200, user, "User fetched successfully")
    },

    // make moderator
    makeModerator: async (req, context) => {
        const { userId } = await context?.params
        const role = req?.roles // logged in user role
        if (!userId) {
            throw new ApiError(400, "User id is required")
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid user id")
        }
        if (!role || !role?.includes(roles.ADMIN)) {
            throw new ApiError(403, "Forbidden")
        }

        const user = await userModel.findById({ _id: userId, isApproved: true, isBlocked: false, isVerified: true })
        if (!user) {
            throw new ApiError(404, "User not found or not eligible to be made moderator")
        }

        // check moderator count
        // can only have 10 moderators at a time
        const totalModeratorsCount = 10
        const totalModerators = await userModel.countDocuments({ roles: roles.MODERATOR })
        if (totalModerators >= totalModeratorsCount) {
            throw new ApiError(400, `Cannot make more than ${totalModeratorsCount} moderators`)
        }

        if (user.roles.includes(roles.MODERATOR)) {
            throw new ApiError(400, "User is already a moderator")
        }

        user.roles.push(roles.MODERATOR)
        await user.save()

        return new ApiResponse(200, user, "User made moderator successfully")
    },

    // make admin
    makeAdmin: async (req, context) => {
        const { userId } = await context?.params
        const role = req?.roles // logged in user role
        const user = req?.id // logged in user id
        if (!userId) {
            throw new ApiError(400, "User id is required")
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid user id")
        }
        if (!role || !role?.includes(roles.ADMIN)) {
            throw new ApiError(403, "Forbidden")
        }

        // user to be admin
        const userData = await userModel.findById({ _id: userId, isApproved: true, isBlocked: false, isVerified: true })
        if (!userData) {
            throw new ApiError(404, "User not found or not eligible to be made admin")
        }

        // can only have 2 admins at a time
        // when this service is called, the logged in user is must also be an admin and will be removed from admin roles after creating a new admin if there are already 2 admins
        const totalAdminsCount = 2
        const totalAdmins = await userModel.countDocuments({ roles: roles.ADMIN })

        if (userData.roles.includes(roles.ADMIN)) {
            throw new ApiError(400, "User is already an admin")
        }

        userData.roles = [roles.USER, roles.ADMIN]
        await userData.save()

        // if total admins are already 2, remove the logged in user from admin roles
        if (totalAdmins >= totalAdminsCount) {
            const currentuser = await userModel.findById({ _id: user })
            currentuser.roles = [roles.USER] // change the role to user
            await currentuser.save()

            // logging out current user (the admin who is making another user admin)
            const cookie = await cookies()
            cookie.delete('token')
        }

        return new ApiResponse(200, { user: userData, totalAdmins }, "User made admin successfully")
    },

    // user profile
    userProfile: async (req) => {
        const id = req?.id
        const role = req?.roles

        if (!role || !id) {
            throw new ApiError(401, "Please login to view your profile")
        }

        const user = await userModel.findById({ _id: id }).select("-pass").lean()

        if (!user) {
            throw new ApiError(404, "User not found")
        }

        return new ApiResponse(200, user, "User profile fetched successfully")
    }

}

export default userService