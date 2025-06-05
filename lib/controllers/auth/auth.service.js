import { roles } from "@/lib/constants/roleConstants";
import connectDB from "@/lib/db/dbConfig";
import { userModel, otpModel } from "@/lib/models/index";
import { ApiResponse } from "@/lib/utils/api/response/apiResponse";
import { issueToken } from "@/lib/utils/token/tokenHelper";
import { resetPasswordSchema, userSchema } from "@/lib/utils/validator/validatorSchemas";
import { ApiError } from "next/dist/server/api-utils";

// connect to database
await connectDB()


export const authService = {

    // login user
    login: async (req) => {
        const body = await req.json()
        if (!body?.email || !body?.pass) {
            throw new ApiError(400, "Email and password are required")
        }

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
        const token = await issueToken({ id: user?._id, roles: user?.roles, email: user?.email }, "6h")

        return token
    },

    // register user
    registration: async (req) => {
        const body = await req.json()
        const validateUserData = await userSchema.validateAsync(body)
        if (validateUserData?.error) {
            throw new ApiError(400, "Validation error")
        }

        // count admins - can only be 2 admins at a time
        const adminCount = await userModel.countDocuments({ roles: roles.ADMIN })
        const totalUsers = await userModel.countDocuments({})
        if (adminCount >= 2) {
            throw new ApiError(400, "Only 2 admins can be created")
        }

        // check if user already exists
        const existingUser = await userModel.findOne({ email: body.email })
        if (existingUser) {
            throw new ApiError(400, "User already exists")
        }

        if (totalUsers === 0 && adminCount < 1) {
            // if no users exist, set the first user as admin
            body.roles = [roles.USER, roles.ADMIN]
        }

        // create user
        const user = await userModel.create(body)

        return new ApiResponse(200, user, "Registration successful")
    },

    // send otp
    sendOtp: async (req) => {
        let body = await req.json()
        if (!body?.email) throw new ApiError(400, "No email provided")

        const user = await userModel.findOne({ email: body?.email }).lean()
        if (!user) throw new ApiError(400, "Account does not exist")

        let otp = Math.floor(100000 + Math.random() * 900000)
        await otpModel.create({ email: body?.email, otp })

        // await sendEmail(email, otpMail(user?.name, otpCode), "Account verification")

        return new ApiResponse(200, {}, "Verification email sent")
    },

    // verify otp
    verifyOtp: async (req) => {
        let body = await req.json()
        if (!body?.email || !body?.otp) throw new ApiError(400, "No email or otp provided")

        const checkOtp = await otpModel.findOne({ email: body?.email, otp: body?.otp })
        if (!checkOtp) throw new ApiError(400, "Otp expired")

        await otpModel.updateOne({ email: body.email, otp: body.otp, isVerified: false }, { isVerified: true })

        // for verifying account after registration
        if (body?.type && body.type == 10) {
            await userModel.updateOne({ email: body.email }, { isVerified: true })
        }

        return new ApiResponse(200, {}, "Account verified successfully")
    },

    // update forget password
    updateForgetPass: async (req) => {
        const body = await req.json()
        const validate = await resetPasswordSchema.validateAsync(body)
        if (validate?.error) throw new ApiError(400, "Validation error")

        const user = await userModel.findOne({ email: body?.email })
        if (!user) throw new ApiError(400, "User not found")
        user.pass = body?.pass
        user.save()

        // notification email to user
        // await sendEmail(data?.email, "", "Password reset confirmation")
        return new ApiResponse(200, {}, "Password reset successfully")
    },
}
