import userController from "@/lib/controllers/user/user.controller"

export const PATCH = userController.updateUserStatusByAdminAndModerator
export const GET = userController.getUserById
export const PUT = userController.makeModerator