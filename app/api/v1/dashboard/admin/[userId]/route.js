import userControlller from "@/lib/controllers/user/user.controller"
import dashboardController from '@/lib/controllers/dashboard/dashboard.controller'

export const PUT = userControlller.makeAdmin
export const GET = dashboardController.userDashboard