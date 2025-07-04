import { controllerHandler } from '../../utils/api/controllerHandler'
import { requireAuth } from '../../utils/api/requireAuth'
import dashboardService from './dahsboard.service'
import { roles } from '../../constants/roleConstants'

const dashboardController = {
	adminDashboard: controllerHandler(requireAuth(dashboardService.adminDashboard, [roles.ADMIN, roles.MODERATOR])),
	userDashboard: controllerHandler(requireAuth(dashboardService.userDashboard, [roles.USER, roles.ADMIN, roles.MODERATOR])),
}

export default dashboardController