import { controllerHandler } from "@/lib/utils/api/controllerHandler";
import { authService } from "./auth.service";

export const authController = {
    login: controllerHandler(authService.login),
    registration: controllerHandler(authService.registration),
    sendOtp: controllerHandler(authService.sendOtp),
    verifyOtp: controllerHandler(authService.verifyOtp),
    updateForgetPass: controllerHandler(authService.updateForgetPass),
}