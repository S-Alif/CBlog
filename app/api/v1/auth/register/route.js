// app/api/auth/route.js
import { authController } from "@/lib/controllers/auth/auth.controller";

// POST /api/auth/register
export const POST = authController.registration