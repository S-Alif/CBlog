// lib/utils/controllerHandler.js
import { asyncHandler } from "./asyncHandler"

export const controllerHandler = (service) => {
    return asyncHandler(async (req) => {
        const result = await service(req)
        return Response.json(result)
    })
}
