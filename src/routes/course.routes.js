import { Router } from "express";
import { CourseController } from "../controller/course.controller.js";
import { SelfAdminGuard } from "../middleware/self.admin.guard.js";
import { JwtAuthGuard } from "../middleware/jwt.auth.guard.js";


const controller = new CourseController();
const router = Router();


router
    .post('/',JwtAuthGuard, controller.createCourse)
    .get('/',JwtAuthGuard,SelfAdminGuard, controller.getAllCourse)
    .get('/:id',JwtAuthGuard, controller.getByIdCourse)
    .patch('/:id',JwtAuthGuard,SelfAdminGuard, controller.updateCourse)
    .delete('/:id',JwtAuthGuard,SelfAdminGuard, controller.deleteCourse)

export default router;