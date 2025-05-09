import { Router } from "express";
import { EnrollmentController } from "../controller/enrollment.controller.js";
import { SelfAdminGuard } from "../middleware/self.admin.guard.js";
import { JwtAuthGuard } from "../middleware/jwt.auth.guard.js";


const controller = new EnrollmentController();
const router = Router();


router
    .post('/',JwtAuthGuard, controller.createEnrollment)
    .get('/',JwtAuthGuard,SelfAdminGuard, controller.getAllEnrollment)
    .get('/:id',JwtAuthGuard, controller.getByIdEnrollment)
    .patch('/:id',JwtAuthGuard, controller.updateEnrollment)
    .delete('/:id',JwtAuthGuard, controller.deleteEnrollment)

export default router;