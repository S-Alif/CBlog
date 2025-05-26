// lib/utils/controllerHandler.js
import { asyncHandler } from "./asyncHandler"

export const controllerHandler = (service) => {
    return asyncHandler(async (...args) => {
        const result = await service(...args)
        return Response.json(result)
    })
}
