import { controllerHandler } from "@/lib/utils/api/controllerHandler";
import categoryService from "./category.service";
import { requireAuth } from "@/lib/utils/api/requireAuth";
import { roles } from "@/lib/constants/roleConstants";

const categoryController = {
    save: controllerHandler(requireAuth(categoryService.save, [roles.ADMIN])),
    remove: controllerHandler(requireAuth(categoryService.remove, [roles.ADMIN])),
    getAll: controllerHandler(categoryService.getAll),
}

export default categoryController