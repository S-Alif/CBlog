import { roles } from "@/lib/constants/roleConstants";
import connectDB from "@/lib/db/dbConfig";
import { userModel } from "@/lib/models/user.model";
import { ApiResponse } from "@/lib/utils/api/response/apiResponse";
import { issueToken } from "@/lib/utils/token/tokenHelper";
import { userSchema } from "@/lib/utils/validator/validatorSchemas";
import { ApiError } from "next/dist/server/api-utils";


export const authService = {
    login: async (req) => {
        const body = await req.json()
        if(!body?.email || !body?.pass) {
            throw new ApiError(400, "Email and password are required")
        }
        // connect to database
        await connectDB()

        const userData = await userModel.findOne({ email: body.email }).select("pass")
        if (!userData) {
            throw new ApiError(400, "User not found")
        }

        const isPasswordValid = await userData.verifyPass(body.pass)
        if (!isPasswordValid) {
            throw new ApiError(400, "Invalid password")
        }
        const user = await userModel.findOne({ email: body.email }).select("_id roles email").lean()

        // create token
        const token = await issueToken({id: user?._id, roles: user?.roles, email: user?.email}, "6h")

        return token
    },

    // register user
    registration: async (req) => {
        const body = await req.json()
        const validateUserData = await userSchema.validateAsync(body)
        if (validateUserData?.error) {
            throw new ApiError(400, "Validation error")
        }

        // connect to database
        await connectDB()

        // count admins - can only be 2 admins at a time
        const adminCount = await userModel.countDocuments({ roles: roles.ADMIN })
        if (adminCount >= 2) {
            throw new ApiError(400, "Only 2 admins can be created")
        }

        // check if user already exists
        const existingUser = await userModel.findOne({ email: body.email })
        if (existingUser) {
            throw new ApiError(400, "User already exists")
        }

        // create user
        const user = await userModel.create(body)
        
        return new ApiResponse(200, user, "Registration successful")
    },
    sendOtp: async (req) => {

    },
    verifyOtp: async (req) => {

    },
    updateForgetPass: async (req) => {

    },
}
