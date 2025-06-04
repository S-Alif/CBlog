import { controllerHandler } from "@/lib/utils/api/controllerHandler"
import userService from "./user.service"
import { requireAuth } from "@/lib/utils/api/requireAuth"
import { roles } from "@/lib/constants/roleConstants"


const userController = {
    userUpdate: controllerHandler(requireAuth(userService.userUpdate, [roles.USER])),
    updateUserStatusByAdminAndModerator: controllerHandler(requireAuth(userService.updateUserStatusByAdminAndModerator, [roles.ADMIN, roles.MODERATOR])),
    getAllUsers: controllerHandler(requireAuth(userService.getAllUsers, [roles.ADMIN, roles.MODERATOR])),
    getUserById: controllerHandler(requireAuth(userService.getUserById)),
    makeModerator: controllerHandler(requireAuth(userService.makeModerator, [roles.ADMIN])),
    makeAdmin: controllerHandler(requireAuth(userService.makeAdmin, [roles.ADMIN])),
}

export default userController