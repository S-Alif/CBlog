// lib/utils/asyncHandler.js
import { ApiError } from "./response/apiError"
import { ApiResponse } from "./response/apiResponse"
import { NODE_ENV } from "@/lib/constants/envImports"

export const asyncHandler = (controller) => {
    return async (req) => {
        try {
            return await controller(req)
        } 
        catch (error) {
            const status = error.statusCode || 500
            const message = error.message || "Internal Server Error"

            const response = new ApiResponse(status, {}, message)

            if (NODE_ENV === "development") {
                response.stack = error.stack
            }

            return Response.json(response, { status })
        }
    }
}
