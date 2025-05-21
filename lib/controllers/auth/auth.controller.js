import { controllerHandler } from "@/lib/utils/api/controllerHandler";
import { authService } from "./auth.service";
import { asyncHandler } from "@/lib/utils/api/asyncHandler";
import { NODE_ENV } from "@/lib/constants/envImports";
import { cookies } from "next/headers";
import { ApiResponse } from "@/lib/utils/api/response/apiResponse";

export const authController = {
    login: asyncHandler(async (req, res) => {
        let result = await authService.login(req)
        const token = result
        const cookie = await cookies()

        cookie.set({
            name: "token",
            value: token,
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 6, // 6 hours
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
        
        return Response.json(
            new ApiResponse(200, {}, "Login successful")
        )
    }),
    registration: controllerHandler(authService.registration),
    sendOtp: controllerHandler(authService.sendOtp),
    verifyOtp: controllerHandler(authService.verifyOtp),
    updateForgetPass: controllerHandler(authService.updateForgetPass),
}