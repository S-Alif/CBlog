import { roles } from "@/lib/constants/roleConstants";
import connectDB from "@/lib/db/dbConfig";
import { userModel, otpModel } from "@/lib/models/index";
import { ApiResponse } from "@/lib/utils/api/response/apiResponse";
import { issueToken } from "@/lib/utils/token/tokenHelper";
import { resetPasswordSchema, userSchema } from "@/lib/utils/validator/validatorSchemas";
import { ApiError } from "next/dist/server/api-utils";
import sendEmail from "@/lib/utils/mail/sendMail";
import userRegistrationTemplate from "@/lib/utils/mail/templates/userRegsitration";
import sendOtpTemplate from "@/lib/utils/mail/templates/sendOtp";
import accountUpdateTemplate from "@/lib/utils/mail/templates/accountUpdate";

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
            throw new ApiError(400, validateUserData?.error.message?.replace(/\"/g, ''))
        }

        // count admins - can only be 2 admins at a time
        const adminCount = await userModel.countDocuments({ roles: roles.ADMIN })
        const totalUsers = await userModel.countDocuments({})

        // check if user already exists
        const existingUser = await userModel.findOne({ email: body.email })
        if (existingUser) {
            throw new ApiError(400, "User already exists")
        }

        if (totalUsers === 0 && adminCount < 1) {
            // if no users exist, set the first user as admin
            body.roles = [roles.USER, roles.ADMIN]
        }
        
        // add default profile and banner
        body.image = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${body?.name}&backgroundColor=ecad80,f2d3b1,b6e3f4,c0aede,d1d4f9,ffdfbf,9e5622&backgroundType=solid,gradientLinear&backgroundRotation=0,360,10`
        
        const bannerImages = [
            "https://tinyurl.com/cm7kvcd3",
            "https://tinyurl.com/br6zx3bw",
            "https://tinyurl.com/2btpjtsx",
            "https://tinyurl.com/4vsr5bym",
            "https://tinyurl.com/vcbzxvv4"
        ]
        body.bannerImg = bannerImages[Math.floor(Math.random() * bannerImages.length)]
        

        // create user
        const user = await userModel.create(body)
        const userObject = user.toObject()
        
        // send email to user
        await sendEmail(
            userObject.email,
            userRegistrationTemplate(userObject.name),
            "Registration Successful"
        )

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

        // send otp mail
        await sendEmail(
            body.email,
            sendOtpTemplate(user.name, otp),
            "Account verification"
        )

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
        // it is a must to attach the type 10
        if (body?.type && body?.type == 10) {
            await userModel.updateOne({ email: body.email }, { isVerified: true })
        }

        return new ApiResponse(200, {}, "Account verified successfully")
    },

    // update forget password
    updateForgetPass: async (req) => {
        const body = await req.json()
        const validate = await resetPasswordSchema.validateAsync(body)
        if (validate?.error) throw new ApiError(400, validate?.error.message?.replace(/\"/g, ''))

        const user = await userModel.findOne({ email: body?.email })
        const userObject = user.toObject()
        if (!user) throw new ApiError(400, "User not found")
        user.pass = body?.pass
        user.save()
        

        // notification email to user
        await sendEmail(
            userObject?.email,
            accountUpdateTemplate(userObject?.name, "resetPassword"),
            "Password reset confirmation"
        )
        return new ApiResponse(200, {}, "Password reset successfully")
    },
}
