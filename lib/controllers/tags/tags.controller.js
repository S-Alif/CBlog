import { controllerHandler } from "@/lib/utils/api/controllerHandler"
import { requireAuth } from "@/lib/utils/api/requireAuth"
import tagService from "./tags.service"
import { roles } from "@/lib/constants/roleConstants"


const tagController = {
    save: controllerHandler(requireAuth(tagService.save, [roles.ADMIN])),
    remove: controllerHandler(requireAuth(tagService.remove, [roles.ADMIN])),
    getAll: controllerHandler(requireAuth(tagService.getAll, [roles.ADMIN, roles.MODERATOR])),
}

export default tagController