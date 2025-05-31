import { roles } from "@/lib/constants/roleConstants"
import connectDB from "@/lib/db/dbConfig"
import { userModel } from "@/lib/models/user.model"
import { ApiError } from "@/lib/utils/api/response/apiError"
import { ApiResponse } from "@/lib/utils/api/response/apiResponse"
import { getSearchParams } from "@/lib/utils/searchParams/getSearchParams"
import { userSchema, userUpdateByAdminAndModeratorSchema } from "@/lib/utils/validator/validatorSchemas"
import mongoose from "mongoose"

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
        const validate = userSchema.validate(data)
        if (validate?.error) {
            throw new ApiError(400, validate.error.message)
        }

        // remove email from data
        if (data?.email) delete data?.email
        if (data?.approveCreds) delete data?.approveCreds

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
        const {userId} = await context?.params

        if (!userId) {
            throw new ApiError(400, "User id is required")
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

        const updateUser = await userModel.findOne({_id: userId})
        if (!updateUser) {
            throw new ApiError(404, "User not found")
        }
        updateUser.set(data)
        await updateUser.save()

        const user = await userModel.findById({_id: userId})

        return new ApiResponse(200, user, "User updated successfully")
    },

    // get all users
    getAllUsers: async (req) => {
        const role = req?.roles // logged in user role
        if (!role) {
            throw new ApiError(401, "Please login to get all users")
        }
        if (!role?.some(r => [roles.ADMIN, roles.MODERATOR].includes(r))) {
            throw new ApiError(403, "Forbidden")
        }
        const params = getSearchParams(req)

        const limit = parseInt(params?.limit) || 40
        const page = parseInt(params?.page) || 1
        const skip = (page - 1) * limit
        const userRole = params?.role // for filtering users by role
        const gender = params?.gender // for filtering users by gender

        if(limit > 80) {
            throw new ApiError(400, "Limit cannot be greater than 80")
        }

        const query = {}
        if(userRole && userRole != "all" && 
            /^[a-z0-9]+$/i.test(userRole) && // checking if userRole is a valid alphanumeric
            Object.values(roles).includes(parseInt(userRole))
        ) {
            query.roles = parseInt(userRole)
        }
        if(gender && gender != "all") {
            query.gender = gender
        }
        
        const users = await userModel.find(query)
            .skip(skip)
            .limit(limit)
            .select("-pass -approveCreds -about")

        const totalUsers = await userModel.countDocuments(query)
        const totalPages = Math.ceil(totalUsers / limit)

        return new ApiResponse(200, {totalPages, users: users}, "Users fetched successfully")
    }

}

export default userService