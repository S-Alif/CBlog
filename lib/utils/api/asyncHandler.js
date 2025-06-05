// lib/utils/asyncHandler.js
import { ApiResponse } from "./response/apiResponse"
import { NODE_ENV } from "@/lib/constants/envImports"

export const asyncHandler = (controller) => {
    return async (...args) => {
        try {
            return await controller(...args)
        }
        catch (error) {
            // console.log(error)
            // console.log(error?.code)
            const status = error?.statusCode || error?.code || 500
            const message = error?.message || "Internal Server Error"

            const response = new ApiResponse(status, {}, message)

            if (NODE_ENV === "development") {
                response.stack = error.stack
            }

            return Response.json(response, { status: status ? status > 500 ? 500 : status : 500 })
        }
    }
}
